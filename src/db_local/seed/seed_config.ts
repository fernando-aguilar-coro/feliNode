import * as SQLite from 'expo-sqlite';
import { SeedModule, SeedLesson, SeedDependency, SeedExercise } from './types';

export const ensureModule = async (db: SQLite.SQLiteDatabase, moduleData: SeedModule): Promise<number> => {
    let moduleId: number | undefined;
    const moduleCheck = await db.getFirstAsync<{ id: number }>('SELECT id FROM modules WHERE title = ?', [moduleData.title]);

    if (moduleCheck) {
        moduleId = moduleCheck.id;
    } else {
        const moduleResult = await db.runAsync('INSERT INTO modules (title, order_index) VALUES (?, ?)', [moduleData.title, moduleData.order_index]);
        moduleId = moduleResult.lastInsertRowId;

    }
    return moduleId;
};

export const ensureLessons = async (db: SQLite.SQLiteDatabase, moduleId: number, lessons: SeedLesson[]) => {
    for (const l of lessons) {
        // Overwrite or update: delete existing lesson and its children to re-seed fresh content
        await db.runAsync(
            'INSERT OR REPLACE INTO lessons (id, module_id, title, description, theory, status, order_index, youtube_id, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [l.id, moduleId, l.title, l.desc, l.theory || '', l.status, l.order, l.youtubeId || null, l.updated_at || null]
        );


        if (l.exercises) {
            await ensureExercises(db, l.id, l.exercises);
        }
    }
};

/**
 * Inserts module-level DAG dependencies into the local `module_dependencies` table.
 * `dep.child` and `dep.parent` are Supabase module IDs (strings of integers).
 * Resolution: Supabase module IDs are its `order_index` values (1-based).
 * We query the local DB to find the matching local integer ID by order_index.
 */
export const ensureModuleDependencies = async (db: SQLite.SQLiteDatabase, dependencies: SeedDependency[]) => {
    // Build a local lookup: order_index -> local id
    const localModules = await db.getAllAsync<{ id: number; order_index: number }>(
        'SELECT id, order_index FROM modules'
    );
    const orderIndexToLocalId = new Map<number, number>();
    for (const m of localModules) {
        orderIndexToLocalId.set(m.order_index, m.id);
    }

    for (const dep of dependencies) {
        const supChildId = parseInt(dep.child, 10);
        const supParentId = parseInt(dep.parent, 10);

        // Supabase module IDs are 1-based order_index values
        const localChildId = orderIndexToLocalId.get(supChildId);
        const localParentId = orderIndexToLocalId.get(supParentId);

        if (localChildId === undefined || localParentId === undefined) {
            console.warn(`[ensureModuleDependencies] Skipping dep sup(${dep.parent} -> ${dep.child}): no local match found.`);
            continue;
        }

        const existing = await db.getFirstAsync<{ count: number }>(
            'SELECT count(*) as count FROM module_dependencies WHERE module_id = ? AND prerequisite_id = ?',
            [localChildId, localParentId]
        );
        if (!existing || existing.count === 0) {
            await db.runAsync(
                'INSERT INTO module_dependencies (module_id, prerequisite_id) VALUES (?, ?)',
                [localChildId, localParentId]
            );
        }
    }
};

export const ensureExercises = async (db: SQLite.SQLiteDatabase, lessonId: string, exercises: SeedExercise[]) => {
    for (const ex of exercises) {
        // Simple check to avoid duplicates if re-running (though lesson check usually covers this)
        // We will just append if called, but typically this is called only when lesson is new.
        // For robustness, could check if exercise exists, but without explicit IDs it's harder.
        // Assuming this is called only when creating the lesson.
        await db.runAsync(
            'INSERT INTO exercises (lesson_id, type, instruction, content, order_index) VALUES (?, ?, ?, ?, ?)',
            [lessonId, ex.type, ex.instruction, JSON.stringify(ex.content), ex.order_index]
        );
    }
};
