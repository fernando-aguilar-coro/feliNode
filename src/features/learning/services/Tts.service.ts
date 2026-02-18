/**
 * Service handling TTS operations.
 * Configured to use ONLY the offline TtsManager (Kokoro TTS).
 * System TTS fallback has been removed.
 */
import { TtsManager } from '../helpers/tts/ttsKokoro';

export const TtsService = TtsManager;
