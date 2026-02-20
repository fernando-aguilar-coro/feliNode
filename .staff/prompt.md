añade que @beautifulMention  tenga dos opciones para tts , el de kokoro y el nativo (sus configuraciones de tipo de voz , velocidad de voz , modelo en el caso de kokoro son distintas)  configuraciones:

tipo de voz: para kokoro una lista desplegable con las voces disponibles en 
const config: TextToSpeechConfig = {
                model: KOKORO_SMALL,
                voice: KOKORO_VOICE_AF_HEART,
            };            
para react native tts una lista desplegable con las voces disponibles en engines.find ;
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

velocidad de voz: kokoro solo soporta de 0.7-1 ,  el nativo soporta el rango completo  ,   modfica @beautifulMention @beautifulMention 