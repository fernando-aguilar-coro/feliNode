import { useState, useCallback, useRef } from 'react';
import { SpeakChatService, ChatMessage } from '../services/SpeakChat.service';

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────
export const useSpeakChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'ai',
            text: '¡Hola! Soy Feli 🐱 Tu asistente para aprender inglés. ¿Sobre qué quieres practicar hoy?',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Keep a stable ref to the latest messages for sendMessage (avoids stale closure)
    const messagesRef = useRef(messages);
    messagesRef.current = messages;

    const sendMessage = useCallback(async () => {
        const text = (inputText || '').trim();
        if (!text || isLoading) return;

        const userMessage: ChatMessage = {
            id: `user_${Date.now()}`,
            role: 'user',
            text,
            timestamp: new Date(),
        };

        // Optimistically add user message and clear input
        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);
        setError(null);

        try {
            // Pass the history BEFORE the new user message so the service
            // builds context correctly
            const reply = await SpeakChatService.sendMessage(
                messagesRef.current,
                text,
            );

            const aiMessage: ChatMessage = {
                id: `ai_${Date.now()}`,
                role: 'ai',
                text: reply,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            setError('No se pudo obtener respuesta. Inténtalo de nuevo.');
            console.error('[useSpeakChat] Error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [inputText, isLoading]);

    const clearChat = useCallback(() => {
        setMessages([
            {
                id: 'welcome',
                role: 'ai',
                text: '¡Hola! Soy Feli 🐱 Tu asistente para aprender inglés. ¿Sobre qué quieres practicar hoy?',
                timestamp: new Date(),
            },
        ]);
        setError(null);
    }, []);

    return {
        messages,
        inputText,
        setInputText,
        isLoading,
        error,
        sendMessage,
        clearChat,
    };
};
