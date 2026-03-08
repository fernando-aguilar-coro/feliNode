import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDatabase } from '../db';
import { INITIAL_DATA } from './initial_data';
import { ensureModule, ensureLessons } from './seed_config';
import { SeedModule, SeedLesson } from './types';
import { getAllLessons, getAllDependencies } from '../../api/GetAllLessons';
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

        const hasSeeded = await AsyncStorage.getItem('HAS_SEEDED_DB');
        if (hasSeeded === 'true') {

            return;
        }

        // Seed from Supabase
        const supabaseLessons = await getAllLessons();

        // Seed Placement Tests
        if (INITIAL_DATA.placement_tests && INITIAL_DATA.placement_tests.length > 0) {
            const fallbackModule: SeedModule = {
                title: 'Examenes',
                order_index: 0,
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

            const dependencies = await getAllDependencies();
            if (dependencies.length > 0) {

                const { ensureDependencies } = await import('./seed_config');
                await ensureDependencies(dbInstance, dependencies);
            } else {

            }

        } else {

        }


        await AsyncStorage.setItem('HAS_SEEDED_DB', 'true');
    } catch (error) {
        console.error('[DB_SEED] Error during database seeding:', error);
    }
};
