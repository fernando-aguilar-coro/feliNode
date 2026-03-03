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
            'INSERT OR REPLACE INTO lessons (id, module_id, title, description, theory, status, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [l.id, moduleId, l.title, l.desc, l.theory || '', l.status, l.order]
        );


        if (l.exercises) {
            await ensureExercises(db, l.id, l.exercises);
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
