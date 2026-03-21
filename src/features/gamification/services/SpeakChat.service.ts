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
    suggestions?: string[];
}

export interface ChatServiceResponse {
    reply: string;
    suggestions: string[];
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
AI: Maybe you mean "She goes to school every day". What does she study?
4. ENGANCHE: Termina SIEMPRE tu respuesta con una pregunta corta en Inglés para animar al usuario a seguir hablando.
5. FORMATO DE RESPUESTA: TU RESPUESTA DEBE SER ÚNICAMENTE UN OBJETO JSON VÁLIDO. 
   - "reply": tu respuesta conversacional según las reglas anteriores.
   - "suggestions": un arreglo de 3 posibles respuestas cortas en inglés que el usuario podría usar para contestarte.
   Ejemplo de tu salida JSON:
   {
     "reply": "I love fish! What is your favorite food?",
     "suggestions": ["I like pizza", "My favorite is sushi", "I don't like food"]
   }
`.trim();

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────
export const SpeakChatService = {
    /**
     * Sends the full conversation history + new user message to Gemini and
     * returns the AI reply and suggestions.
     */
    sendMessage: async (
        history: ChatMessage[],
        userText: string,
    ): Promise<ChatServiceResponse> => {
        console.log('[SpeakChatService] userText:', userText);
        // Build a simple conversation transcript for context
        const transcript = history
            .map((m) => `${m.role === 'user' ? 'Usuario' : 'Feli'}: ${m.text}`)
            .join('\n');

        const prompt = [
            SYSTEM_PROMPT,
            transcript ? `\nConversación previa:\n${transcript}` : '',
            `\nUsuario: ${userText}`,
            `\nFeli (output solo JSON):`,
        ]
            .filter(Boolean)
            .join('\n');

        console.log('[SpeakChatService] Generated Prompt:\n', prompt);

        const replyString = await GeminiService.generateResponse(prompt, { raw: true });
        console.log('[SpeakChatService] AI Reply String:', replyString);
        
        try {
            // Clean markdown JSON formatting if present
            const jsonStr = replyString.replace(/^\`\`\`(json)?|\`\`\`$/gm, '').trim();
            const parsed = JSON.parse(jsonStr);
            return {
                reply: parsed.reply || "Meow, algo salió mal.",
                suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
            };
        } catch (error) {
            console.error('[SpeakChatService] Failed to parse JSON:', replyString, error);
            return {
                reply: replyString || "Meow, algo salió mal.",
                suggestions: [],
            };
        }
    },
};
