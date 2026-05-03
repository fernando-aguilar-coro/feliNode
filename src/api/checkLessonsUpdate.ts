import { supabase } from './supabaseClient';
import { initDatabase } from '../db_local/db';

export const checkLessonsUpdate = async (languageCode: string = 'es'): Promise<boolean> => {
    try {
        const db = await initDatabase();

        // Get local lessons data
        const localLessons = await db.getAllAsync<{ id: string, updated_at: string | null }>('SELECT id, updated_at FROM lessons');

        // Get supabase lessons data
        const { data: supabaseLessons, error } = await supabase
            .from('lessons')
            .select('id, updated_at, modules!inner(language_code)')
            .eq('modules.language_code', languageCode);

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

        // Build a map for O(1) lookup
        const localMap = new Map(localLessons.map(l => [l.id, l.updated_at]));

        // Check if any updated_at changed
        const hasChanges = supabaseLessons.some(remote => {
            const localTime = localMap.get(remote.id);
            return localTime !== undefined && localTime !== remote.updated_at;
        });

        if (hasChanges) {
            console.log(`[SYNC] updated_at changed in one or more lessons`);
            return true;
        }

        return false;
    } catch (err) {
        console.error('Unexpected error in checkLessonsUpdate:', err);
        return false;
    }
};
