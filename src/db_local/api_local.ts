import * as SQLite from 'expo-sqlite';
import { initDatabase } from './db';
import { syncUserProgress } from '../api/sync';

let db: SQLite.SQLiteDatabase | null = null;

export const init = async () => {
    if (!db) {
        db = await initDatabase();
    }
};

export const getModules = async () => {
    if (!db) await init();
    return await db!.getAllAsync('SELECT * FROM modules ORDER BY order_index ASC');
};

export const getLessonsByModuleId = async (moduleId: number) => {
    if (!db) await init();
    return await db!.getAllAsync('SELECT * FROM lessons WHERE module_id = ? ORDER BY order_index ASC', [moduleId]);
};

export const getLessonById = async (lessonId: string) => {
    if (!db) await init();
    return await db!.getFirstAsync('SELECT * FROM lessons WHERE id = ?', [lessonId]);
};



export const getExercisesByLessonId = async (lessonId: string) => {
    if (!db) await init();
    // Simplified query: No joins needed, just SELECT *
    const exercises: any[] = await db!.getAllAsync('SELECT * FROM exercises WHERE lesson_id = ? ORDER BY order_index ASC', [lessonId]);
    return exercises;
};

export const saveUserProgress = async (lessonId: string, score: number) => {
    if (!db) await init();

    // Only mark as completed if score is passing (e.g. >= 80)
    // The user requested "lessons_complete : array de text" logic
    if (score >= 80) {
        // 1. Get current progress
        let profile: any = await db!.getFirstAsync('SELECT * FROM user_progress LIMIT 1');

        let completed: string[] = [];
        if (profile) {
            completed = JSON.parse(profile.lessons_completed);
        } else {
            // Create profile if not exists
            await db!.runAsync('INSERT INTO user_progress (lessons_completed) VALUES ("[]")');
            profile = { id: 1 };
        }

        // 2. Add if not exists
        if (!completed.includes(lessonId)) {
            completed.push(lessonId);
            const json = JSON.stringify(completed);

            // 3. Save back
            await db!.runAsync('UPDATE user_progress SET lessons_completed = ? WHERE id = ?', [json, profile.id || 1]);

            // 4. Unlock next lessons
            // Find all lessons that depend on this one
            const dependents: any[] = await db!.getAllAsync(
                'SELECT lesson_id FROM lesson_dependencies WHERE prerequisite_id = ?',
                [lessonId]
            );

            for (const dep of dependents) {
                const targetLessonId = dep.lesson_id;

                // Check if targetLessonId has OTHER prerequisites
                const prerequisites: any[] = await db!.getAllAsync(
                    'SELECT prerequisite_id FROM lesson_dependencies WHERE lesson_id = ?',
                    [targetLessonId]
                );

                console.log(`[DEBUG] Checking unlocking for lesson ${targetLessonId}. Prerequisites: ${JSON.stringify(prerequisites)}. Completed: ${JSON.stringify(completed)}`);

                const allMet = prerequisites.every(p => completed.includes(p.prerequisite_id));
                console.log(`[DEBUG] All prerequisites met for ${targetLessonId}? ${allMet}`);

                if (allMet) {
                    // Unlock the lesson!
                    await db!.runAsync(
                        'UPDATE lessons SET status = ? WHERE id = ? AND status = ?',
                        ['available', targetLessonId, 'locked']
                    );
                }
            }
        }

        // [SYNC] Attempt to sync with backend (non-blocking)
        syncUserProgress(completed).catch(err => {
            console.log('[Sync] Background sync failed (harmless for local usage):', err);
        });
    }
};

// Helper to get completd lessons array
export const getCompletedLessons = async (): Promise<string[]> => {
    if (!db) await init();
    const profile: any = await db!.getFirstAsync('SELECT lessons_completed FROM user_progress LIMIT 1');
    if (!profile) return [];
    return JSON.parse(profile.lessons_completed);
};

export const isLessonCompleted = async (lessonId: string) => {
    const completed = await getCompletedLessons();
    return completed.includes(lessonId);
};

export const getLessonStatus = async (lessonId: string) => {
    // 1. Check user progress (Complete)
    const isCompleted = await isLessonCompleted(lessonId);
    if (isCompleted) return 'completed';

    // 2. Check lesson table default (Available/Locked)
    if (!db) await init();
    const res: any = await db!.getFirstAsync('SELECT status FROM lessons WHERE id = ?', [lessonId]);
    return res?.status || 'locked';
};

export interface LessonNode {
    id: string;
    title: string;
    description: string;
    status: string;
    parents: string[]; // List of parent IDs
}

export const getLessonNodes = async (): Promise<LessonNode[]> => {
    if (!db) await init();

    // Fetch lessons
    const lessons: any[] = await db!.getAllAsync('SELECT id, title, description, status FROM lessons ORDER BY order_index ASC');

    // Fetch dependencies
    const dependencies: any[] = await db!.getAllAsync('SELECT lesson_id, prerequisite_id FROM lesson_dependencies');

    // Map dependencies to lessons
    const dependencyMap = new Map<string, string[]>();
    dependencies.forEach(dep => {
        if (!dependencyMap.has(dep.lesson_id)) {
            dependencyMap.set(dep.lesson_id, []);
        }
        dependencyMap.get(dep.lesson_id)?.push(dep.prerequisite_id);
    });

    // Check completed status
    const completedLessons = await getCompletedLessons();

    return lessons.map(row => {
        let status = row.status;
        if (completedLessons.includes(row.id)) {
            status = 'completed';
        }

        return {
            ...row,
            status,
            parents: dependencyMap.get(row.id) || []
        };
    });
};
