import { useState, useCallback, useRef, useEffect } from 'react';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { TtsService } from '../../learning/services/Tts.service';

interface UseSpeechRecognitionOptions {
    onSilenceDetected: (text: string) => void;
    onTextUpdate: (text: string) => void;
    onError?: (error: string) => void;
}

/**
 * Hook that manages the Expo Speech Recognition module for continuous call mode.
 */
export const useSpeechRecognition = (options: UseSpeechRecognitionOptions) => {
    const [isListening, setIsListening] = useState(false);
    
    // Refs to access latest state in event handlers
    const isListeningRef = useRef(isListening);
    useEffect(() => {
        isListeningRef.current = isListening;
    }, [isListening]);

    const silenceTimerRef = useRef<number | null>(null);
    const lastSentTextRef = useRef('');
    const currentInputTextRef = useRef('');

    // Update internal ref so we can check against current input
    const updateCurrentInputText = useCallback((text: string) => {
        currentInputTextRef.current = text;
    }, []);

    const resetBuffer = useCallback(() => {
        console.log('[useSpeechRecognition] resetting buffer');
        lastSentTextRef.current = '';
    }, []);

    const updateBufferOnSend = useCallback((textSent: string) => {
        lastSentTextRef.current = (lastSentTextRef.current + " " + textSent).trim();
        console.log('[useSpeechRecognition] updated offset buffer:', lastSentTextRef.current);
    }, []);

    const startListening = useCallback(async () => {
        try {
            const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
            if (!permission.granted) {
                options.onError?.('Permiso de micrófono denegado. Por favor, habilita el acceso en la configuración.');
                return false;
            }

            resetBuffer();
            setIsListening(true);
            ExpoSpeechRecognitionModule.start({
                lang: 'en-US',
                interimResults: true,
                continuous: true,
            });
            return true;
        } catch (e) {
            console.error('[useSpeechRecognition] start error:', e);
            return false;
        }
    }, [options, resetBuffer]);

    const stopListening = useCallback(() => {
        try {
            ExpoSpeechRecognitionModule.stop();
        } catch (_) { }
        setIsListening(false);
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
        }
    }, []);

    useSpeechRecognitionEvent('result', (event) => {
        // Stop AI speaking if user interrupts
        TtsService.stop();

        const fullText = event.results?.[0]?.transcript ?? '';
        console.log('[useSpeechRecognition] Result event fullText:', fullText);

        if (!event.results?.length || !isListeningRef.current) return;

        // Clean buffer if speech cuts or simplifies
        if (fullText.length < lastSentTextRef.current.length) {
             lastSentTextRef.current = '';
        }

        let newText = fullText;
        const lastSent = lastSentTextRef.current;

        if (lastSent && fullText.toLowerCase().startsWith(lastSent.toLowerCase())) {
            newText = fullText.substring(lastSent.length).trim();
        } else {
            const offset = lastSent.length;
            newText = fullText.slice(offset).trim();
        }

        console.log('[useSpeechRecognition] offset:', lastSent.length, '| newText:', newText);

        if (newText !== currentInputTextRef.current) {
            options.onTextUpdate(newText);
            currentInputTextRef.current = newText; // Optimistic update

            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }

            if (newText) {
                silenceTimerRef.current = setTimeout(() => {
                    if (isListeningRef.current) {
                        console.log('[useSpeechRecognition] Silence timer fired with:', newText);
                        options.onSilenceDetected(newText);
                    }
                }, 3000) as unknown as number;
            }
        }
    });

    useSpeechRecognitionEvent('end', () => {
        setIsListening(false);
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
        }
    });

    return {
        isListening,
        startListening,
        stopListening,
        updateBufferOnSend,
        resetBuffer,
        updateCurrentInputText,
    };
};
