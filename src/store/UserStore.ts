import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../features/auth/services/authService';
import {
    userProgressRepository,
    infinityProgressRepository,
    streakRepository,
    userCurrenciesRepository
} from '../db_local/repositories';
import NetInfo from '@react-native-community/netinfo';
import { useCurrencyStore } from './CurrencyStore';
import { deleteUserAccountFromSupabase } from '../api/deleteUserAccount';

interface UserState {
    isAuthenticated: boolean;
    isGuest: boolean;
    hasLoggedOut: boolean;
    user: { name: string } | null;
    loading: boolean;
    checkSession: () => Promise<void>;
    sendOtp: (email: string) => Promise<void>;
    verifyOtp: (email: string, token: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    loginAsGuest: () => void;
    logout: () => Promise<void>;
    deleteAccount?: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            isGuest: false,
            hasLoggedOut: false,
            user: null,
            loading: false,
            isSyncing: false,
            checkSession: async () => {
                if (get().hasLoggedOut) {
                    return; // Prevent auto-login if explicitly logged out
                }

                const wasAuthenticated = get().isAuthenticated;
                const state = await NetInfo.fetch();

                if (!state.isConnected) {
                    // Offline: Trust persisted state if authenticated
                    if (wasAuthenticated) {

                        return; // Keep existing state
                    }
                }

                if (get().isGuest) {
                    return; // Guests don't have a Supabase session
                }

                try {
                    const session = await authService.getSession();
                    if (session) {
                        try {
                            // Sync progress first
                            set({
                                isAuthenticated: true,
                                user: { name: session.user.email || 'User' },
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
                        set({
                            isAuthenticated: true,
                            isGuest: false,
                            hasLoggedOut: false,
                            user: { name: session.user.email || 'User' },
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
                        set({
                            isAuthenticated: true,
                            isGuest: false,
                            hasLoggedOut: false,
                            user: { name: session.user.email || 'User' },
                        });
                    }
                } catch (error) {
                    console.error('Google Sign In error:', error);
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },

            loginAsGuest: () => {
                set({
                    isAuthenticated: true,
                    isGuest: true,
                    hasLoggedOut: false,
                    user: { name: 'Invitado' },
                });
            },

            logout: async () => {
                // Immediately update local state to reflect logout (UI snaps to login immediately)
                set({
                    loading: true,
                    isAuthenticated: false,
                    isGuest: false,
                    hasLoggedOut: true,
                    user: null,
                });
                try {
                    await authService.signOut();
                    // Clear local DB to prevent data leak to next user
                    await userProgressRepository.clearUserProgress();
                    await infinityProgressRepository.clearInfinityProgress();
                    await streakRepository.clearStreak();
                    await userCurrenciesRepository.clearCurrencies();
                    useCurrencyStore.setState({ currencies: { xp: 0, michi_coins: 0 } });
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    set({
                        loading: false,
                    });
                }
            },

            deleteAccount: async () => {
                set({ loading: true });
                try {
                    await deleteUserAccountFromSupabase();

                    set({
                        isAuthenticated: false,
                        isGuest: false,
                        hasLoggedOut: true,
                        user: null,
                    });

                    // We catch authService.signOut errors because the account and session
                    // might already be invalidated by deleteUserAccountFromSupabase
                    await authService.signOut().catch(e => console.log('Google signOut error after delete account:', e));

                    await userProgressRepository.clearUserProgress();
                    await infinityProgressRepository.clearInfinityProgress();
                    await streakRepository.clearStreak();
                    await userCurrenciesRepository.clearCurrencies();
                    useCurrencyStore.setState({ currencies: { xp: 0, michi_coins: 0 } });
                } catch (error) {
                    console.error('Delete account error:', error);
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                isGuest: state.isGuest,
                user: state.user,
                hasLoggedOut: state.hasLoggedOut,
            }),
        }
    )
);
