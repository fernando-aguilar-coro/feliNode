import { supabase } from './supabaseClient';
import { Session, User } from '@supabase/supabase-js';

export const authService = {
    async signInWithOtp(email: string) {
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
            },
        });
        if (error) throw error;
        return data;
    },

    async verifyOtp(email: string, token: string) {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
        });
        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    },

    onAuthStateChange(callback: (session: Session | null) => void) {
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            callback(session);
        });
        return data.subscription;
    },
};
