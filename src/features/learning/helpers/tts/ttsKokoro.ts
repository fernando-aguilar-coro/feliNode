import RNFS from 'react-native-fs';
import { Audio } from 'expo-av';
import {
    TextToSpeechModule,
    TextToSpeechConfig,
    KOKORO_SMALL,
    KOKORO_VOICE_AF_HEART
} from 'react-native-executorch';

/**
 * Manages Text-to-Speech operations using offline Kokoro TTS via Executorch.
 */
class TtsManagerService {
    private ttsModule: TextToSpeechModule;
    private isInitialized = false;
    private isSpeaking = false;
    private soundObject: Audio.Sound | null = null;

    constructor() {
        this.ttsModule = new TextToSpeechModule();
        this.initialize();
    }

    /**
     * Initializes the offline TTS engine.
     */
    private async initialize() {
        try {
            console.log('TTS Manager: Initializing Executorch TTS...');

            // Prepare configuration using library constants (Auto-Download from HuggingFace)
            const config: TextToSpeechConfig = {
                model: KOKORO_SMALL,
                voice: KOKORO_VOICE_AF_HEART,
            };

            await this.ttsModule.load(config, (progress) => {
                console.log(`TTS Load Progress: ${progress * 100}%`);
            });

            this.isInitialized = true;
            console.log('TTS Manager: Executorch TTS Initialized successfully.');

        } catch (error) {
            console.error('TTS Manager: Initialization failed', error);
            this.isInitialized = false;
        }
    }

    /**
     * Speaks the text using Kokoro TTS via Executorch.
     */
    public async speak(text: string, options?: { rate?: number }) {
        if (!this.isInitialized) {
            console.warn('TTS Manager: Executorch TTS not initialized.');
            return;
        }

        try {
            this.stop(); // Stop potential previous playback
            this.isSpeaking = true;

            const speed = options?.rate || 1.0;

            console.log('TTS Manager: Generating audio...');
            const pcmFloat32 = await this.ttsModule.forward(text, speed);

            console.log(`TTS Manager: Audio generated. Samples: ${pcmFloat32.length}`);

            // Play the generated audio
            await this.playPcmData(pcmFloat32);

        } catch (error) {
            console.error('TTS Manager: Speak failed.', error);
        } finally {
            this.isSpeaking = false;
        }
    }

    /**
     * Converts Float32 PCM to WAV and plays it using Expo AV.
     */
    private async playPcmData(pcmData: Float32Array) {
        try {
            // 1. Convert Float32 (-1.0 to 1.0) to Int16 (-32768 to 32767)
            const sampleRate = 24000; // Kokoro usually uses 24khz, verify for your specific model
            const numChannels = 1;
            const bitDepth = 16;

            const buffer = new ArrayBuffer(44 + pcmData.length * 2);
            const view = new DataView(buffer);

            // WAV Header
            this.writeString(view, 0, 'RIFF');
            view.setUint32(4, 36 + pcmData.length * 2, true); // File size
            this.writeString(view, 8, 'WAVE');
            this.writeString(view, 12, 'fmt ');
            view.setUint32(16, 16, true); // Subchunk1Size
            view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
            view.setUint16(22, numChannels, true); // NumChannels
            view.setUint32(24, sampleRate, true); // SampleRate
            view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true); // ByteRate
            view.setUint16(32, numChannels * (bitDepth / 8), true); // BlockAlign
            view.setUint16(34, bitDepth, true); // BitsPerSample
            this.writeString(view, 36, 'data');
            view.setUint32(40, pcmData.length * 2, true); // Subchunk2Size

            // PCM Data
            let offset = 44;
            for (let i = 0; i < pcmData.length; i++) {
                let s = Math.max(-1, Math.min(1, pcmData[i]));
                s = s < 0 ? s * 0x8000 : s * 0x7FFF;
                view.setInt16(offset, s, true);
                offset += 2;
            }

            // 2. Write to file
            const wavPath = `${RNFS.CachesDirectoryPath}/tts_output.wav`;
            // react-native-fs requires base64 for binary writing usually, or specialized method.
            // Converting ArrayBuffer to Base64 efficiently:
            const base64 = this.arrayBufferToBase64(buffer);

            await RNFS.writeFile(wavPath, base64, 'base64');

            // 3. Play with Expo AV
            const { sound } = await Audio.Sound.createAsync({ uri: `file://${wavPath}` });
            this.soundObject = sound;
            await sound.playAsync();

            // Wait for finish (optional, depending on requirement)
            // sound.setOnPlaybackStatusUpdate(...)

        } catch (error) {
            console.error('TTS Manager: Audio playback failed', error);
            throw error;
        }
    }

    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary); // Global btoa is available in RN
    }

    private writeString(view: DataView, offset: number, string: string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    /**
     * Speaks long text.
     */
    public async speakLongText(text: string, language?: string) {
        // Reuse speak for now
        await this.speak(text);
    }

    public async stop() {
        if (this.soundObject) {
            try {
                await this.soundObject.stopAsync();
                await this.soundObject.unloadAsync();
                this.soundObject = null;
            } catch (e) {
                console.warn('Error stopping sound', e);
            }
        }
        this.isSpeaking = false;
    }

    public pause() {
        this.stop(); // Basic pause fallback
    }

    public resume() {
        // Not supported
    }
}

export const TtsManager = new TtsManagerService();
