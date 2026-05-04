import RNFS from 'react-native-fs';
import { supabase } from '../../../api/supabaseClient';
import { useUserStore } from '../../../store/UserStore';

// Simplified Types
interface AzureMetrics {
    AccuracyScore: number;
    FluencyScore: number;
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
// result parsed from backend

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
    geminiFeedback: string;
}

import { API_BASE_URL } from '../../../config';

const BASE_URL = `${API_BASE_URL}/pronunciation_assessment`;

export const PronunciationService = {
    assessPronunciation: async (audioUri: string, referenceText: string): Promise<PronunciationResult> => {
        // Validate URI
        if (!audioUri) {
            throw new Error('Audio URI is null or empty');
        }

        try {
            const { isGuest } = useUserStore.getState();
            // Get the current session token
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (!isGuest && (sessionError || !session?.access_token)) {
                throw new Error('User not authenticated');
            }

            const token = session?.access_token;

            const filePath = audioUri.startsWith('file://') ? audioUri.replace('file://', '') : audioUri;
            const base64Audio = await RNFS.readFile(filePath, 'base64');

            const headers: any = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    text: referenceText,
                    audio: base64Audio,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unknown error');
                throw new Error(`${response.status}: ${errorText}`);
            }

            const text = await response.text();
            let parsed: BackendResponse;
            try {
                parsed = JSON.parse(text);
            } catch (e) {
                throw new Error(`Invalid JSON response from server: ${text.substring(0, 100)}`);
            }


            const data = parsed.azure_analysis;
            let geminiFeedback = parsed.gemini_feedback;

            // Suppress Gemini error messages if they contain 403 or look like server errors
            if (geminiFeedback && (geminiFeedback.includes('403') || geminiFeedback.toLowerCase().includes('forbidden'))) {
                geminiFeedback = '';
            }

            // Check for success (API can return string "Success" or enum 0)
            const isSuccess = data.RecognitionStatus === 'Success' || data.RecognitionStatus === 0;

            if (!isSuccess || !data.NBest?.[0]) {
                throw new Error(`Recognition failed: ${data.RecognitionStatus}`);
            }

            const best = data.NBest[0];

            // Helper to get score regardless of structure (nested or flat) and case
            const getAssessment = (item: any) => {
                return item.PronunciationAssessment || item.pronunciationAssessment || {};
            };

            const getScore = (item: any) => {
                const assessment = getAssessment(item);
                if (assessment.AccuracyScore !== undefined) return assessment.AccuracyScore;
                if (assessment.accuracyScore !== undefined) return assessment.accuracyScore;
                return item.AccuracyScore ?? item.accuracyScore ?? 0;
            };

            const bestAssessment = getAssessment(best);


            return {
                overallScore: getScore(best),
                fluencyScore: bestAssessment.FluencyScore ?? bestAssessment.fluencyScore,
                completenessScore: bestAssessment.CompletenessScore ?? bestAssessment.completenessScore,
                pronScore: bestAssessment.PronScore ?? bestAssessment.pronScore,
                words: best.Words.map((w: any) => ({
                    word: w.Word || w.word,
                    accuracyScore: getScore(w),
                    errorType: getAssessment(w).ErrorType || getAssessment(w).errorType,
                    syllables: w.Syllables?.map((s: any) => ({
                        syllable: s.Syllable || s.syllable,
                        accuracyScore: getScore(s)
                    })) || [],
                    phonemes: w.Phonemes?.map((p: any) => ({
                        phoneme: p.Phoneme || p.phoneme,
                        accuracyScore: getScore(p)
                    })) || []
                })),
                geminiFeedback: geminiFeedback
            };
        } catch (error: any) {
            if (error.message !== '403') {
                console.error('Pronunciation Assessment Error:', error);
            }
            throw error;
        }
    },
};
