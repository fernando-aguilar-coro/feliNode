import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, SpeakChatService } from '../features/gamification/services/SpeakChat.service';
import { TtsService } from '../features/learning/services/Tts.service';

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

interface SpeakStoreState {
    messages: ChatMessage[];
    suggestions: string[];
    inputText: string;
    isLoading: boolean;
    error: string | null;
    isCallActive: boolean;

    setInputText: (text: string) => void;
    setIsCallActive: (active: boolean) => void;
    clearChat: () => void;
    loadInitialMessage: () => void;
    
    // Actions that contain actual side-effects
    sendMessage: (
        textOverride?: string, 
        audioCallbacks?: { stopListening?: () => void, startListening?: () => Promise<boolean>, resetBuffer?: () => void }
    ) => Promise<void>;
}

export const useSpeakStore = create<SpeakStoreState>()(
    persist(
        (set, get) => ({
            messages: [],
            suggestions: [],
            inputText: '',
            isLoading: false,
            error: null,
            isCallActive: false,

            setInputText: (text) => set({ inputText: text }),
            setIsCallActive: (active) => set({ isCallActive: active }),

            clearChat: () => {
                const freshWelcome = getRandomWelcomeMessage();
                set({ 
                    messages: [freshWelcome], 
                    suggestions: freshWelcome.suggestions || [],
                    inputText: '',
                    error: null
                });
            },

            loadInitialMessage: () => {
                const { messages } = get();
                if (messages.length === 0) {
                    const freshWelcome = getRandomWelcomeMessage();
                    set({ 
                        messages: [freshWelcome],
                        suggestions: freshWelcome.suggestions || []
                    });
                } else {
                    const lastMessage = messages[messages.length - 1];
                    if (lastMessage.role === 'ai' && lastMessage.suggestions) {
                        set({ suggestions: lastMessage.suggestions });
                    }
                }
            },

            sendMessage: async (textOverride, audioCallbacks) => {
                const { inputText, messages, isCallActive, isLoading } = get();
                const text = (textOverride !== undefined ? textOverride : inputText).trim();
                if (!text || isLoading) return;

                const userMessage: ChatMessage = {
                    id: `user_${Date.now()}`,
                    role: 'user',
                    text,
                    timestamp: new Date(),
                };

                // Optimistic UI
                set((state) => ({
                    messages: [...state.messages, userMessage].slice(-15), // keep last 15
                    inputText: '',
                    suggestions: [],
                    isLoading: true,
                    error: null,
                }));

                // Silenciar el micrófono de inmediato (durante la carga y la respuesta visual/hablada)
                if (get().isCallActive && audioCallbacks?.stopListening) {
                    audioCallbacks.stopListening();
                }

                try {
                    const { reply, suggestions: newSuggestions } = await SpeakChatService.sendMessage(get().messages, text);

                    const aiMessage: ChatMessage = {
                        id: `ai_${Date.now()}`,
                        role: 'ai',
                        text: reply,
                        timestamp: new Date(),
                        suggestions: newSuggestions || [],
                    };

                    set((state) => ({
                        messages: [...state.messages, aiMessage].slice(-15),
                        suggestions: newSuggestions || [],
                        isLoading: false,
                    }));

                    await TtsService.speak(reply, { language: 'en-US' });
                    
                    if (get().isCallActive && audioCallbacks?.resetBuffer && audioCallbacks?.startListening) {
                         audioCallbacks.resetBuffer();
                         audioCallbacks.startListening();
                    }
                } catch (err) {
                    console.error('[SpeakStore.sendMessage] Error:', err);
                    set({ error: 'No se pudo obtener respuesta. Inténtalo de nuevo.', isLoading: false });

                    // Si falló el API, reacivar el micrófono si seguíamos en modo llamada
                    if (get().isCallActive && audioCallbacks?.resetBuffer && audioCallbacks?.startListening) {
                        audioCallbacks.resetBuffer();
                        audioCallbacks.startListening();
                    }
                }
            }
        }),
        {
            name: 'speak-chat-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ messages: state.messages }), // Only persist messages!
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.loadInitialMessage();
                }
            }
        }
    )
);
