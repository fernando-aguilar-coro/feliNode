import { supabase } from './supabaseClient';
import { SeedLesson } from '../db_local/seed/types';

export const getAllLessons = async (): Promise<SeedLesson[]> => {
    try {
        const { data: lessons, error } = await supabase
            .from('lessons')
            .select(`
        *,
        exercises (*),
        modules (
            title,
            order_index
        )
      `)
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching lessons:', error);
            throw error;
        }

        if (!lessons) return [];

        // Map Supabase response to SeedLesson structure
        return lessons.map((l: any) => ({
            id: l.id,
            title: l.title,
            desc: l.description || '', // Map description to desc
            status: l.status,
            order: l.order_index, // Map order_index to order
            theory: l.theory,
            moduleId: l.module_id,
            moduleTitle: l.modules?.title,
            moduleOrder: l.modules?.order_index,
            exercises: (l.exercises || [])
                .map((e: any) => ({
                    type: e.type,
                    instruction: e.instruction,
                    content: e.content,
                    order_index: e.order_index
                }))
        }));
    } catch (err) {
        console.error('Unexpected error in getAllLessons:', err);
        return [];
    }
};

/** Fetches module-level DAG dependencies from Supabase.
 *  Returns each edge as { child: child_order_index, parent: parent_order_index } (both as strings).
 *  Using order_index allows local SQLite resolution without knowing Supabase's internal IDs. */
export const getAllModuleDependencies = async (): Promise<import('../db_local/seed/types').SeedDependency[]> => {
    try {
        // We need order_index of both modules, so we fetch all modules and build a lookup
        const { data: modules, error: modError } = await supabase
            .from('modules')
            .select('id, order_index');

        if (modError || !modules) {
            console.error('[GetAllLessons] Error fetching modules for dependency resolution:', modError);
            return [];
        }

        const idToOrderIndex = new Map<number, number>();
        for (const m of modules) {
            idToOrderIndex.set(m.id, m.order_index);
        }

        const { data: dependencies, error } = await supabase
            .from('module_dependencies')
            .select('module_id, prerequisite_id');

        if (error) {
            console.error('[GetAllLessons] Error fetching module_dependencies:', error);
            throw error;
        }

        if (!dependencies) return [];

        return dependencies
            .map((d: any) => ({
                child: String(idToOrderIndex.get(d.module_id) ?? -1),
                parent: String(idToOrderIndex.get(d.prerequisite_id) ?? -1)
            }))
            .filter(dep => dep.child !== '-1' && dep.parent !== '-1');

    } catch (err) {
        console.error('[GetAllLessons] Unexpected error in getAllModuleDependencies:', err);
        return [];
    }
};
