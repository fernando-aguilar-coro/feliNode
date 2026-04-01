import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KOKORO_VOICE_AF_HEART } from 'react-native-executorch';
import type { VoiceConfig } from 'react-native-executorch/src/types/tts';

interface SettingsState {
    englishVoice: VoiceConfig;
    spanishVoiceId: string | null;
    sfxEnabled: boolean;
    bgmEnabled: boolean;
    isKokoroDownloaded: boolean;
    hasDecidedKokoroDownload: boolean;
    wantsKokoro: boolean;
    showStreak: boolean;
    hasDecidedPlacementTest: boolean;
    hasSeenFirstPracticeModal: boolean;
    setEnglishVoice: (voice: VoiceConfig) => void;
    setSpanishVoiceId: (id: string) => void;
    setSfxEnabled: (enabled: boolean) => void;
    setBgmEnabled: (enabled: boolean) => void;
    setKokoroDownloaded: (downloaded: boolean) => void;
    setHasDecidedKokoroDownload: (decided: boolean) => void;
    setWantsKokoro: (wants: boolean) => void;
    setShowStreak: (show: boolean) => void;
    setHasDecidedPlacementTest: (decided: boolean) => void;
    setHasSeenFirstPracticeModal: (seen: boolean) => void;
    homeViewMode: 'tree' | 'list';
    setHomeViewMode: (mode: 'tree' | 'list') => void;
    themeMode: 'light' | 'dark' | 'system';
    setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
    language: string | null;
    setLanguage: (lang: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            englishVoice: KOKORO_VOICE_AF_HEART as VoiceConfig, // Default Kokoro voice
            spanishVoiceId: null, // Default will be resolved by the system if null
            sfxEnabled: false,
            bgmEnabled: false,
            isKokoroDownloaded: false,
            hasDecidedKokoroDownload: false,
            wantsKokoro: false,
            showStreak: true,
            hasDecidedPlacementTest: false,
            hasSeenFirstPracticeModal: false,
            setEnglishVoice: (voice) => set({ englishVoice: voice }),
            setSpanishVoiceId: (id) => set({ spanishVoiceId: id }),
            setSfxEnabled: (enabled) => set({ sfxEnabled: enabled }),
            setBgmEnabled: (enabled: boolean) => set({ bgmEnabled: enabled }),
            setKokoroDownloaded: (downloaded: boolean) => set({ isKokoroDownloaded: downloaded }),
            setHasDecidedKokoroDownload: (decided: boolean) => set({ hasDecidedKokoroDownload: decided }),
            setWantsKokoro: (wants: boolean) => set({ wantsKokoro: wants }),
            setShowStreak: (show: boolean) => set({ showStreak: show }),
            setHasDecidedPlacementTest: (decided: boolean) => set({ hasDecidedPlacementTest: decided }),
            setHasSeenFirstPracticeModal: (seen: boolean) => set({ hasSeenFirstPracticeModal: seen }),
            homeViewMode: 'list',
            setHomeViewMode: (mode: 'tree' | 'list') => set({ homeViewMode: mode }),
            themeMode: 'light',
            setThemeMode: (mode: 'light' | 'dark' | 'system') => set({ themeMode: mode }),
            language: null,
            setLanguage: (lang: string) => set({ language: lang }),
        }),
        {
            name: 'settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
