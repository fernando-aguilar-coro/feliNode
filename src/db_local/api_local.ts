import * as SQLite from 'expo-sqlite';
import { initDatabase } from './db';
import { updateUser } from '../api/UpdateUser';

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
        }
        // 2. Add if not exists
        if (!completed.includes(lessonId)) {
            completed.push(lessonId);
            const json = JSON.stringify(completed);

            // 3. Save back
            const now = new Date().toISOString();
            await db!.runAsync('UPDATE user_progress SET lessons_completed = ?, updated_at = ? WHERE id = ?', [json, now, profile.id || 1]);

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
        updateUser(completed).catch(err => {
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

export const setCompletedLessons = async (completedLessons: string[]) => {
    if (!db) await init();
    const json = JSON.stringify(completedLessons);
    const now = new Date().toISOString();

    // Check if profile exists
    const profile: any = await db!.getFirstAsync('SELECT id FROM user_progress LIMIT 1');

    if (profile) {
        await db!.runAsync('UPDATE user_progress SET lessons_completed = ?, updated_at = ? WHERE id = ?', [json, now, profile.id]);
    } else {
        await db!.runAsync('INSERT INTO user_progress (lessons_completed, updated_at) VALUES (?, ?)', [json, now]);
    }
};

export const clearUserProgress = async () => {
    if (!db) await init();
    try {
        await db!.runAsync('DELETE FROM user_progress');
        console.log('[DB] User progress cleared.');
    } catch (error) {
        console.error('[DB] Error clearing user progress:', error);
    }
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
    const lessons: any[] = await db!.getAllAsync("SELECT id, title, description, status FROM lessons WHERE id NOT LIKE 'placement_test%' ORDER BY order_index ASC");

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
        const parents = dependencyMap.get(row.id) || [];
        let status = row.status;

        if (completedLessons.includes(row.id)) {
            status = 'completed';
        } else {
            // Not completed check dependencies logic
            if (parents.length > 0) {
                const allParentsCompleted = parents.every(p => completedLessons.includes(p));
                if (allParentsCompleted) {
                    status = 'available';
                } else {
                    status = 'locked';
                }
            }
            // If no parents, we trust the DB status (usually 'available' for root nodes)
        }

        return {
            ...row,
            status,
            parents
        };
    });
};

export const saveInfinityScore = async (targetId: string, score: number) => {
    if (!db) await init();
    try {
        const existing: any = await db!.getFirstAsync('SELECT max_score FROM infinity_progress WHERE target_id = ?', [targetId]);

        if (existing) {
            if (score > existing.max_score) {
                await db!.runAsync('UPDATE infinity_progress SET max_score = ?, updated_at = ? WHERE target_id = ?', [score, new Date().toISOString(), targetId]);
                console.log(`[DB] Updated max score for ${targetId} to ${score}`);
            } else {
                console.log(`[DB] Score ${score} not higher than existing ${existing.max_score} for ${targetId}`);
            }
        } else {
            await db!.runAsync('INSERT INTO infinity_progress (target_id, max_score, updated_at) VALUES (?, ?, ?)', [targetId, score, new Date().toISOString()]);
            console.log(`[DB] Inserted new score for ${targetId}: ${score}`);
        }
    } catch (error) {
        console.error('[DB] Error saving infinity score:', error);
    }
};

export const getInfinityScore = async (targetId: string): Promise<number> => {
    if (!db) await init();
    try {
        const result: any = await db!.getFirstAsync('SELECT max_score FROM infinity_progress WHERE target_id = ?', [targetId]);
        return result?.max_score || 0;
    } catch (error) {
        console.error('[DB] Error getting infinity score:', error);
        return 0;
    }
};


// Bulk operations for Sync
export const getAllInfinityProgress = async (): Promise<{ target_id: string; max_score: number }[]> => {
    if (!db) await init();
    try {
        const results: any[] = await db!.getAllAsync('SELECT target_id, max_score FROM infinity_progress');
        return results;
    } catch (error) {
        console.error('[DB] Error getting all infinity progress:', error);
        return [];
    }
};

export const saveInfinityScoreBulk = async (records: { target_id: string; max_score: number }[]) => {
    if (!db) await init();
    if (records.length === 0) return;

    try {
        // Use a transaction for bulk inserts/updates
        await db!.withTransactionAsync(async () => {
            const now = new Date().toISOString();
            for (const record of records) {
                // Upsert logic:
                // We want to update ONLY if the NEW score is higher than the OLD score (if any).
                // "INSERT ... ON CONFLICT(target_id) DO UPDATE SET max_score = excluded.max_score WHERE excluded.max_score > infinity_progress.max_score"

                await db!.runAsync(
                    `INSERT INTO infinity_progress (target_id, max_score, updated_at) 
                     VALUES (?, ?, ?) 
                     ON CONFLICT(target_id) DO UPDATE SET 
                     max_score = excluded.max_score, 
                     updated_at = excluded.updated_at
                     WHERE excluded.max_score > infinity_progress.max_score`,
                    [record.target_id, record.max_score, now]
                );
            }
        });
        console.log(`[DB] Bulk sync attempted for ${records.length} infinity scores.`);
    } catch (error) {
        console.error('[DB] Error bulk saving infinity scores:', error);
    }
};


