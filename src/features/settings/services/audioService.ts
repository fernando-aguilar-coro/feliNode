import { Audio } from 'expo-av';
import { useSettingsStore } from '../../../store/SettingsStore';

class AudioService {
    private bgmSound: Audio.Sound | null = null;
    private static instance: AudioService;

    private constructor() { }

    public static getInstance(): AudioService {
        if (!AudioService.instance) {
            AudioService.instance = new AudioService();
        }
        return AudioService.instance;
    }

    private playSfx = async (asset: any, description: string) => {
        const { sfxEnabled } = useSettingsStore.getState();
        if (!sfxEnabled) return;

        console.log(`[AudioService] Playing SFX: ${description}`);
        /* 
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
        */
    };

    public playClickSound = () => {
        // this.playSfx(require('../../../assets/audio/click.mp3'), 'click');
        this.playSfx(null, 'click');
    };

    public playCorrectSound = () => {
        // this.playSfx(require('../../../assets/audio/correct.mp3'), 'correct');
        this.playSfx(null, 'correct');
    };

    public playIncorrectSound = () => {
        // this.playSfx(require('../../../assets/audio/incorrect.mp3'), 'incorrect');
        this.playSfx(null, 'incorrect');
    };

    public playSuccessSound = () => {
        // this.playSfx(require('../../../assets/audio/success.mp3'), 'success');
        this.playSfx(null, 'success');
    };

    public playBGM = async () => {
        const { bgmEnabled } = useSettingsStore.getState();
        if (!bgmEnabled) {
            this.stopBGM();
            return;
        }

        console.log(`[AudioService] Playing BGM`);
        /*
        // Uncomment once assets are available
        try {
            if (this.bgmSound) {
                const status = await this.bgmSound.getStatusAsync();
                if ('isPlaying' in status && !status.isPlaying) {
                    await this.bgmSound.playAsync();
                }
                return;
            }

            const { sound } = await Audio.Sound.createAsync(
                require('../../../assets/audio/bgm.mp3'),
                { isLooping: true }
            );
            this.bgmSound = sound;
            await this.bgmSound.playAsync();
        } catch (error) {
            console.error('Failed to play BGM', error);
        }
        */
    };

    public stopBGM = async () => {
        console.log(`[AudioService] Stopping BGM`);
        /*
        // Uncomment once assets are available
        try {
            if (this.bgmSound) {
                await this.bgmSound.stopAsync();
                await this.bgmSound.unloadAsync();
                this.bgmSound = null;
            }
        } catch (error) {
            console.error('Failed to stop BGM', error);
        }
        */
    };

    public pauseBGM = async () => {
        console.log(`[AudioService] Pausing BGM`);
        /*
        // Uncomment once assets are available
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
        */
    }
}

export const audioService = AudioService.getInstance();
