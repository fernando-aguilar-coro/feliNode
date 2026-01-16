export enum ExerciseType {
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    FILL_IN_THE_BLANK = 'FILL_IN_THE_BLANK',
    TRANSLATE = 'TRANSLATE',
    SCRAMBLED_SENTENCE = 'SCRAMBLED_SENTENCE',
    PRONUNCIATION = 'PRONUNCIATION',
}

export interface BaseExercise {
    id: string;
    type: ExerciseType;
    question: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
    type: ExerciseType.MULTIPLE_CHOICE;
    options: { text: string, icon?: string }[];
    correctAnswer: string;
}

export interface FillInTheBlankExercise extends BaseExercise {
    type: ExerciseType.FILL_IN_THE_BLANK;
    sentence: string; // The sentence with a placeholder, e.g., "The cat is ___ the table"
    correctAnswer: string;
}

export interface TranslateExercise extends BaseExercise {
    type: ExerciseType.TRANSLATE;
    phrase: string;
    correctAnswer: string;
}

export interface ScrambledSentenceExercise extends BaseExercise {
    type: ExerciseType.SCRAMBLED_SENTENCE;
    segments: string[];
    correctAnswer: string;
}

export interface PronunciationExercise extends BaseExercise {
    type: ExerciseType.PRONUNCIATION;
    phrase: string;
    correctAnswer: string;
}

export type Exercise = MultipleChoiceExercise | FillInTheBlankExercise | TranslateExercise | ScrambledSentenceExercise | PronunciationExercise;
