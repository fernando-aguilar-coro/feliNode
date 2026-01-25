import * as SQLite from 'expo-sqlite';
import { initDatabase } from '../db';
import { INITIAL_DATA } from './initial_data';
import { ensureModule, ensureLessons } from './seed_config';
import { SeedModule, SeedLesson } from './types';

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

        // Seed Placement Tests
        if (INITIAL_DATA.placement_tests && INITIAL_DATA.placement_tests.length > 0) {
            const fallbackModule: SeedModule = {
                title: 'initial_exam',
                order_index: 0,
                lessons: [],
                dependencies: []
            };
            const newId = await ensureModule(dbInstance, fallbackModule);
            if (newId) {
                await ensureLessons(dbInstance, newId, INITIAL_DATA.placement_tests);
            }
        }

        // Seed from Supabase
        console.log('[DB_SEED] Fetching lessons from Supabase...');
        const { getAllLessons, getAllDependencies } = await import('../../api/GetAllLessons');
        const supabaseLessons = await getAllLessons();

        if (supabaseLessons.length > 0) {
            console.log(`[DB_SEED] Found ${supabaseLessons.length} lessons from Supabase.`);

            // Group by module
            const lessonsByModule = new Map<number, SeedLesson[]>();
            const moduleInfo = new Map<number, { title: string, order: number }>();

            for (const l of supabaseLessons) {
                if (!l.moduleId) continue;

                if (!lessonsByModule.has(l.moduleId)) {
                    lessonsByModule.set(l.moduleId, []);
                    moduleInfo.set(l.moduleId, {
                        title: l.moduleTitle || `Module ${l.moduleId}`,
                        order: l.moduleOrder || 0
                    });
                }
                lessonsByModule.get(l.moduleId)?.push(l);
            }

            // Seed each module
            for (const [modId, lessons] of lessonsByModule.entries()) {
                const info = moduleInfo.get(modId)!;
                const modData: SeedModule = {
                    title: info.title,
                    order_index: info.order,
                    lessons: lessons,
                    dependencies: []
                };

                const dbModId = await ensureModule(dbInstance, modData);
                if (dbModId) {
                    await ensureLessons(dbInstance, dbModId, lessons);
                }
            }

            // Seed Dependencies
            console.log('[DB_SEED] Fetching dependencies from Supabase...');
            const dependencies = await getAllDependencies();
            if (dependencies.length > 0) {
                console.log(`[DB_SEED] Found ${dependencies.length} dependencies.`);
                const { ensureDependencies } = await import('./seed_config');
                await ensureDependencies(dbInstance, dependencies);
            } else {
                console.log('[DB_SEED] No dependencies found.');
            }

        } else {
            console.log('[DB_SEED] No lessons found in Supabase.');
        }

        console.log('[DB_SEED] Seeding complete successfully.');
    } catch (error) {
        console.error('[DB_SEED] Error during database seeding:', error);
    }
};
