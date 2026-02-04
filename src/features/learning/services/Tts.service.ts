import Tts from 'react-native-tts';

// Service State
let speechQueue: string[] = [];
let currentSpeechIndex = 0;
let isPaused = false;
let currentLanguage = 'en-US';

// Initialize configuration
Tts.getInitStatus().then(async () => {
    try {
        const engines = await Tts.engines();
        const googleEngine = engines.find(e => e.name === 'com.google.android.tts');

        if (googleEngine) {
            await Tts.setDefaultEngine('com.google.android.tts');
            console.log("Motor de Google configurado con éxito");
        } else {
            console.warn("Google TTS no está instalado, se usará el motor por defecto.");
        }
    } catch (e) {
        console.error("Error al buscar motores:", e);
    }
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.4);
    Tts.setDefaultPitch(1);

    // Initial Listeners for Queue Management
    Tts.addListener('tts-finish', () => {
        // When a chunk finishes, move to next
        if (speechQueue.length > 0 && currentSpeechIndex < speechQueue.length) {
            currentSpeechIndex++;
            if (!isPaused) {
                playNextChunk();
            }
        }
    });

    Tts.addListener('tts-cancel', () => {
        // If cancelled (stop called), check if it was due to pause
        if (isPaused) {
            // Do nothing, wait for resume
        } else {
            // Was a full stop, clear queue
            speechQueue = [];
            currentSpeechIndex = 0;
        }
    });

}, (err) => {
    if (err.code === 'no_engine') {
        Tts.requestInstallEngine();
    }
});

const playNextChunk = async () => {
    if (currentSpeechIndex < speechQueue.length) {
        try {
            // Ensure language is set before speaking each chunk (just in case)
            await Tts.setDefaultLanguage(currentLanguage);
            await Tts.setDefaultRate(0.5);
            Tts.speak(speechQueue[currentSpeechIndex]);
        } catch (error) {
            console.error("Error playing chunk:", error);
        }
    } else {
        // Queue finished
        speechQueue = [];
        currentSpeechIndex = 0;
    }
};

export const TtsService = {
    /**
     * Speaks the provided text using the device's TTS engine.
     * @param text The text to speak.
     */
    speak: async (text: string) => {
        // Clear long text queue if any
        speechQueue = [];
        currentSpeechIndex = 0;
        isPaused = false;

        text = text.replace(/[_/]/g, ' ')
            .replace(/[^\w\s.,?!áéíóúÁÉÍÓÚñÑ]/g, '  ')
            .trim();
        try {
            Tts.stop();
            await Tts.setDefaultLanguage('en-US');
            await Tts.setDefaultRate(0.4);
            await Tts.setDefaultPitch(1);
            Tts.speak(text);
        } catch (error) {
            console.error('TTS Error:', error);
        }
    },

    /**
     * Speaks long text by splitting it into smaller chunks (sentences) 
     * to avoid TTS engine limits and improve flow.
     * @param text The long text to speak.
     * @param language The language to speak in.
     */
    speakLongText: async (text: string, language: string = 'es-ES') => {
        try {
            // Reset State
            Tts.stop();
            speechQueue = [];
            currentSpeechIndex = 0;
            isPaused = false;
            currentLanguage = language;

            // Clean the text
            const cleanText = text.replace(/[_/]/g, ' ')
                .replace(/[^\w\s.,?!áéíóúÁÉÍÓÚñÑ+-]/g, '  ')
                .trim();

            // Split by punctuation
            const chunks = cleanText.match(/[^.?!]+[.?!]+|[^.?!]+$/g) || [cleanText];

            // Filter empty chunks and assign to queue
            speechQueue = chunks.map(c => c.trim()).filter(c => c.length > 0);

            // Start playing
            playNextChunk();

        } catch (error) {
            console.error('TTS Long Text Error:', error);
        }
    },

    /**
     * Stops any current speech.
     */
    stop: () => {
        try {
            speechQueue = [];
            currentSpeechIndex = 0;
            isPaused = false;
            Tts.stop();
        } catch (error) {
            console.error('TTS Stop Error:', error);
        }
    },

    /**
     * Pauses the current speech (stops current chunk, remembers index).
     */
    pause: () => {
        try {
            if (speechQueue.length > 0) {
                isPaused = true;
                Tts.stop(); // Triggers tts-cancel, which sees isPaused=true
            } else {
                Tts.pause(); // Fallback for normal speak
            }
        } catch (error) {
            console.error('TTS Pause Error:', error);
        }
    },

    /**
     * Resumes the paused speech (plays current index).
     */
    resume: () => {
        try {
            if (speechQueue.length > 0 && isPaused) {
                isPaused = false;
                playNextChunk();
            } else {
                Tts.resume(); // Fallback
            }
        } catch (error) {
            console.error('TTS Resume Error:', error);
        }
    }
};
