import { GeminiService } from '../../../api/Gemini.service';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export type ChatRole = 'user' | 'ai';

export interface ChatMessage {
    id: string;
    role: ChatRole;
    text: string;
    timestamp: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// System prompt – English-learning AI companion (responses in Spanish)
// ─────────────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
Eres Feli, un asistente amigable y motivador para aprender inglés.
Siempre responde rapido sin usar markdown e intenta generar o alargar la conversacion.
Si el usuario escribe en inglés, corrígelo sutilmente si hay errores.
`.trim();

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────
export const SpeakChatService = {
    /**
     * Sends the full conversation history + new user message to Gemini and
     * returns the AI reply text.
     */
    sendMessage: async (
        history: ChatMessage[],
        userText: string,
    ): Promise<string> => {
        // Build a simple conversation transcript for context
        const transcript = history
            .map((m) => `${m.role === 'user' ? 'Usuario' : 'Feli'}: ${m.text}`)
            .join('\n');

        const prompt = [
            SYSTEM_PROMPT,
            transcript ? `\nConversación previa:\n${transcript}` : '',
            `\nUsuario: ${userText}`,
            `\nFeli:`,
        ]
            .filter(Boolean)
            .join('\n');

        const reply = await GeminiService.generateResponse(prompt, { raw: true });
        return (reply || '').trim();
    },
};
