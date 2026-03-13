import { Audio } from 'expo-av';
import { useSettingsStore } from '../../../store/SettingsStore';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

class AudioService {
    private bgmSound: Audio.Sound | null = null;
    private static instance: AudioService;
    private wasPlayingBeforeBackground: boolean = false;
    private shouldPlayBgm: boolean = false;
    private isBgmLoading: boolean = false;

    private constructor() {
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    private handleAppStateChange = async (nextAppState: AppStateStatus) => {
        if (nextAppState.match(/inactive|background/)) {
            if (this.bgmSound) {
                this.wasPlayingBeforeBackground = true;
                this.pauseBGM();
            } else {
                this.wasPlayingBeforeBackground = false;
            }
        } else if (nextAppState === 'active') {
            if (this.wasPlayingBeforeBackground) {
                this.playBGM();
                this.wasPlayingBeforeBackground = false;
            }
        }
    };

    public static getInstance(): AudioService {
        if (!AudioService.instance) {
            AudioService.instance = new AudioService();
        }
        return AudioService.instance;
    }

    private playSfx = async (asset: any, description: string, volume: number = 1.0) => {
        const { sfxEnabled } = useSettingsStore.getState();
        if (!sfxEnabled) return;

        if (AppState.currentState !== 'active') {
            return;
        }

        try {
            const { sound } = await Audio.Sound.createAsync(
                asset,
                { volume }
            );
            await sound.playAsync();
            sound.setOnPlaybackStatusUpdate((status) => {
                if ('didJustFinish' in status && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.error(`Failed to play ${description} sound`, error);
        }
    };

    public playClickSound = () => {
        this.playSfx(require('../../../../assets/audio/click.mp3'), 'click', 0.5);
    };

    public playCorrectSound = () => {
        this.playSfx(require('../../../../assets/audio/correct.wav'), 'correct');
    };

    public playIncorrectSound = () => {
        const sounds = [
            require('../../../../assets/audio/incorrect.wav'),
            require('../../../../assets/audio/incorrect_1.wav')
        ];
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        this.playSfx(randomSound, 'incorrect');
    };

    public playSuccessSound = () => {
        this.playSfx(require('../../../../assets/audio/success.wav'), 'success');
    };

    public playTimerSound = () => {
        this.playSfx(require('../../../../assets/audio/timer.mp3'), 'timer');
    };

    public playBGM = async () => {
        const { bgmEnabled } = useSettingsStore.getState();
        if (!bgmEnabled || AppState.currentState !== 'active') {
            this.shouldPlayBgm = false;
            this.stopBGM();
            return;
        }

        this.shouldPlayBgm = true;

        if (this.bgmSound || this.isBgmLoading) {
            return;
        }

        this.isBgmLoading = true;

        try {
            const netInfo = await NetInfo.fetch();
            let audioSource: any = require('../../../../assets/audio/bg.mp3');

            if (netInfo.isConnected && netInfo.isInternetReachable !== false) {
                audioSource = { uri: 'https://stream.laut.fm/lofi' };
            }

            const { sound } = await Audio.Sound.createAsync(
                audioSource,
                { isLooping: true, volume: 0.5 }
            );

            if (!this.shouldPlayBgm || AppState.currentState !== 'active') {
                await sound.unloadAsync();
                return;
            }

            this.bgmSound = sound;
            await this.bgmSound.playAsync();

        } catch (error: any) {
            console.warn('[AudioService] error', error);
            this.bgmSound = null;
        } finally {
            this.isBgmLoading = false;
        }
    };

    public stopBGM = async () => {
        this.shouldPlayBgm = false;
        if (this.bgmSound) {
            const soundToStop = this.bgmSound;
            this.bgmSound = null;
            try {
                await soundToStop.unloadAsync();
            } catch (error) {
                console.warn('Failed to unload BGM', error);
            }
        }
    };

    public pauseBGM = async () => {
        // Implementamos la estrategia de "cortar por completo la conexión" 
        // descargando el stream, lo cual soporta fluidamente audio online y offline.
        await this.stopBGM();
    }
}

export const audioService = AudioService.getInstance();
