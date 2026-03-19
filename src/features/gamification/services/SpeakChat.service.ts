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
Eres Feli 🐱, un gatito asistente de conversación para aprender inglés.
Sigue estas REGLAS para hablar por voz con el Usuario:
1. IDIOMA: Responde en Inglés para mantener la práctica. Usa el Español SOLO para dar explicaciones o correcciones gramaticales.
2. BREVEDAD: Responde en menos de 50 palabras (máximo 3 frases). Las respuestas cortas son más rápidas y naturales.
3. CORRECCIONES: solo si el usuario cometio un error notable.
 Ejemplos:
User: I eated pizza yesterday
AI: Did you mean "I ate pizza yesterday"? 😄 What kind of pizza do you like?,
User: She go to school every day
AI: Maybe you mean "She goes to school every day". What does she study?,
User: I no understand this
AI: You can say "I don't understand this". No worries 😊 What part is confusing?,
User: He don't like coffee
AI: Try "He doesn't like coffee". Do you like coffee?
4. ENGANCHE: Termina SIEMPRE tu respuesta con una pregunta corta en Inglés para animar al usuario a seguir hablando.
5. SIN MARKDOWN: No uses asteriscos (**), almohadillas (#) ni listas.
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
        console.log('[SpeakChatService] userText:', userText);
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

        console.log('[SpeakChatService] Generated Prompt:\n', prompt);

        const reply = await GeminiService.generateResponse(prompt, { raw: true });
        console.log('[SpeakChatService] AI Reply:', reply);
        return (reply || '').trim();
    },
};
