
export const TextValidationService = {
    contractionMap: {
        "i'm": "i am",
        "you're": "you are",
        "he's": "he is",
        "she's": "she is",
        "it's": "it is",
        "we're": "we are",
        "they're": "they are",
        "can't": "cannot",
        "won't": "will not",
        "don't": "do not",
        "doesn't": "does not",
        "didn't": "did not",
        "isn't": "is not",
        "aren't": "are not",
        "wasn't": "was not",
        "weren't": "were not",
        "hasn't": "has not",
        "haven't": "have not",
        "hadn't": "had not",
        "wouldn't": "would not",
        "shouldn't": "should not",
        "couldn't": "could not",
        "mustn't": "must not",
        "let's": "let us",
        "that's": "that is",
        "who's": "who is",
        "what's": "what is",
        "here's": "here is",
        "there's": "there is",
        "where's": "where is",
        "how's": "how is",
    } as Record<string, string>,

    /**
     * Normalizes a string by converting to lowercase, handling contractions,
     * trimming, collapsing multiple spaces, and removing trailing punctuation.
     */
    normalizeAnswer: (text: string): string => {
        if (!text) return '';

        let normalized = text.toLowerCase();

        // 1. Normalize quotes (smart quotes to straight quotes)
        normalized = normalized.replace(/[‘’´`]/g, "'");

        // 2. Remove only acute accents (´) / \u0301
        normalized = normalized.normalize('NFD').replace(/[\u0301]/g, "");

        // 3. Expand contractions
        // We split by space to handle whole words, but need to be careful with punctuation attached
        // A simple regex replace for each key might be safer for now, or tokenizing.
        // Let's use word boundaries for the keys.

        Object.keys(TextValidationService.contractionMap).forEach(contraction => {
            const expansion = TextValidationService.contractionMap[contraction];
            const regex = new RegExp(`\\b${contraction}\\b`, 'g');
            normalized = normalized.replace(regex, expansion);
        });

        // 3. Cleanup whitespace and punctuation
        return normalized
            .trim()
            .replace(/\s+/g, ' ')           // Collapse multiple spaces
            .replace(/[,.;¡¿!]+$/g, '')     // Remove trailing punctuation
            .trim();
    }
};
