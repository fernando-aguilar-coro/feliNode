import { supabase } from './supabaseClient';

/**
 * Obtiene el top 100 de usuarios según su XP
 * Incluye solo el XP y el username de la tabla profiles
 */
export const getRanking = async (limit: number = 100) => {
    const { data, error } = await supabase
        .from('user_currencies')
        .select(`
            xp,
            user_id,
            profiles!user_currencies_user_id_profiles_fkey (
                username
            )
        `)
        .order('xp', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('[RankingAPI] Error fetching ranking:', error);
        return [];
    }

    return data;
};

/**
 * Obtiene la posición actual del usuario en el ranking global
 */
export const getUserPosition = async () => {
    try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user) return null;

        // 1. Obtener el XP del usuario actual
        const { data: userData, error: userError } = await supabase
            .from('user_currencies')
            .select('xp')
            .eq('user_id', authData.user.id)
            .maybeSingle(); // Usar maybeSingle para evitar error 406 si no existe

        if (userError || !userData) return null;

        // 2. Contar cuántos usuarios tienen más XP
        const { count, error: countError } = await supabase
            .from('user_currencies')
            .select('*', { count: 'exact', head: true })
            .gt('xp', userData.xp);

        if (countError) {
            console.error('[RankingAPI] Error counting user rank:', countError);
            return null;
        }

        return (count || 0) + 1;
    } catch (err) {
        console.error('[RankingAPI] Unexpected error in getUserPosition:', err);
        return null;
    }
};
