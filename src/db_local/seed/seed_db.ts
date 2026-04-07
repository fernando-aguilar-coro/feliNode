import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDatabase } from '../db';
import { INITIAL_DATA } from './initial_data';
import { ensureModule, ensureLessons } from './seed_config';
import { SeedModule, SeedLesson } from './types';
import { getAllLessons, getAllModuleDependencies } from '../../api/GetAllLessons';
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

        // Check local lessons count
        const result = await dbInstance.getAllAsync<{ count: number }>('SELECT COUNT(*) as count FROM lessons');
        const localLessonsCount = result[0]?.count || 0;

        let hasSeeded = await AsyncStorage.getItem('HAS_SEEDED_DB');

        // Check if lessons count in Supabase differs from local
        const { checkLessonsUpdate } = await import('../../api/checkLessonsUpdate');
        const needsUpdate = await checkLessonsUpdate();

        if (needsUpdate) {
            console.log('[DB_SEED] Lessons mismatch detected, forcing re-sync from Supabase');
            hasSeeded = null;
            await AsyncStorage.removeItem('HAS_SEEDED_DB');
        }

        // Only skip if already marked as seeded AND we have at least 5 lessons in local DB
        if (hasSeeded === 'true' && localLessonsCount >= 5 && !needsUpdate) {
            // Backfill: if module_dependencies is empty (first run after migration), seed it
            const depCount = await dbInstance.getFirstAsync<{ count: number }>(
                'SELECT COUNT(*) as count FROM module_dependencies'
            );
            if (!depCount || depCount.count === 0) {
                console.log('[DB_SEED] module_dependencies is empty, backfilling from Supabase...');
                const moduleDeps = await getAllModuleDependencies();
                if (moduleDeps.length > 0) {
                    const { ensureModuleDependencies } = await import('./seed_config');
                    await ensureModuleDependencies(dbInstance, moduleDeps);
                    console.log(`[DB_SEED] Backfilled ${moduleDeps.length} module dependencies.`);
                }
            }
            return;
        }

        // Seed from Supabase
        let supabaseLessons = await getAllLessons();

        let retryCount = 0;
        const MAX_RETRIES = 3;
        while (supabaseLessons.length === 0 && localLessonsCount < 5 && retryCount < MAX_RETRIES) {
            console.log(`[DB_SEED] No lessons fetched, retrying getAllLessons... (${retryCount + 1}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, 3000)); // wait 3 seconds
            supabaseLessons = await getAllLessons();
            retryCount++;
        }

        // Seed Placement Tests
        if (INITIAL_DATA.placement_tests && INITIAL_DATA.placement_tests.length > 0) {
            const fallbackModule: SeedModule = {
                title: 'Examenes',
                order_index: 999,
                lessons: [],
                dependencies: []
            };
            const newId = await ensureModule(dbInstance, fallbackModule);
            if (newId) {
                await ensureLessons(dbInstance, newId, INITIAL_DATA.placement_tests);
            }
        }

        if (supabaseLessons.length > 0) {


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

            // Seed each module and register Supabase → local ID mapping. 
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

            // Seed Module Dependencies (DAG)
            const moduleDeps = await getAllModuleDependencies();
            if (moduleDeps.length > 0) {
                const { ensureModuleDependencies } = await import('./seed_config');
                await ensureModuleDependencies(dbInstance, moduleDeps);
                console.log(`[DB_SEED] Seeded ${moduleDeps.length} module dependencies.`);
            }

            // Successfully fetched and seeded from Supabase
            await AsyncStorage.setItem('HAS_SEEDED_DB', 'true');
        } else {
            // Supabase lessons array is empty (possibly due to network error)
            // If we already have lessons locally, we can mark as seeded
            if (localLessonsCount >= 5) {
                await AsyncStorage.setItem('HAS_SEEDED_DB', 'true');
            } else {
                console.warn('[DB_SEED] No lessons fetched from Supabase and local DB has < 5 lessons. Will retry on next start.');
                await AsyncStorage.removeItem('HAS_SEEDED_DB');
            }
        }

    } catch (error) {
        console.error('[DB_SEED] Error during database seeding:', error);
        await AsyncStorage.removeItem('HAS_SEEDED_DB');
    }
};
