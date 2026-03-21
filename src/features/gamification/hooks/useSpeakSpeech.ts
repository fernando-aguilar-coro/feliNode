import { useCallback, useEffect, useRef } from 'react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useSpeakStore } from '../../../store/useSpeakStore';
import { useSpeechRecognition } from './useSpeechRecognition';
import { TtsService } from '../../learning/services/Tts.service';

/**
 * Hook that strictly handles STT/Mic hardware interactions 
 * and binds directly to the SpeakStore.
 */
export const useSpeakSpeech = () => {
    const isCallActive = useSpeakStore(state => state.isCallActive);
    const isLoading = useSpeakStore(state => state.isLoading);
    const setInputText = useSpeakStore(state => state.setInputText);
    const inputText = useSpeakStore(state => state.inputText);
    const sendMessageStore = useSpeakStore(state => state.sendMessage);
    const setIsCallActive = useSpeakStore(state => state.setIsCallActive);

    const isCallActiveRef = useRef(isCallActive);
    useEffect(() => {
        isCallActiveRef.current = isCallActive;
    }, [isCallActive]);

    const isLoadingRef = useRef(isLoading);
    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    const onTextUpdate = useCallback((text: string) => {
        setInputText(text);
    }, [setInputText]);

    const onSilenceRef = useRef<((text?: string) => void) | null>(null);
    const onSilenceDetected = useCallback((text: string) => {
        console.log('[useSpeakSpeech] 3s Timer triggered with:', text);
        if (isCallActiveRef.current && !isLoadingRef.current) {
            if (onSilenceRef.current) onSilenceRef.current(text);
        }
    }, []);

    const {
        isListening,
        startListening,
        stopListening,
        updateBufferOnSend,
        updateCurrentInputText,
        resetBuffer,
    } = useSpeechRecognition({
        onSilenceDetected,
        onTextUpdate,
        onError: (err) => useSpeakStore.setState({ error: err }),
    });

    const sendMessage = useCallback((textOverride?: string) => {
        const currentInput = useSpeakStore.getState().inputText;
        const textToUse = (textOverride !== undefined && typeof textOverride === 'string' ? textOverride : currentInput).trim();
        
        if (!textToUse || useSpeakStore.getState().isLoading) return;
        
        updateBufferOnSend(textToUse);
        
        sendMessageStore(textToUse, {
            stopListening,
            startListening,
            resetBuffer
        });
    }, [sendMessageStore, stopListening, startListening, resetBuffer, updateBufferOnSend]);

    useEffect(() => {
        onSilenceRef.current = sendMessage;
    }, [sendMessage]);

    useEffect(() => {
        updateCurrentInputText(inputText);
    }, [inputText, updateCurrentInputText]);


    useFocusEffect(
        useCallback(() => {
            let timeout: NodeJS.Timeout;
            
            // Obtener el último mensaje del AI solo al enfocar la pantalla
            const currentMessages = useSpeakStore.getState().messages;
            const initialWelcomeText = [...currentMessages].reverse().find(m => m.role === 'ai')?.text;
            
            if (initialWelcomeText) {
                // Wait slightly to ensure audio engine is ready after transition
                timeout = setTimeout(() => {
                    TtsService.speak(initialWelcomeText, { language: 'en-US' });
                }, 350);
            }
            
            return () => {
                if (timeout) clearTimeout(timeout);
                TtsService.stop();
                
                if (isCallActiveRef.current) {
                    stopListening();
                }
                setIsCallActive(false);
            };
        }, [stopListening, setIsCallActive])
    );

    // Ensure TTS stops if the component is completely unmounted
    useEffect(() => {
        return () => {
            TtsService.stop();
        };
    }, []);

    const toggleCallMode = useCallback(async () => {
        if (!isCallActive) {
            setInputText('');
            resetBuffer();
            const started = await startListening();
            if (started) {
                setIsCallActive(true);
            }
        } else {
            stopListening();
            setIsCallActive(false);
        }
    }, [isCallActive, resetBuffer, startListening, stopListening, setInputText, setIsCallActive]);

    useEffect(() => {
        if (!isCallActive) {
            TtsService.stop();
            stopListening();
        }
    }, [isCallActive, stopListening]);

    return {
        isListening,
        toggleCallMode,
        sendMessage,
    };
};
