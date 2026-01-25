
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
                .sort((a: any, b: any) => a.order_index - b.order_index)
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

export const getAllDependencies = async (): Promise<import('../db_local/seed/types').SeedDependency[]> => {
    try {
        const { data: dependencies, error } = await supabase
            .from('lesson_dependencies')
            .select('*');

        if (error) {
            console.error('Error fetching dependencies:', error);
            throw error;
        }

        if (!dependencies) return [];

        return dependencies.map((d: any) => ({
            child: d.lesson_id,
            parent: d.prerequisite_id
        }));

    } catch (err) {
        console.error('Unexpected error in getAllDependencies:', err);
        return [];
    }
};
