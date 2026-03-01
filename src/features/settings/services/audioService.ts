import { Audio } from 'expo-av';
import { useSettingsStore } from '../../../store/SettingsStore';
import { AppState, AppStateStatus } from 'react-native';

class AudioService {
    private bgmSound: Audio.Sound | null = null;
    private static instance: AudioService;
    private wasPlayingBeforeBackground: boolean = false;

    private constructor() {
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    private handleAppStateChange = async (nextAppState: AppStateStatus) => {
        if (nextAppState.match(/inactive|background/)) {
            if (this.bgmSound) {
                const status = await this.bgmSound.getStatusAsync();
                this.wasPlayingBeforeBackground = 'isPlaying' in status && status.isPlaying;
                if (this.wasPlayingBeforeBackground) {
                    this.pauseBGM();
                }
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

    private playSfx = async (asset: any, description: string) => {
        const { sfxEnabled } = useSettingsStore.getState();
        if (!sfxEnabled) return;

        if (AppState.currentState !== 'active') {
            return;
        }

        console.log(`[AudioService] Playing SFX: ${description}`);

        // Uncomment once assets are available
        try {
            const { sound } = await Audio.Sound.createAsync(asset);
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
        this.playSfx(require('../../../../assets/audio/click.mp3'), 'click');
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

    public playBGM = async () => {
        const { bgmEnabled } = useSettingsStore.getState();
        if (!bgmEnabled) {
            this.stopBGM();
            return;
        }

        if (AppState.currentState !== 'active') {
            console.log(`[AudioService] Skipping playBGM because AppState is ${AppState.currentState}`);
            return;
        }

        console.log(`[AudioService] Playing BGM`);
        try {
            if (this.bgmSound) {
                const status = await this.bgmSound.getStatusAsync();
                if ('isPlaying' in status && !status.isPlaying) {
                    if (AppState.currentState === 'active') {
                        await this.bgmSound.playAsync();
                    } else {
                        console.log('[AudioService] Skipping resume because app state is not active');
                    }
                }
                return;
            }

            const { sound } = await Audio.Sound.createAsync(
                require('../../../../assets/audio/bg.mp3'),
                { isLooping: true }
            );
            this.bgmSound = sound;

            if (AppState.currentState === 'active') {
                await this.bgmSound.playAsync();
            } else {
                console.log('[AudioService] App became inactive while creating BGM sound. Pausing.');
            }
        } catch (error: any) {
            if (error?.message?.includes?.('AudioFocusNotAcquiredException')) {
                console.warn('[AudioService] Could not acquire audio focus (app in background/transition).');
                this.wasPlayingBeforeBackground = true;
            } else {
                console.error('Failed to play BGM', error);
            }
        }
    };

    public stopBGM = async () => {
        console.log(`[AudioService] Stopping BGM`);
        try {
            if (this.bgmSound) {
                await this.bgmSound.stopAsync();
                await this.bgmSound.unloadAsync();
                this.bgmSound = null;
            }
        } catch (error) {
            console.error('Failed to stop BGM', error);
        }
    };

    public pauseBGM = async () => {
        console.log(`[AudioService] Pausing BGM`);
        try {
            if (this.bgmSound) {
                const status = await this.bgmSound.getStatusAsync();
                if ('isPlaying' in status && status.isPlaying) {
                    await this.bgmSound.pauseAsync();
                }
            }
        } catch (error) {
            console.error('Failed to pause BGM', error);
        }
    }
}

export const audioService = AudioService.getInstance();
