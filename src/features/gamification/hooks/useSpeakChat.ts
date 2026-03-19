import { useState, useCallback, useEffect, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { ChatMessage, SpeakChatService } from '../services/SpeakChat.service';
import { TtsService } from '../../learning/services/Tts.service';
import { useChatHistory } from './useChatHistory';
import { useSpeechRecognition } from './useSpeechRecognition';

/**
 * Orchestrator hook for Speak chat flow.
 * Combines chat history state and speech recognition continuous listening flow.
 */
export const useSpeakChat = () => {
    const { messages, messagesRef, addMessage, clearChat, WELCOME_MESSAGE } = useChatHistory();
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCallActive, setIsCallActive] = useState(false);

    const isCallActiveRef = useRef(isCallActive);
    useEffect(() => {
        isCallActiveRef.current = isCallActive;
    }, [isCallActive]);

    const isLoadingRef = useRef(isLoading);
    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    // ── Speech Events Setup (needs to be above sendMessage so methods can be bound) ──
    const onSilenceDetected = useCallback((text: string) => {
        console.log('[useSpeakChat] 3s Timer triggered with:', text);
        if (isCallActiveRef.current && !isLoadingRef.current) {
            sendMessage(text); // We can still call this because it's in a callback hook
        }
    }, []);

    const onTextUpdate = useCallback((text: string) => {
        setInputText(text);
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
        onError: (err) => setError(err),
    });

    // ── Sends a message to the AI ───────────────────────────────────────
    const sendMessage = useCallback(async (textOverride?: string) => {
        const text = (textOverride !== undefined && typeof textOverride === 'string' ? textOverride : inputText).trim();
        if (!text || isLoadingRef.current) return;


        const userMessage: ChatMessage = {
            id: `user_${Date.now()}`,
            role: 'user',
            text,
            timestamp: new Date(),
        };

        addMessage(userMessage);
        setInputText(''); // Clear input optimistically
        setIsLoading(true);
        setError(null);

        // Update recognition buffer track offset to account for what was sent
        updateBufferOnSend(text);

        try {
            const reply = await SpeakChatService.sendMessage(messagesRef.current, text);

            const aiMessage: ChatMessage = {
                id: `ai_${Date.now()}`,
                role: 'ai',
                text: reply,
                timestamp: new Date(),
            };

            addMessage(aiMessage);

            if (isCallActiveRef.current) {
                stopListening();
            }

            await TtsService.speak(reply, { language: 'en-US' });
        } catch (err) {
            setError('No se pudo obtener respuesta. Inténtalo de nuevo.');
            console.error('[useSpeakChat] Error:', err);
        } finally {
            setIsLoading(false);

            if (isCallActiveRef.current) {
                resetBuffer(); 
                startListening();
            }
        }
    }, [messagesRef, addMessage, inputText, updateBufferOnSend, stopListening, resetBuffer, startListening]);

    // Update the silence handler with a back-reference to updated sendMessage
    // to avoid stale scopes on the callback execution.
    const onSilenceRef = useRef(sendMessage);
    onSilenceRef.current = sendMessage;

    // Synchronize recognition input tracking with local text updates
    useEffect(() => {
        updateCurrentInputText(inputText);
    }, [inputText, updateCurrentInputText]);

    const isFocused = useIsFocused();

    // ── Lifecycles (Focus & Calls) ─────────────────────────────────────
    useEffect(() => {
        if (isFocused && WELCOME_MESSAGE.text) {
            TtsService.speak(WELCOME_MESSAGE.text, { language: 'en-US' });
        } else {
            TtsService.stop();
            if (isCallActiveRef.current) {
                stopListening();
            }
            setIsCallActive(false);
        }
        return () => {
            TtsService.stop();
        };
    }, [isFocused, WELCOME_MESSAGE.text, stopListening]);


    const toggleCallMode = useCallback(async () => {
        const nextState = !isCallActive;
        if (nextState) {
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
    }, [isCallActive, resetBuffer, startListening, stopListening]);

    useEffect(() => {
        if (!isCallActive) {
            TtsService.stop();
            stopListening();
        }
    }, [isCallActive, stopListening]);

    return {
        messages,
        inputText,
        setInputText,
        isLoading,
        error,
        sendMessage,
        clearChat,
        isCallActive,
        toggleCallMode,
        isListening,
    };
};
