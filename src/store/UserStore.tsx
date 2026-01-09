import { create } from 'zustand';

interface UserState {
    isAuthenticated: boolean;
    user: { name: string } | null;
    loading: boolean;
    login: () => void;
    logout: () => void;
    completeOnboarding: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    isAuthenticated: false,
    user: null,
    loading: false,
    login: () => set({ isAuthenticated: true, user: { name: 'Test User' } }),
    logout: () => set({ isAuthenticated: false, user: null }),
    completeOnboarding: () => set({ isAuthenticated: true, user: { name: 'Guest User' } }),
}));
