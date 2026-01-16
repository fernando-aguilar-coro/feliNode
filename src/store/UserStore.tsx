import { create } from 'zustand';
import { authService } from '../features/auth/services/authService';
import { syncUserProgress } from '../api/sync';

interface UserState {
    isAuthenticated: boolean;
    user: { name: string } | null;
    loading: boolean;
    checkSession: () => Promise<void>;
    sendOtp: (email: string) => Promise<void>;
    verifyOtp: (email: string, token: string) => Promise<void>;
    logout: () => Promise<void>;
    completeOnboarding: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    isAuthenticated: false,
    user: null,
    loading: false,

    checkSession: async () => {
        try {
            const session = await authService.getSession();
            if (session) {
                set({ isAuthenticated: true, user: { name: session.user.email || 'User' } });
                // Trigger sync on session load
                syncUserProgress().catch(err => console.error('Sync failed on session check:', err));
            }
        } catch (error) {
            console.error('Check session error:', error);
        }
    },

    sendOtp: async (email) => {
        set({ loading: true });
        try {
            await authService.signInWithOtp(email);
        } catch (error) {
            console.error('Send OTP error:', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    verifyOtp: async (email, token) => {
        set({ loading: true });
        try {
            const { session } = await authService.verifyOtp(email, token);
            if (session) {
                set({
                    isAuthenticated: true,
                    user: { name: session.user.email || 'User' }
                });
                // Trigger sync on successful login
                syncUserProgress().catch(err => console.error('Sync failed on login:', err));
            }
        } catch (error) {
            console.error('Verify OTP error:', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        set({ loading: true });
        try {
            await authService.signOut();
            set({ isAuthenticated: false, user: null });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            set({ loading: false });
        }
    },

    completeOnboarding: () => set({ isAuthenticated: true, user: { name: 'Guest User' } }),
}));
