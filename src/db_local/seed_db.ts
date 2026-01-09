import * as SQLite from 'expo-sqlite';
import { initDatabase } from './db';

let db: SQLite.SQLiteDatabase | null = null;

const init = async () => {
    if (!db) {
        db = await initDatabase();
    }
    return db;
};

export const seedDatabase = async () => {
    try {
        const dbInstance = await init();

        console.log('[DB_SEED] Starting seed process...');

        // 1. Create the Module (Unit)
        let moduleId: number | undefined;
        const moduleCheck = await dbInstance.getFirstAsync<{ id: number }>('SELECT id FROM modules WHERE title = ?', ['Unit 1: Foundations']);

        if (moduleCheck) {
            moduleId = moduleCheck.id;
        } else {
            const moduleResult = await dbInstance.runAsync('INSERT INTO modules (title, order_index) VALUES (?, ?)', ['Unit 1: Foundations', 1]);
            moduleId = moduleResult.lastInsertRowId;
            console.log('[DB_SEED] Module created with ID:', moduleId);
        }

        // 2. Define Lesson IDs
        const l1 = 'lesson_intro';
        const l2 = 'lesson_basics';
        const l3 = 'lesson_vocab';
        const l4 = 'lesson_conjugation';
        const l5 = 'lesson_final_quiz';

        // 3. Clear existing lessons if needed (for fresh testing)
        // await dbInstance.runAsync('DELETE FROM lessons WHERE module_id = ?', [moduleId]);

        const lessonCheck = await dbInstance.getFirstAsync<{ count: number }>('SELECT count(*) as count FROM lessons WHERE module_id = ?', [moduleId]);

        if (!lessonCheck || lessonCheck.count === 0) {
            console.log('[DB_SEED] Creating lesson tree...');

            // Tree Structure:
            // Intro (l1) -> [Basics (l2), Vocab (l3)]
            // Basics (l2) -> Conjugation (l4)
            // Vocab (l3) -> Conjugation (l4)
            // Conjugation (l4) -> Final Quiz (l5)

            const lessons = [
                { id: l1, title: 'Welcome', desc: 'Start your journey', status: 'available', order: 1, children: [l2, l3] },
                { id: l2, title: 'Grammar Basics', desc: 'Learn the structure', status: 'locked', order: 2, children: [l4] },
                { id: l3, title: 'Essential Vocab', desc: 'Words you must know', status: 'locked', order: 3, children: [l4] },
                { id: l4, title: 'Verb Mastery', desc: 'Conjugation rules', status: 'locked', order: 4, children: [l5] },
                { id: l5, title: 'Unit 1 Quiz', desc: 'Test your knowledge', status: 'locked', order: 5, children: [] },
            ];

            for (const l of lessons) {
                await dbInstance.runAsync(
                    'INSERT INTO lessons (id, module_id, title, description, status, order_index, children) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [l.id, moduleId, l.title, l.desc, l.status, l.order, JSON.stringify(l.children)]
                );
            }

            // 4. Add Sample Theory to Intro
            await dbInstance.runAsync(
                'INSERT INTO lesson_theory (lesson_id, content, order_index) VALUES (?, ?, ?)',
                [l1, JSON.stringify({ sections: [{ type: 'text', content: 'Welcome to Felinode! In this module, you will learn the basics.' }] }), 1]
            );

            // 5. Add a sample exercise to Intro
            const exContent = JSON.stringify({
                segments: ['Felinode', 'to', 'Welcome'],
                correct_answer: 'Welcome to Felinode'
            });

            await dbInstance.runAsync(
                'INSERT INTO exercises (lesson_id, type, instruction, content, order_index) VALUES (?, ?, ?, ?, ?)',
                [l1, 'scrambled_sentence', 'Arrange the words', exContent, 1]
            );

            console.log('[DB_SEED] Lesson tree and content seeded.');
        } else {
            console.log('[DB_SEED] Seed data already present.');
        }

        console.log('[DB_SEED] Seeding complete successfully.');

    } catch (error) {
        console.error('[DB_SEED] Error during database seeding:', error);
    }
};
