import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../features/auth/services/authService';
import { getUserCompletedLessons } from '../api/getUserCompletedLessons';

import { clearUserProgress } from '../db_local/api_local';
import NetInfo from '@react-native-community/netinfo';

interface UserState {
    isAuthenticated: boolean;
    user: { name: string } | null;
    loading: boolean;
    checkSession: () => Promise<void>;
    sendOtp: (email: string) => Promise<void>;
    verifyOtp: (email: string, token: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    completedLessonsCount: number;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            user: null,
            loading: false,
            isSyncing: false,
            completedLessonsCount: 0,

            checkSession: async () => {
                const wasAuthenticated = get().isAuthenticated;
                const state = await NetInfo.fetch();

                if (!state.isConnected) {
                    // Offline: Trust persisted state if authenticated
                    if (wasAuthenticated) {
                        console.log('User is offline, using persisted session');
                        return; // Keep existing state
                    }
                }

                try {
                    const session = await authService.getSession();
                    if (session) {
                        try {
                            // Sync progress first
                            const count = await getUserCompletedLessons();

                            set({
                                isAuthenticated: true,
                                user: { name: session.user.email || 'User' },
                                completedLessonsCount: count
                            });
                        } catch (syncError) {
                            console.error('Sync failed during session check:', syncError);
                            // Still set authenticated even if sync fails? 
                            // Yes, allow usage, maybe retry sync later
                            set({
                                isAuthenticated: true,
                                user: { name: session.user.email || 'User' },
                            });
                        }
                    } else if (wasAuthenticated) {
                        // Online but session invalid - clear state
                        set({
                            isAuthenticated: false,
                            user: null,
                            completedLessonsCount: 0
                        });
                    }
                } catch (error) {
                    console.error('Check session error:', error);
                    // If error (e.g. network glitch despite isConnected=true), keep persisted state
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

            signInWithGoogle: async () => {
                set({ loading: true });
                try {
                    const response = await authService.signInWithGoogle();
                    if (response?.session) {
                        const { session } = response;
                        const count = await getUserCompletedLessons();

                        set({
                            isAuthenticated: true,
                            user: { name: session.user.email || 'User' },
                            completedLessonsCount: count
                        });
                    }
                } catch (error) {
                    console.error('Google Sign In error:', error);
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },

            logout: async () => {
                set({ loading: true });
                try {
                    await authService.signOut();
                    // Clear local DB to prevent data leak to next user
                    await clearUserProgress();
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
