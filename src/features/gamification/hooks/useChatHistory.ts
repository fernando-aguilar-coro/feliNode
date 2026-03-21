import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage } from '../services/SpeakChat.service';

const WELCOME_MESSAGES = [
    { text: "Hi! I'm Feli 🐱. What's your name?", suggestions: ["My name is...", "I am...", "Nice to meet you!"] },
    { text: "Hello there! I'm Feli 😊. How's your day going?", suggestions: ["It is good!", "I'm a bit tired", "Great, and yours?"] },
    { text: "Hey! I'm Feli 🐱. What do you like to do in your free time?", suggestions: ["I like reading", "I play sports", "I watch movies"] },
    { text: "Hi! I'm Feli 🌟. What's your favorite food?", suggestions: ["I love pizza", "Sushi is my favorite", "I enjoy salads"] },
    { text: "Hello! I'm Feli 🐱. Do you have any pets?", suggestions: ["Yes, I have a dog", "I have a cat", "No, I don't"] },
    { text: "Hey there! I'm Feli 😄. What's your favorite hobby?", suggestions: ["I play guitar", "I like to draw", "Playing video games"] },
    { text: "Hi! I'm Feli 🐱. What did you do today?", suggestions: ["I went to work", "I studied", "Nothing much"] },
    { text: "Hello! I'm Feli 🌍. Where are you from?", suggestions: ["I'm from Mexico", "I am from Spain", "I live in Colombia"] },
    { text: "Hey! I'm Feli 🐱. What are you learning these days?", suggestions: ["I'm learning English", "Programming", "I'm studying math"] },
    { text: "Hi there! I'm Feli 😊. Do you like music? What's your favorite song?", suggestions: ["I love rock music", "Pop is my favorite", "I don't listen to music"] },
    { text: "Hello! I'm Feli 🐱. Do you prefer mornings or nights?", suggestions: ["I am a morning person", "I prefer nights", "I like both"] },
    { text: "Hey! I'm Feli 🌟. What's your favorite movie?", suggestions: ["Action movies", "I like comedies", "Horror films"] },
    { text: "Hi! I'm Feli 🐱. Do you like traveling?", suggestions: ["Yes, very much!", "I haven't traveled much", "I love the beach"] },
    { text: "Hello there! I'm Feli 😊. What's your dream job?", suggestions: ["I want to be a doctor", "A software engineer", "A teacher"] },
    { text: "Hey! I'm Feli 🐱. Coffee or tea?", suggestions: ["I prefer coffee", "Tea is better", "I drink water"] },
    { text: "Hi! I'm Feli 🌍. What's your favorite place in your city?", suggestions: ["The park", "The mall", "My house"] },
    { text: "Hello! I'm Feli 🐱. Do you enjoy learning English?", suggestions: ["Yes, it's fun!", "It's a bit hard", "I practice every day"] },
    { text: "Hey there! I'm Feli 😄. What's something that makes you happy?", suggestions: ["My family", "Playing with my pet", "Eating good food"] },
    { text: "Hi! I'm Feli 🐱. What apps do you use every day?", suggestions: ["Instagram and WhatsApp", "I use YouTube", "Just this one!"] },
    { text: "Hello! I'm Feli 🌟. Do you like games or sports?", suggestions: ["I enjoy video games", "I play soccer", "Neither"] },
    { text: "Hey! I'm Feli 🐱. What's your favorite color?", suggestions: ["Blue", "Red", "Green"] },
    { text: "Hi there! I'm Feli 😊. What time do you usually wake up?", suggestions: ["At 7 AM", "Early in the morning", "I wake up late"] },
    { text: "Hello! I'm Feli 🐱. Do you like watching series?", suggestions: ["Yes, all the time", "Not really", "Sometimes on weekends"] }
];

const getRandomWelcomeMessage = (): ChatMessage => {
    const item = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
    return {
        id: `welcome_${Date.now()}`,
        role: 'ai',
        text: item.text,
        suggestions: item.suggestions,
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
