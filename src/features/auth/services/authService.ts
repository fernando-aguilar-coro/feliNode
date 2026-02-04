import { supabase } from '../../../api/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '../../../config';

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

    configureGoogleSignin() {
        GoogleSignin.configure({
            webClientId: GOOGLE_WEB_CLIENT_ID,
        });
    },

    async signInWithGoogle() {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            if (userInfo.type === 'success') {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: userInfo.data.idToken || "",
                });
                if (error) throw error;
                return data;
            } else {
                throw new Error('no ID token present!');
            }
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                console.log('User cancelled login');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                console.log('Sign in is in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                console.log('Play services not available');
            } else {
                // some other error happened
                console.error(error);
                throw error;
            }
        }
    },
};
