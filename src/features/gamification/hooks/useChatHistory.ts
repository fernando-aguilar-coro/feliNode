import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage } from '../services/SpeakChat.service';

const WELCOME_MESSAGES = [
    "Hi! I'm Feli 🐱. What's your name?",
    "Hello there! I'm Feli 😊. How's your day going?",
    "Hey! I'm Feli 🐱. What do you like to do in your free time?",
    "Hi! I'm Feli 🌟. What's your favorite food?",
    "Hello! I'm Feli 🐱. Do you have any pets?",
    "Hey there! I'm Feli 😄. What's your favorite hobby?",
    "Hi! I'm Feli 🐱. What did you do today?",
    "Hello! I'm Feli 🌍. Where are you from?",
    // nuevas (más naturales y útiles para practicar inglés)
    "Hey! I'm Feli 🐱. What are you learning these days?",
    "Hi there! I'm Feli 😊. Do you like music? What's your favorite song?",
    "Hello! I'm Feli 🐱. Do you prefer mornings or nights?",
    "Hey! I'm Feli 🌟. What's your favorite movie?",
    "Hi! I'm Feli 🐱. Do you like traveling?",
    "Hello there! I'm Feli 😊. What's your dream job?",
    "Hey! I'm Feli 🐱. Coffee or tea?",
    "Hi! I'm Feli 🌍. What's your favorite place in your city?",
    "Hello! I'm Feli 🐱. Do you enjoy learning English?",
    "Hey there! I'm Feli 😄. What's something that makes you happy?",
    "Hi! I'm Feli 🐱. What apps do you use every day?",
    "Hello! I'm Feli 🌟. Do you like games or sports?",
    "Hey! I'm Feli 🐱. What's your favorite color?",
    "Hi there! I'm Feli 😊. What time do you usually wake up?",
    "Hello! I'm Feli 🐱. Do you like watching series?"
];

const getRandomWelcomeMessage = (): ChatMessage => {
    const text = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
    return {
        id: `welcome_${Date.now()}`,
        role: 'ai',
        text,
        timestamp: new Date(),
    };
};

/**
 * Hook that manages the chat message history and persists it to AsyncStorage.
 */
export const useChatHistory = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const messagesRef = useRef(messages);
    messagesRef.current = messages;

    // Load persisted messages on mount
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const stored = await AsyncStorage.getItem('speakChatMessages');
                if (stored) {
                    const parsed: ChatMessage[] = JSON.parse(stored);
                    if (parsed.length > 0) {
                        setMessages(parsed.slice(-15));
                        return;
                    }
                }
                // If nothing was loaded, start fresh with random welcome
                setMessages([getRandomWelcomeMessage()]);
            } catch (e) {
                console.error('[useChatHistory] Failed to load messages', e);
            }
        };
        loadMessages();
    }, []);

    // Save messages to AsyncStorage
    useEffect(() => {
        const saveMessages = async () => {
            try {
                await AsyncStorage.setItem('speakChatMessages', JSON.stringify(messages));
            } catch (e) {
                console.error('[useChatHistory] Failed to save messages', e);
            }
        };
        if (messages.length > 0) {
            saveMessages();
        }
    }, [messages]);

    const addMessage = useCallback((msg: ChatMessage) => {
        setMessages((prev) => {
            const updated = [...prev, msg];
            return updated.slice(-15); // Keeps last 15 items in history
        });
    }, []);

    const clearChat = useCallback(async () => {
        const freshWelcome = getRandomWelcomeMessage();
        setMessages([freshWelcome]);
        try {
            // Overwrite and persist the new startup message immediately
            await AsyncStorage.setItem('speakChatMessages', JSON.stringify([freshWelcome]));
        } catch (e) {
            console.error('[useChatHistory] Failed to clear messages', e);
        }
    }, []);

    return {
        messages,
        messagesRef,
        addMessage,
        setMessages,
        clearChat,
        WELCOME_MESSAGE: messages[0] || { text: '' }, // For TTS trigger if needed
    };
};
