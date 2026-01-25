import { supabase } from './supabaseClient'; // Asegúrate de importar tu instancia de cliente
// Ya no necesitas API_URL de Vercel

export const updateUser = async (completedLessons: string[]) => {
    try {
        // 1. Obtenemos el usuario actual directamente de Supabase
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log('[Sync] No active session, skipping cloud sync.');
            return;
        }

        // 2. Actualizamos la tabla 'profiles' directamente
        // El RLS que configuramos se encargará de validar que solo edites TU fila
        const { error: syncError } = await supabase
            .from('profiles')
            .update({
                lesson_ids: completedLessons,
                last_sync: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id); // Filtro de seguridad por ID de usuario

        if (syncError) {
            console.warn('[Sync] Failed to sync progress:', syncError.message);
            throw new Error(`Sync failed: ${syncError.message}`);
        }

        console.log('[Sync] Progress synced successfully to Supabase.');

    } catch (error) {
        console.error('[Sync] Error syncing progress:', error);
        // Mantenemos tu lógica de no bloquear el progreso local
    }
};