import { Exercise, ExerciseType, MultipleChoiceExercise, FillInTheBlankExercise, ScrambledSentenceExercise, TranslateExercise, PronunciationExercise, ListeningExercise, SelectPairsExercise } from '../../types/exercise';

/**
 * Interface representing the raw structure from the database.
 * Helps avoid implicit 'any'.
 */
export interface DbExercise {
    id: number | string;
    type: string;
    instruction: string | null;
    content: string; // JSON string
}

/**
 * Helper to safely parse JSON content from DB exercise.
 */
const parseContent = (dbExercise: DbExercise): any => {
    try {
        return dbExercise.content ? JSON.parse(dbExercise.content) : {};
    } catch (e) {
        console.error('[ExerciseService] Failed to parse content:', e);
        return {};
    }
};

// --- MAPPING HELPERS ---

const mapMultipleChoice = (dbExercise: DbExercise, content: any): MultipleChoiceExercise => {
    const correctOption = content.options?.find((o: any) => o.is_correct);
    return {
        id: dbExercise.id.toString(),
        type: ExerciseType.MULTIPLE_CHOICE,
        question: dbExercise.instruction || "",
        options: content.options?.map((o: any) => ({
            text: o.option_text,
            icon: o.icon
        })) || [],
        correctAnswer: correctOption?.option_text || '',
    };
};

const mapFillInTheBlank = (dbExercise: DbExercise, content: any): FillInTheBlankExercise => {
    let sentence = content.phrase || '';
    if (!sentence && (content.prefix_text || content.suffix_text)) {
        sentence = `${content.prefix_text || ''} ___ ${content.suffix_text || ''}`;
    }
    return {
        id: dbExercise.id.toString(),
        type: ExerciseType.FILL_IN_THE_BLANK,
        question: dbExercise.instruction || "",
        sentence: sentence,
        correctAnswer: content.correct_answer,
    };
};

const mapScrambledSentence = (dbExercise: DbExercise, content: any): ScrambledSentenceExercise => {
    const text = content.correct_answer || '';
    const segments = text.replace(/\./g, '').split(' ').sort(() => Math.random() - 0.5);

    return {
        id: dbExercise.id.toString(),
        type: ExerciseType.SCRAMBLED_SENTENCE,
        question: dbExercise.instruction || "",
        segments: segments,
        correctAnswer: text,
    };
};

const mapTranslate = (dbExercise: DbExercise, content: any): TranslateExercise => ({
    id: dbExercise.id.toString(),
    type: ExerciseType.TRANSLATE,
    question: dbExercise.instruction || "Traduce la siguiente frase",
    phrase: content.phrase || '',
    correctAnswer: content.correct_answer || '',
});

const mapPronunciation = (dbExercise: DbExercise, content: any): PronunciationExercise => ({
    id: dbExercise.id.toString(),
    type: ExerciseType.PRONUNCIATION,
    question: dbExercise.instruction || "Pronuncia la siguiente frase",
    phrase: content.phrase || '',
});

const mapListening = (dbExercise: DbExercise, content: any): ListeningExercise => {
    const text = content.correct_answer || content.phrase || '';
    const segments = text.replace(/[\.,\?¡!¿]/g, '').split(' ').filter((w: string) => w.trim() !== '').sort(() => Math.random() - 0.5);
    return {
        id: dbExercise.id.toString(),
        type: ExerciseType.LISTENING,
        question: dbExercise.instruction || "",
        phrase: content.phrase || '',
        correctAnswer: text,
        segments,
    };
};

const mapSelectPairs = (dbExercise: DbExercise, content: any): SelectPairsExercise => ({
    id: dbExercise.id.toString(),
    type: ExerciseType.SELECT_PAIRS,
    question: dbExercise.instruction || "Selecciona los pares correctos",
    pairs: content.pairs || [],
    correctAnswer: 'DONE',
});

/**
 * Maps a raw database exercise object to the application's Exercise interface.
 */
export const mapDbExerciseToAppExercise = (dbExercise: DbExercise): Exercise | null => {
    const content = parseContent(dbExercise);

    switch (dbExercise.type) {
        case 'multiple_choice':
            return mapMultipleChoice(dbExercise, content);
        case 'fill_blank':
        case 'fill_blanks':
            return mapFillInTheBlank(dbExercise, content);
        case 'scrambled_sentence':
            return mapScrambledSentence(dbExercise, content);
        case 'translate':
            return mapTranslate(dbExercise, content);
        case 'pronunciation':
            return mapPronunciation(dbExercise, content);
        case 'listening':
            return mapListening(dbExercise, content);
        case 'select_pairs':
            return mapSelectPairs(dbExercise, content);
        default:
            console.warn(`[ExerciseService] Unknown type: ${dbExercise.type}`);
            return null;
    }
};
