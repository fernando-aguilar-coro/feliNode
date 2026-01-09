import * as SQLite from 'expo-sqlite';
import { initDatabase } from './db';

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

export const getTheoryByLessonId = async (lessonId: string) => {
    if (!db) await init();
    return await db!.getAllAsync('SELECT * FROM lesson_theory WHERE lesson_id = ? ORDER BY order_index ASC', [lessonId]);
}

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
        }
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
    children: string[];
}

export const getLessonNodes = async (): Promise<LessonNode[]> => {
    if (!db) await init();
    const rows: any[] = await db!.getAllAsync('SELECT id, title, description, status, children FROM lessons ORDER BY order_index ASC');

    const completedLessons = await getCompletedLessons();

    return rows.map(row => {
        let status = row.status;
        if (completedLessons.includes(row.id)) {
            status = 'completed';
        }

        return {
            ...row,
            status,
            children: JSON.parse(row.children || '[]')
        };
    });
};
