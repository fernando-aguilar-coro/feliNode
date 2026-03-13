import Tts from 'react-native-tts';
import { useSettingsStore } from '../../../../store/SettingsStore';

class ReactNativeTtsService {
    private speechQueue: string[] = [];
    private currentSpeechIndex = 0;
    private isPaused = false;
    private currentLanguage = 'en-US';

    constructor() {
        this.initialize();
    }

    private initialize() {
        Tts.getInitStatus().then(async () => {
            try {
                const engines = await Tts.engines();
                const googleEngine = engines.find(e => e.name === 'com.google.android.tts');

                if (googleEngine) {
                    await Tts.setDefaultEngine('com.google.android.tts');

                } else {
                    console.warn("Google TTS no está instalado, se usará el motor por defecto.");
                }
            } catch (e) {
                console.error("Error al buscar motores:", e);
            }
            // Set reasonable defaults
            Tts.setDefaultLanguage('en-US');
            Tts.setDefaultRate(0.5);

            // Initial Listeners for Queue Management
            Tts.addListener('tts-finish', () => {
                // When a chunk finishes, move to next
                if (this.speechQueue.length > 0 && this.currentSpeechIndex < this.speechQueue.length) {
                    this.currentSpeechIndex++;
                    if (!this.isPaused) {
                        this.playNextChunk();
                    }
                }
            });

            Tts.addListener('tts-cancel', () => {
                // If cancelled (stop called), check if it was due to pause
                if (this.isPaused) {
                    // Do nothing, wait for resume
                } else {
                    // Was a full stop, clear queue
                    this.speechQueue = [];
                    this.currentSpeechIndex = 0;
                }
            });

        }, (err) => {
            if (err.code === 'no_engine') {
                Tts.requestInstallEngine();
            }
        });
    }

    private playNextChunk = async () => {
        if (this.currentSpeechIndex < this.speechQueue.length) {
            try {
                const state = useSettingsStore.getState();
                const selectedVoice = state.spanishVoiceId;

                // Ensure language is set before speaking each chunk (just in case)
                await Tts.setDefaultLanguage(this.currentLanguage);
                if (selectedVoice) {
                    await Tts.setDefaultVoice(selectedVoice);
                }

                // Re-apply rate if needed, or rely on stored state? 
                // In original snippet rate was hardcoded 0.5 here.
                await Tts.setDefaultRate(0.6);
                Tts.speak(this.speechQueue[this.currentSpeechIndex]);
            } catch (error) {
                console.error("Error playing chunk:", error);
            }
        } else {
            // Queue finished
            this.speechQueue = [];
            this.currentSpeechIndex = 0;
        }
    };

    /**
     * Speaks the provided text using the device's TTS engine.
     * @param text The text to speak.
     */
    public async speak(text: string, language: string = 'en-US', rate: number = 0.5) {
        // Clear long text queue if any
        this.speechQueue = [];
        this.currentSpeechIndex = 0;
        this.isPaused = false;
        this.currentLanguage = language;

        const cleanText = text.replace(/[_/]/g, ' ')
            .replace(/[^\w\s.,?!áéíóúÁÉÍÓÚñÑ]/g, '  ')
            .trim();
        try {
            await Tts.getInitStatus();
            Tts.stop();
            const state = useSettingsStore.getState();
            const selectedVoice = state.spanishVoiceId;

            await Tts.setDefaultLanguage(language);
            if (selectedVoice) {
                await Tts.setDefaultVoice(selectedVoice);
            }
            await Tts.setDefaultRate(rate);
            Tts.speak(cleanText);
        } catch (error) {
            console.error('TTS Error:', error);
        }
    }

    /**
     * Speaks long text by splitting it into smaller chunks (sentences) 
     * to avoid TTS engine limits and improve flow.
     * @param text The long text to speak.
     * @param language The language to speak in.
     */
    public async speakLongText(text: string, language: string = 'es-ES') {
        try {
            await Tts.getInitStatus();
            // Reset State
            Tts.stop();
            this.speechQueue = [];
            this.currentSpeechIndex = 0;
            this.isPaused = false;
            this.currentLanguage = language;

            // Clean the text
            const cleanText = text.replace(/[_/]/g, ' ')
                .replace(/[^\w\s.,?!áéíóúÁÉÍÓÚñÑ+-]/g, '  ')
                .trim();

            // Split by punctuation
            const chunks = cleanText.match(/[^.?!]+[.?!]+|[^.?!]+$/g) || [cleanText];

            // Filter empty chunks and assign to queue
            this.speechQueue = chunks.map(c => c.trim()).filter(c => c.length > 0);

            // Start playing
            this.playNextChunk();

        } catch (error) {
            console.error('TTS Long Text Error:', error);
        }
    }

    /**
     * Stops any current speech.
     */
    public stop() {
        try {
            this.speechQueue = [];
            this.currentSpeechIndex = 0;
            this.isPaused = false;
            Tts.stop();
        } catch (error) {
            console.error('TTS Stop Error:', error);
        }
    }

    /**
     * Pauses the current speech (stops current chunk, remembers index).
     */
    public pause() {
        try {
            if (this.speechQueue.length > 0) {
                this.isPaused = true;
                Tts.stop(); // Triggers tts-cancel, which sees isPaused=true
            } else {
                Tts.pause(); // Fallback for normal speak
            }
        } catch (error) {
            console.error('TTS Pause Error:', error);
        }
    }

    /**
     * Resumes the paused speech (plays current index).
     */
    public resume() {
        try {
            if (this.speechQueue.length > 0 && this.isPaused) {
                this.isPaused = false;
                this.playNextChunk();
            } else {
                Tts.resume(); // Fallback
            }
        } catch (error) {
            console.error('TTS Resume Error:', error);
        }
    }

    /**
     * Retrieves and filters available voices, placing Spanish voices first.
     */
    public async getAvailableVoices() {
        try {
            await Tts.getInitStatus();
            const allVoices = await Tts.voices();
            // Filter only Spanish voices
            const esVoices = allVoices.filter(v => v.language.toLowerCase().startsWith('es') || v.language === 'spa');

            // Order:
            // 1. Google engine first (com.google.android.tts)
            // 2. Network voices first (higher quality typically)
            esVoices.sort((a, b) => {
                const aIsGoogle = a.name.includes('google') || a.id.includes('google') || a.name.includes('com.google.android.tts');
                const bIsGoogle = b.name.includes('google') || b.id.includes('google') || b.name.includes('com.google.android.tts');
                const aIsNetwork = a.name.includes('network') || a.id.includes('network');
                const bIsNetwork = b.name.includes('network') || b.id.includes('network');

                if (aIsGoogle && !bIsGoogle) return -1;
                if (!aIsGoogle && bIsGoogle) return 1;

                if (aIsNetwork && !bIsNetwork) return -1;
                if (!aIsNetwork && bIsNetwork) return 1;

                return a.name.localeCompare(b.name);
            });

            return esVoices.map(v => ({ id: v.id, name: v.name, language: v.language }));
        } catch (error) {
            console.error('Error fetching voices:', error);
            return [];
        }
    }
}

export const ReactNativeTts = new ReactNativeTtsService();
