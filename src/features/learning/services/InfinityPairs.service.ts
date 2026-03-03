import { GeminiService } from './Gemini.service';

export interface Pair {
    left: string;
    right: string;
}

export const InfinityPairsService = {
    /**
     * Fetches a batch of unique word/phrase pairs from Gemini.
     */
    fetchPairs: async (lessonId: string | undefined, batchSize: number = 25): Promise<Pair[]> => {
        const topic = lessonId ? `el tema '${lessonId}'` : "palabras y frases comunes en inglés general";

        const prompt = `
        Genera ${batchSize} pares de palabras y frases variadas para ${topic}.
        Tu salida DEBE ser estrictamente un objeto JSON válido con un arreglo "pairs".
        Estructura:
        {
          "pairs": [
             { "left": "word or phrase in english", "right": "translation in spanish" },
             { "left": "word or phrase in english", "right": "translation in spanish" }
          ]
        }
        NO incluyas texto fuera del JSON. Devuelve pares únicos.
        `;

        try {
            const responseText = await GeminiService.generateResponse(prompt, { raw: true });
            const cleanText = responseText.replace(/```json|```/g, '').trim();

            let data;
            try {
                data = JSON.parse(cleanText);
            } catch (e) {
                console.error("Gemini select pairs parse error", e);
                data = { pairs: [] };
            }

            if (data.pairs && Array.isArray(data.pairs)) {

                return data.pairs;
            }
            return [];
        } catch (error) {
            console.error("Failed to fetch pairs", error);
            return [];
        }
    }
};
