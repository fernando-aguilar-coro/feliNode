/**
 * Splits text into chunks that respect a maximum length, preserving sentence structure.
 * Hierarchy of splitting:
 * 1. Sentence delimiters (.?!)
 * 2. Comma delimiters (,)
 * 3. Space delimiters ( )
 * 4. Hard limit (slice)
 */
export function splitTextSmartly(text: string, maxLength: number = 200): string[] {
    const chunks: string[] = [];
    const sentences = text.match(/[^.?!]+[.?!]+|[^.?!]+$/g) || [text];

    for (const sentence of sentences) {
        if (sentence.length <= maxLength) {
            chunks.push(sentence.trim());
        } else {
            // Split by comma
            const subSentences = sentence.split(',');
            let currentSub = "";

            for (const sub of subSentences) {
                const candidate = currentSub ? `${currentSub},${sub}` : sub;
                if (candidate.length <= maxLength) {
                    currentSub = candidate;
                } else {
                    if (currentSub) chunks.push(currentSub.trim());

                    // If the sub itself is too long, split by space
                    if (sub.length > maxLength) {
                        const words = sub.split(' ');
                        let currentWordChunk = "";
                        for (const word of words) {
                            const wordCandidate = currentWordChunk ? `${currentWordChunk} ${word}` : word;
                            if (wordCandidate.length <= maxLength) {
                                currentWordChunk = wordCandidate;
                            } else {
                                if (currentWordChunk) chunks.push(currentWordChunk.trim());
                                currentWordChunk = word;
                            }
                        }
                        if (currentWordChunk) currentSub = currentWordChunk; // Carry over
                        else currentSub = "";
                    } else {
                        currentSub = sub;
                    }
                }
            }
            if (currentSub) chunks.push(currentSub.trim());
        }
    }

    return chunks.filter(c => c.length > 0);
}
