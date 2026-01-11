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
        console.log('[DB_SEED] Module created with ID:', moduleId);
    }
    return moduleId;
};

export const ensureLessons = async (db: SQLite.SQLiteDatabase, moduleId: number, lessons: SeedLesson[]) => {
    for (const l of lessons) {
        const existing = await db.getFirstAsync<{ count: number }>('SELECT count(*) as count FROM lessons WHERE id = ?', [l.id]);
        if (!existing || existing.count === 0) {
            await db.runAsync(
                'INSERT INTO lessons (id, module_id, title, description, status, order_index) VALUES (?, ?, ?, ?, ?, ?)',
                [l.id, moduleId, l.title, l.desc, l.status, l.order]
            );

            if (l.theory) {
                await db.runAsync(
                    'INSERT INTO lesson_theory (lesson_id, content, order_index) VALUES (?, ?, ?)',
                    [l.id, JSON.stringify(l.theory), 1] // Assuming 1 theory entry for now
                );
            }

            if (l.exercises) {
                await ensureExercises(db, l.id, l.exercises);
            }
        }
    }
};

export const ensureDependencies = async (db: SQLite.SQLiteDatabase, dependencies: SeedDependency[]) => {
    for (const dep of dependencies) {
        const existing = await db.getFirstAsync<{ count: number }>('SELECT count(*) as count FROM lesson_dependencies WHERE lesson_id = ? AND prerequisite_id = ?', [dep.child, dep.parent]);
        if (!existing || existing.count === 0) {
            await db.runAsync(
                'INSERT INTO lesson_dependencies (lesson_id, prerequisite_id) VALUES (?, ?)',
                [dep.child, dep.parent]
            );
            console.log(`[DB_SEED] Added dependency: ${dep.parent} -> ${dep.child}`);
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
