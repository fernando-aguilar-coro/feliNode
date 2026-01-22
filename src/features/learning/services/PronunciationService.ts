import * as FileSystem from 'expo-file-system';

// Simplified Types
interface AzureWord {
    Word: string; Offset: number; Duration: number; AccuracyScore: number; ErrorType?: string;
    Syllables?: { Syllable: string; Grapheme: string; AccuracyScore: number }[];
}

interface AzureResponse {
    RecognitionStatus: string; NBest: { AccuracyScore: number; Words: AzureWord[] }[];
}

export interface PronunciationResult {
    overallScore: number;
    words: { word: string; accuracyScore: number; errorType?: string; syllables: { syllable: string; accuracyScore: number }[] }[];
}

const BASE_URL = "https://feli-node-back.vercel.app/api/pronunciation_assessment";

export const PronunciationService = {
    assessPronunciation: async (audioUri: string, referenceText: string): Promise<PronunciationResult> => {
        // Validate URI
        if (!audioUri) {
            throw new Error('Audio URI is null or empty');
        }

        try {
            const base64Audio = await new FileSystem.File(audioUri).base64();
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: referenceText,
                    audio: base64Audio,
                }),
            });

            if (!response.ok) throw new Error(`Backend Error (${response.status}): ${await response.text()}`);

            const data: AzureResponse = await response.json();
            if (data.RecognitionStatus !== 'Success' || !data.NBest?.[0]) throw new Error(`Recognition failed: ${data.RecognitionStatus}`);

            const best = data.NBest[0];
            return {
                overallScore: best.AccuracyScore,
                words: best.Words.map(w => ({
                    word: w.Word,
                    accuracyScore: w.AccuracyScore,
                    errorType: w.ErrorType,
                    syllables: w.Syllables?.map(s => ({ syllable: s.Syllable, accuracyScore: s.AccuracyScore })) || []
                }))
            };
        } catch (error) {
            console.error('Pronunciation Assessment Error:', error);
            throw error;
        }
    },
};