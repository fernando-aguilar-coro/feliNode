import { supabase } from './supabaseClient';
import { initDatabase } from '../db_local/db';

export const checkLessonsUpdate = async (): Promise<boolean> => {
    try {
        const db = await initDatabase();

        // Get local lessons data
        const localLessons = await db.getAllAsync<{ id: string, theory: string | null, order_index: number, module_id: number }>('SELECT id, theory, order_index, module_id FROM lessons');

        // Get supabase lessons data
        const { data: supabaseLessons, error } = await supabase
            .from('lessons')
            .select('id, theory, order_index, module_id');

        if (error) {
            console.error('Error fetching Supabase lessons:', error);
            return false;
        }

        if (!supabaseLessons) return false;

        // Compare count
        if (localLessons.length !== supabaseLessons.length) {
            console.log(`[SYNC] Lessons count changed. Local: ${localLessons.length}, Supabase: ${supabaseLessons.length}`);
            return true;
        }

        return false;
    } catch (err) {
        console.error('Unexpected error in checkLessonsUpdate:', err);
        return false;
    }
};
