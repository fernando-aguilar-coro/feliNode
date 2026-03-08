import { supabase } from './supabaseClient'; // Asegúrate de importar tu instancia de cliente
import { useUserStore } from '../store/UserStore';

export const updateUser = async (completedLessons: string[]) => {
    try {
        const { isGuest, guestId } = useUserStore.getState();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        let userId = user?.id;

        if (isGuest && guestId) {
            userId = guestId;
        } else if (userError || !user) {
            return;
        }

        if (!userId) return;

        // 2. Actualizamos la tabla 'profiles' directamente
        // El RLS que configuramos se encargará de validar que solo edites TU fila
        const { error: syncError } = await supabase
            .from('profiles')
            .update({
                lesson_ids: completedLessons,
                last_sync: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId); // Filtro de seguridad por ID de usuario

        if (syncError) {
            console.warn('[Sync] Failed to sync progress:', syncError.message);
            throw new Error(`Sync failed: ${syncError.message}`);
        }



    } catch (error) {
        console.error('[Sync] Error syncing progress:', error);
        // Mantenemos tu lógica de no bloquear el progreso local
    }
};