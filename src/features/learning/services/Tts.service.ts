/**
 * Service handling TTS operations.
 * Configured to use a hybrid approach:
 * - ReactNativeTts (System TTS) for Long text (>200 chars) or Spanish.
 * - TtsManager (Kokoro TTS) for Short English text.
 */
import { TtsManager } from '../helpers/tts/ttsKokoro';
import { ReactNativeTts } from '../helpers/tts/reactNativeTTS';

class TtsServiceHandler {
    /**
     * Speaks the text using the appropriate engine.
     * @param text Text to speak
     * @param options Options for TTS (rate, language)
     */
    public async speak(text: string, options?: { rate?: number, language?: string }) {
        const rate = options?.rate || 1.0;
        // Use RN TTS if:
        // 1. Language is Spanish
        // 2. Kokoro TTS is NOT ready yet
        const useSystemTts = options?.language === 'es-ES' || !TtsManager.isReady;

        if (useSystemTts) {
            await ReactNativeTts.speak(text, options?.language);
        } else {
            await TtsManager.speak(text, { rate });
        }
    }

    public async stop() {
        // Stop both to be sure
        await TtsManager.stop();
        ReactNativeTts.stop();
    }

    /**
     * Direct method to speak long text using System TTS.
     * Added to fix 'speakLongText is not a function' error.
     */
    public async speakLongText(text: string, language?: string) {
        // Force routing to long text handler in System TTS
        // We can ignore Kokoro here since the intent is explicit.
        await ReactNativeTts.speakLongText(text, language || 'es-ES');
    }

    public pause() {
        // Only ReactNativeTts really supports pause in this hybrid model
        ReactNativeTts.pause();
        // Kokoro doesn't support pause well (based on current impl), but we can stop it.
        TtsManager.pause();
    }

    public resume() {
        ReactNativeTts.resume();
        // Kokoro resume not supported
        TtsManager.resume();
    }
}

export const TtsService = new TtsServiceHandler();
