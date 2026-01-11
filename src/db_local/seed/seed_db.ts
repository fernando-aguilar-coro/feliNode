import * as SQLite from 'expo-sqlite';
import { initDatabase } from '../db';
import { INITIAL_DATA } from './initial_data';
import { ensureModule, ensureLessons, ensureDependencies, ensureExercises } from './seed_config';

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

        // 1. Seed Modules and their contents
        for (const moduleData of INITIAL_DATA.modules) {
            const moduleId = await ensureModule(dbInstance, moduleData);
            if (moduleId) {
                await ensureLessons(dbInstance, moduleId, moduleData.lessons);
                if (moduleData.dependencies) {
                    await ensureDependencies(dbInstance, moduleData.dependencies);
                }
            }
        }

        // 2. Seed Placement Test (Special Case)
        if (INITIAL_DATA.placement_test) {
            // Placement test technically might not need a module ID or could use a dummy one.
            // The original code used the LAST created module ID for placement test, or hardcoded behavior.
            // Let's check how it was: it used `moduleId` variable which held the last inserted module.
            // But wait, the placement test insert query used `moduleId`.
            // So we probably should attach it to the first module or a "General" module.
            // For now, let's fetch the Unit 1 ID again or just assume it exists if we just ran it.
            // A safer bet is to get the module ID for "Unit 1: Foundations" specifically if we want to mimic exact behavior,
            // OR just insert it with dependency on the module we just processed.

            // To keep it simple and robust: Let's find "Unit 1: Foundations" id.
            const moduleCheck = await dbInstance.getFirstAsync<{ id: number }>('SELECT id FROM modules WHERE title = ?', ['Unit 1: Foundations']);
            if (moduleCheck) {
                // We treat placement test as a lesson but with special handling if needed
                // The original code did:
                /*
                await dbInstance.runAsync(
                    'INSERT INTO lessons (id, module_id, title, description, status, order_index) VALUES (?, ?, ?, ?, ?, ?)',
                    [placementTestId, moduleId, 'Placement Test', 'Evaluate your level', 'available', 0]
                );
                */
                // So we can reuse ensureLessons if we wrap it in an array
                await ensureLessons(dbInstance, moduleCheck.id, [INITIAL_DATA.placement_test]);
            }
        }

        console.log('[DB_SEED] Seeding complete successfully.');

    } catch (error) {
        console.error('[DB_SEED] Error during database seeding:', error);
    }
};
