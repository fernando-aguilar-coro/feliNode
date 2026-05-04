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
    homeViewMode: 'node' | 'list';
    setHomeViewMode: (mode: 'node' | 'list') => void;
    themeMode: 'light' | 'dark' | 'system';
    setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
    language: string | null;
    setLanguage: (lang: string) => void;
    uiLanguage: null | 'en';
    setUiLanguage: (lang: null | 'en') => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            englishVoice: KOKORO_VOICE_AF_HEART as VoiceConfig, // Default Kokoro voice
            spanishVoiceId: null, // Default will be resolved by the system if null
            sfxEnabled: true,
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
            homeViewMode: 'node',
            setHomeViewMode: (mode: 'node' | 'list') => set({ homeViewMode: mode }),
            themeMode: 'light',
            setThemeMode: (mode: 'light' | 'dark' | 'system') => set({ themeMode: mode }),
            language: null,
            setLanguage: (lang: string) => set({ language: lang }),
            uiLanguage: null,
            setUiLanguage: (lang: null | 'en') => set({ uiLanguage: lang }),
        }),
        {
            name: 'settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

/** Selector: devuelve el idioma efectivo para i18n — override 'en' o el idioma nativo del usuario */
export const getEffectiveUiLanguage = (): string => {
    const { uiLanguage, language } = useSettingsStore.getState();
    return uiLanguage ?? language ?? 'es';
};
