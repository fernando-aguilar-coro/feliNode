import * as FileSystem from 'expo-file-system';
import { supabase } from '../../../api/supabaseClient';

// Simplified Types
interface AzureMetrics {
    AccuracyScore: number;
    FluencyScore?: number;
    CompletenessScore?: number;
    PronScore?: number;
    ErrorType?: string;
}

interface AzurePhoneme {
    Phoneme: string;
    Offset: number;
    Duration: number;
    AccuracyScore?: number; // Direct property fallback
    PronunciationAssessment?: AzureMetrics;
}

interface AzureSyllable {
    Syllable: string;
    Grapheme?: string;
    Offset: number;
    Duration: number;
    AccuracyScore?: number; // Direct property fallback
    PronunciationAssessment?: AzureMetrics;
}

interface AzureWord {
    Word: string;
    Offset: number;
    Duration: number;
    AccuracyScore?: number; // Direct property fallback
    PronunciationAssessment?: AzureMetrics;
    Syllables?: AzureSyllable[];
    Phonemes?: AzurePhoneme[];
}

interface AzureResponse {
    RecognitionStatus: number | string;
    NBest: {
        Confidence: number;
        Lexical: string;
        ITN: string;
        MaskedITN: string;
        Display: string;
        AccuracyScore?: number; // Direct property fallback
        PronunciationAssessment?: AzureMetrics; // Nested property
        Words: AzureWord[]
    }[];
}

export interface BackendResponse {
    azure_analysis: AzureResponse;
    gemini_feedback: string;
}


export interface PronunciationSyllableResult {
    syllable: string;
    accuracyScore: number;
}

export interface PronunciationPhonemeResult {
    phoneme: string;
    accuracyScore: number;
}

export interface PronunciationWordResult {
    word: string;
    accuracyScore: number;
    errorType?: string;
    syllables: PronunciationSyllableResult[];
    phonemes: PronunciationPhonemeResult[];
}

export interface PronunciationResult {
    overallScore: number;
    fluencyScore?: number;
    completenessScore?: number;
    pronScore?: number;
    words: PronunciationWordResult[];
    geminiFeedback?: string;
}

const BASE_URL = "https://feli-node-back.vercel.app/api/pronunciation_assessment";

export const PronunciationService = {
    assessPronunciation: async (audioUri: string, referenceText: string): Promise<PronunciationResult> => {
        // Validate URI
        if (!audioUri) {
            throw new Error('Audio URI is null or empty');
        }

        try {
            // Get the current session token
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session?.access_token) {
                throw new Error('User not authenticated');
            }

            const token = session.access_token;

            const base64Audio = await new FileSystem.File(audioUri).base64();
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    text: referenceText,
                    audio: base64Audio,
                }),
            });

            if (!response.ok) throw new Error(`Backend Error (${response.status}): ${await response.text()}`);

            const text = await response.text();
            console.log("Raw Server Response:", text);
            const parsed: BackendResponse = JSON.parse(text);
            console.log("Parsed data:", JSON.stringify(parsed, null, 2));

            const data = parsed.azure_analysis;
            const geminiFeedback = parsed.gemini_feedback;

            // Check for success (API can return string "Success" or enum 0)
            const isSuccess = data.RecognitionStatus === 'Success' || data.RecognitionStatus === 0;

            if (!isSuccess || !data.NBest?.[0]) {
                throw new Error(`Recognition failed: ${data.RecognitionStatus}`);
            }

            const best = data.NBest[0];

            // Helper to get score regardless of structure (nested or flat)
            const getScore = (item: any) => {
                if (item.PronunciationAssessment?.AccuracyScore !== undefined) {
                    return item.PronunciationAssessment.AccuracyScore;
                }
                return item.AccuracyScore ?? 0;
            };

            const getMetrics = (item: any) => item.PronunciationAssessment || {};

            return {
                overallScore: getScore(best),
                fluencyScore: getMetrics(best).FluencyScore,
                completenessScore: getMetrics(best).CompletenessScore,
                pronScore: getMetrics(best).PronScore,
                words: best.Words.map(w => ({
                    word: w.Word,
                    accuracyScore: getScore(w),
                    errorType: getMetrics(w).ErrorType,
                    syllables: w.Syllables?.map(s => ({
                        syllable: s.Syllable,
                        accuracyScore: getScore(s)
                    })) || [],
                    phonemes: w.Phonemes?.map(p => ({
                        phoneme: p.Phoneme,
                        accuracyScore: getScore(p)
                    })) || []
                })),
                geminiFeedback: geminiFeedback
            };
        } catch (error) {
            console.error('Pronunciation Assessment Error:', error);
            throw error;
        }
    },
};
