import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../features/auth/services/authService';
import { getUserCompletedLessons } from '../api/getUserCompletedLessons';

interface UserState {
    isAuthenticated: boolean;
    user: { name: string } | null;
    loading: boolean;
    checkSession: () => Promise<void>;
    sendOtp: (email: string) => Promise<void>;
    verifyOtp: (email: string, token: string) => Promise<void>;
    logout: () => Promise<void>;
    completedLessonsCount: number;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            user: null,
            loading: false,
            completedLessonsCount: 0,

            checkSession: async () => {
                // If already authenticated from persistence, verify in background instead of blocking
                const wasAuthenticated = get().isAuthenticated;

                try {
                    const session = await authService.getSession();
                    if (session) {
                        // Fetch progress first
                        const count = await getUserCompletedLessons();

                        set({
                            isAuthenticated: true,
                            user: { name: session.user.email || 'User' },
                            completedLessonsCount: count
                        });
                    } else if (wasAuthenticated) {
                        //TODO: Handle token refresh
                        // Session is invalid but we had persistence, log out to be safe or handle token refresh
                        // For now, if no session from supabase, we should arguably clear state
                        // But for offline support, we might want to keep it if error is network related?
                        // verifySession returns null if no session. 
                        // If offline, supabase cleanup might not be reliable.
                        // authService.getSession() usually tries to recover session.

                        // If we are strictly offline, getSession might fail or return null?
                        // Usually getSession is local. 

                        // For safety, let's update if session is actively null (logged out remotely or expired)
                        // But user specifically wants OFFLINE support.
                    }
                } catch (error) {
                    console.error('Check session error:', error);
                    // If error (e.g. network), keep persisted state if we are authenticated
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
                        const count = await getUserCompletedLessons();

                        set({
                            isAuthenticated: true,
                            user: { name: session.user.email || 'User' },
                            completedLessonsCount: count
                        });
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
                    // State clear will happen below
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    set({
                        loading: false,
                        isAuthenticated: false,
                        user: null,
                        completedLessonsCount: 0
                    });
                }
            },
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                completedLessonsCount: state.completedLessonsCount
            }),
        }
    )
);
