import { supabase } from './supabaseClient';
import { useUserStore } from '../store/UserStore';

/**
 * Deletes the current user's account and all associated data.
 * Requires the 'delete_user_account' RPC function to be created in Supabase.
 */
export const deleteUserAccountFromSupabase = async (): Promise<void> => {
    try {
        const { isGuest } = useUserStore.getState();
        if (isGuest) {
            return;
        }
        const { error } = await supabase.rpc('delete_user_account');
        if (error) {
            console.error('Error deleting user account from Supabase:', error);
            throw new Error('No se pudo eliminar la cuenta. Por favor, intenta de nuevo.');
        }
    } catch (e: any) {
        throw new Error(e.message || 'Error occurred while deleting account.');
    }
};
