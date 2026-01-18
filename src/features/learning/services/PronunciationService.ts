// Types for the Azure Pronunciation Assessment Response
export interface AzureSyllable {
    Syllable: string;
    Grapheme: string;
    Offset: number;
    Duration: number;
    AccuracyScore: number;
}

export interface AzurePhoneme {
    Phoneme: string;
    Offset: number;
    Duration: number;
    AccuracyScore: number;
}

export interface AzureWord {
    Word: string;
    Offset: number;
    Duration: number;
    Confidence: number;
    AccuracyScore: number;
    Syllables?: AzureSyllable[];
    Phonemes?: AzurePhoneme[];
    ErrorType?: string; // "Omission", "Insertion", "Mispronunciation", etc.
}

export interface AzureNBest {
    Confidence: number;
    Lexical: string;
    ITN: string;
    MaskedITN: string;
    Display: string;
    AccuracyScore: number;
    Words: AzureWord[];
}

export interface AzureResponse {
    RecognitionStatus: string;
    Offset: number;
    Duration: number;
    DisplayText: string;
    SNR: number;
    NBest: AzureNBest[];
}

// Mapped Clean Result Type
export interface PronunciationResult {
    overallScore: number;
    words: {
        word: string;
        accuracyScore: number;
        errorType?: string;
        syllables: {
            syllable: string;
            grapheme: string;
            accuracyScore: number;
        }[];
    }[];
}

const BASE_URL = "https://feli-node-back.vercel.app/api/pronunciation_assessment";

export const PronunciationService = {
    /**
     * Assess pronunciation by sending audio to the backend.
     * @param audioUri Local URI of the audio file.
     * @param referenceText Text that the user was supposed to read.
     */
    assessPronunciation: async (audioUri: string, referenceText: string): Promise<PronunciationResult> => {
        try {
            console.log(`Preparing to assess pronunciation for: "${referenceText}"`);

            // 1. Fetch the file from the local URI to get a Blob
            const fileResponse = await fetch(audioUri);
            const audioBlob = await fileResponse.blob();

            // 2. Construct the URL with query parameter
            const url = `${BASE_URL}?text=${encodeURIComponent(referenceText)}`;

            // 3. Send the POST request with the raw audio blob
            console.log('Sending audio to backend...');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'audio/wav',
                },
                body: audioBlob,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Backend Error (${response.status}): ${errorText}`);
            }

            // 4. Parse the response
            const azureResult: AzureResponse = await response.json();
            console.log('Received response from backend');

            if (azureResult.RecognitionStatus !== 'Success' || !azureResult.NBest || azureResult.NBest.length === 0) {
                throw new Error(`Recognition failed: ${azureResult.RecognitionStatus}`);
            }

            const bestMatch = azureResult.NBest[0];

            // 5. Map to a cleaner structure
            const result: PronunciationResult = {
                overallScore: bestMatch.AccuracyScore,
                words: bestMatch.Words.map((word) => ({
                    word: word.Word,
                    accuracyScore: word.AccuracyScore,
                    errorType: word.ErrorType,
                    syllables: word.Syllables?.map((syl) => ({
                        syllable: syl.Syllable,
                        grapheme: syl.Grapheme,
                        accuracyScore: syl.AccuracyScore,
                    })) || [],
                })),
            };

            return result;

        } catch (error) {
            console.error('Pronunciation Assessment Error:', error);
            throw error;
        }
    },
};