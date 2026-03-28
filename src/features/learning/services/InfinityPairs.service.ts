import { GeminiService } from '../../../api/Gemini.service';
import { infinityProgressRepository } from '../../../db_local/repositories';

export interface Pair {
    left: string;
    right: string;
}

// Module-level counter to track total Gemini requests per session
let _geminiRequestCount = 0;

/** Tracks all pairs already used in the current session to avoid duplicates. */
const _usedFullKeys = new Set<string>();
const _usedLefts = new Set<string>();

/** Creates a normalized key for dedup comparison (lowercase, trimmed). */
const normalize = (text: string) => text.trim().toLowerCase();

export const InfinityPairsService = {
    /**
     * Resets the used-pairs tracker. Call this when starting a new game.
     */
    resetUsedPairs: () => {
        _usedFullKeys.clear();
        _usedLefts.clear();
    },

    /**
     * Fetches a batch of unique word/phrase pairs from Gemini.
     */
    fetchPairs: async (
        lessonId: string | undefined,
        batchSize: number = 15,
        currentScore: number = 0,
    ): Promise<Pair[]> => {
        const topic = lessonId ? `el tema '${lessonId}'` : 'inglés en general';
        _geminiRequestCount++;

        const targetId = lessonId?.trim() ? `Pairs: ${lessonId.trim()}` : 'General Pairs';
        let historicalMax = 0;
        try {
            historicalMax = await infinityProgressRepository.getInfinityScore(targetId);
        } catch (e) {
            console.warn('[InfinityPairs] Could not fetch historical max:', e);
        }

        // Construir bloque de exclusión compacto (máx 30-40 para no saturar el prompt)
        let exclusionBlock = '';
        if (_usedLefts.size > 0) {
            const list = Array.from(_usedLefts).slice(-40).join(', ');
            exclusionBlock = `\nNO uses estas palabras/frases ya enviadas: ${list}.`;
        }

        console.log(
            `[InfinityPairs] 🌐 Petición Gemini #${_geminiRequestCount}`,
            { topic, batchSize, currentScore, historicalMax, totalUsed: _usedLefts.size },
        );

        const prompt = `
        Genera ${batchSize} pares de palabras o frases para ${topic}.
        Dificultad adaptativa: Score actual ${currentScore}, Récord ${historicalMax}.
        ${exclusionBlock}
        
        Devuelve SOLO un JSON: {"pairs": [{"left": "english", "right": "spanish"}]}`;

        try {
            const responseText = await GeminiService.generateResponse(prompt, { raw: true });

            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const cleanText = jsonMatch ? jsonMatch[0] : responseText;

            let data: { pairs?: Pair[] };
            try {
                data = JSON.parse(cleanText);
            } catch (e) {
                console.error(`[InfinityPairs] ❌ Error JSON en petición #${_geminiRequestCount}`, e);
                data = { pairs: [] };
            }

            if (data.pairs && Array.isArray(data.pairs)) {
                const initialCount = data.pairs.length;
                const uniquePairs = data.pairs.filter(p => {
                    if (!p.left || !p.right) return false;
                    const l = normalize(p.left);
                    const pairK = `${l}|${normalize(p.right)}`;
                    return !_usedLefts.has(l) && !_usedFullKeys.has(pairK);
                });

                uniquePairs.forEach(p => {
                    const l = normalize(p.left);
                    _usedLefts.add(l);
                    _usedFullKeys.add(`${l}|${normalize(p.right)}`);
                });

                console.log(
                    `[InfinityPairs] ✅ #${_geminiRequestCount}: Recibidos ${initialCount}, Únicos ${uniquePairs.length}, Filtrados ${initialCount - uniquePairs.length}`,
                    uniquePairs.slice(0, 3), // muestra una muestra de los primeros 3
                );

                return uniquePairs;
            }
            return [];
        } catch (error) {
            console.error('[InfinityPairs] ❌ Request #' + _geminiRequestCount + ' failed', error);
            return [];
        }
    },
};
