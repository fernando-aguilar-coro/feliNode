import { Exercise } from '../types/exercise';
import { GeminiService } from './Gemini.service';
import { mapDbExerciseToAppExercise, DbExercise } from '../helpers/exercises/exerciseMapper';
import { generateListeningExercise } from '../helpers/exercises/exerciseGenerator';

// Interface for the raw data structure coming from Gemini (User's Schema)
interface RawOption {
    option_text: string;
    is_correct: boolean;
}

interface RawExerciseContent {
    options?: RawOption[];
    correct_answer?: string;
    phrase?: string;
    sentence?: string; // For fill_blank, user prompt uses 'phrase' in example but definition might vary, let's support both or map 'phrase' to 'sentence' for fill_blank if needed. User example says: "phrase": "I ____ play..."
}

interface RawExercise {
    type: string;
    question?: string;
    content: RawExerciseContent;
}

interface GeminiResponse {
    exercises: RawExercise[];
}

export const InfinityService = {
    /**
     * Generates a list of exercises using Gemini AI based on a topic or general context.
     * Uses the user's preferred robust JSON schema.
     * @param topic - Optional topic or context for the exercises.
     * @param count - Number of exercises to generate (default: 5).
     * @returns A promise that resolves to an array of Exercise objects.
     */
    generateInfiniteExercises: async (topic: string = 'General English', count: number = 5): Promise<Exercise[]> => {
        // Updated prompt based on user's successful "COMPLETE LESSON" prompt, 
        // extracting only the exercises part for this service.
        const prompt = `
        Tu tarea es generar una lista de ejercicios de práctica para el tema: "${topic}".

        Tu salida DEBE ser estrictamente un objeto JSON válido con la siguiente estructura:
        {
          "exercises": [
             // Array de mínimo ${count} ejercicios variados
          ]
        }

        ### DETALLES DE "exercises" (Tipos Permitidos y sus esquemas de content):
        Cada ejercicio debe tener:
        - "type": (uno de los siguientes)
        - "question": (Instrucción O Pregunta. NO repitas el texto del ejercicio aquí si ya está en 'content')
        - "content": (según el tipo)

        1. **"multiple_choice"**
           - \`question\`: "La pregunta completa aquí (ej: '¿Cómo se dice gato? o rellena la frase')"
           - \`content\`: { "options": [{ "option_text": "...", "is_correct": boolean }] } 
            - minimo 3 opciones
        2. **"scrambled_sentence"**
           - \`question\`: "Ordena las palabras para formar la oración correcta." (O similar)
           - \`content\`: { "correct_answer": "Full sentence to be scrambled" }

        3. **"fill_blank"**
           - \`question\`: "Completa la frase con el verbo correcto." (Genérico)
           - \`content\`: { "phrase": "I ____ play football", "correct_answer": "can" }

        4. **"translate"**
           - \`content\`: { "phrase": "English phrase to translate", "correct_answer": "Frase en Español" }

        5. **"pronunciation"**
           - \`content\`: { "phrase": "English phrase to pronounce" }

        6. **"select_pairs"**
           - \`content\`: { "pairs": [{ "left": "string", "right": "string" }, { "left": "string", "right": "string" }] }
            - minimo 3 pares 
        ### REGLAS IMPORTANTES:
        - **NO** incluyas texto fuera del JSON.
        - Evita la redundancia: si el texto a trabajar está en \`content.phrase\`, NO lo pongas en \`question\`.
        - "question" para tipos distintos a multiple_choice debe ser una instrucción corta en Español.
        - Genera ejercicios diversos y relevantes para el nivel implícito del tema.
        `;

        try {
            const responseText = await GeminiService.generateResponse(prompt, { raw: true });

            // Cleanup markdown code blocks if present
            const cleanText = responseText.replace(/```json|```/g, '').trim();

            console.log("Raw JSON response:", cleanText);

            let parsedData: GeminiResponse;
            try {
                parsedData = JSON.parse(cleanText);
            } catch (e) {
                console.error("Error al parsear el JSON de Gemini:", e);
                // Basic recovery attempt for direct array
                if (cleanText.startsWith('[') && cleanText.endsWith(']')) {
                    try {
                        parsedData = { exercises: JSON.parse(cleanText) };
                    } catch (e2) {
                        return [];
                    }
                } else {
                    return [];
                }
            }

            if (!parsedData.exercises || !Array.isArray(parsedData.exercises)) {
                console.error("Estructura JSON inválida desde Gemini:", parsedData);
                return [];
            }

            // 1. Map generic Gemini response to "DbExercise" format and then to strict App Exercises using the Helper
            const baseExercises: Exercise[] = parsedData.exercises.map((item: RawExercise, index: number): Exercise | null => {
                // Construct a temporary "DbExercise" object to reuse the mapper logic
                const dbExercise: DbExercise = {
                    id: `infinite-${Date.now()}-${index}`,
                    type: item.type?.trim(),
                    instruction: item.question?.trim() || "",
                    content: JSON.stringify(item.content || {}) // Serialize content to match DbExercise expectation
                };

                return mapDbExerciseToAppExercise(dbExercise);
            }).filter((ex): ex is Exercise => ex !== null);

            // 2. Generate derived exercises (like Listening) to expand variety
            const derivedExercises: Exercise[] = [];
            baseExercises.forEach(ex => {
                const listeningEx = generateListeningExercise(ex);
                if (listeningEx) {
                    derivedExercises.push(listeningEx);
                }
            });

            // 3. Combine and return
            const allExercises = [...baseExercises, ...derivedExercises];

            // Optional: Simple shuffle to mix derived exercises with original ones
            return allExercises.sort(() => Math.random() - 0.5);

        } catch (error) {
            console.error('Error generando ejercicios infinitos con el nuevo esquema:', error);
            return [];
        }
    }
};