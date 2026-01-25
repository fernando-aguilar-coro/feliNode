import { supabase } from './supabaseClient';

export const getUserCompletedLessons = async (): Promise<number> => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log('[GetProgress] No active session.');
            return 0;
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('lesson_ids')
            .eq('id', user.id)
            .maybeSingle();

        if (error) {
            console.error('[GetProgress] Error fetching profile:', error);
            return 0;
        }

        const completedLessons = data?.lesson_ids || [];
        return Array.isArray(completedLessons) ? completedLessons.length : 0;

    } catch (error) {
        console.error('[GetProgress] Unexpected error:', error);
        return 0;
    }
};
