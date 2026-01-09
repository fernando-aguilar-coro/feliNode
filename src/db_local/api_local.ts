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
// Seed function for basic testing
export const seedDatabase = async () => {
    try {
        if (!db) await init();

        console.log('[DB_SEED] Starting seed process...');

        // 2. Create the Module (Unit)
        // Check if module exists first
        let moduleId: number | undefined;
        const moduleCheck = await db!.getFirstAsync<{ id: number }>('SELECT id FROM modules WHERE title = ?', ['Unit 1: Basics']);

        if (moduleCheck) {
            moduleId = moduleCheck.id;
        } else {
            const moduleResult = await db!.runAsync('INSERT INTO modules (title, order_index) VALUES (?, ?)', ['Unit 1: Basics', 1]);
            moduleId = moduleResult.lastInsertRowId;
            console.log('[DB_SEED] Module created with ID:', moduleId);
        }

        // 3. Create the Lesson
        const lesson1Id = 'lesson_verbs_intro';
        const lessonCheck = await db!.getFirstAsync<{ count: number }>('SELECT count(*) as count FROM lessons WHERE id = ?', [lesson1Id]);

        if (!lessonCheck || lessonCheck.count === 0) {
            await db!.runAsync(
                'INSERT INTO lessons (id, module_id, title, description, status, order_index) VALUES (?, ?, ?, ?, ?, ?)',
                [lesson1Id, moduleId, 'Lesson 1', 'Introduction to Verbs', 'available', 1]
            );
            console.log('[DB_SEED] Lesson created.');

            // 4. Add Theory Content ONLY if lesson is new (simplified logic)
            await db!.runAsync(
                'INSERT INTO lesson_theory (lesson_id, content, order_index) VALUES (?, ?, ?)',
                [lesson1Id, 'Verbs are action words.', 1]
            );
        } else {
            console.log('[DB_SEED] Lesson already exists.');
        }

        // 5. Check and Create Exercises
        const exercisesCheck = await db!.getFirstAsync<{ count: number }>('SELECT count(*) as count FROM exercises WHERE lesson_id = ?', [lesson1Id]);

        // If no exercises exist for this lesson, we seed them. 
        // This handles the "Partial Seed" case where Lesson exists but Exercises don't.
        if (!exercisesCheck || exercisesCheck.count === 0) {
            console.log('[DB_SEED] Seeding exercises...');

            // --- Exercise 1: Fill in the Blanks ---
            const ex1Content = JSON.stringify({
                prefix_text: 'I ',
                suffix_text: ' playing soccer.',
                hint: 'am/is/are',
                correct_answer: 'am'
            });

            await db!.runAsync(
                'INSERT INTO exercises (lesson_id, type, instruction, content, order_index) VALUES (?, ?, ?, ?, ?)',
                [lesson1Id, 'fill_blanks', 'Complete the sentence', ex1Content, 1]
            );

            // --- Exercise 2: Multiple Choice ---
            const ex2Content = JSON.stringify({
                options: [
                    { option_text: 'is', is_correct: 1 },
                    { option_text: 'are', is_correct: 0 }
                ],
                correctAnswer: 'is'
            });

            await db!.runAsync(
                'INSERT INTO exercises (lesson_id, type, instruction, content, order_index) VALUES (?, ?, ?, ?, ?)',
                [lesson1Id, 'multiple_choice', 'What is singular : ', ex2Content, 2]
            );
            console.log('[DB_SEED] Exercises seeded.');
        } else {
            console.log('[DB_SEED] Exercises already exist.');
        }

        console.log('[DB_SEED] Seeding complete successfully.');

    } catch (error) {
        console.error('[DB_SEED] Error during database seeding:', error);
    }
};
