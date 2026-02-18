import { Exercise, ExerciseType, PronunciationExercise, ScrambledSentenceExercise, TranslateExercise, FillInTheBlankExercise } from '../../types/exercise';
import { franc } from 'franc';

/**
 * Logic to generate a listening exercise based on another exercise type.
 */
export const generateListeningExercise = (ex: Exercise): Exercise | null => {
    switch (ex.type) {
        case ExerciseType.PRONUNCIATION:
            return {
                id: `${ex.id}-listening`,
                type: ExerciseType.LISTENING,
                question: 'Escucha y escribe las palabras que escuchaste',
                phrase: (ex as PronunciationExercise).phrase,
                correctAnswer: (ex as PronunciationExercise).phrase,
            };
        case ExerciseType.SCRAMBLED_SENTENCE:
            return {
                id: `${ex.id}-listening`, // Unique ID
                type: ExerciseType.LISTENING,
                question: 'Escucha y escribe la oración correcta',
                phrase: (ex as ScrambledSentenceExercise).correctAnswer,
                correctAnswer: (ex as ScrambledSentenceExercise).correctAnswer,
            };
        case ExerciseType.TRANSLATE:
            const translateEx = ex as TranslateExercise;

            // Check if source phrase is in Spanish. If so, skip generating listening exercise.
            // 'franc' returns 'spa' for Spanish.
            // We give it a minimum length context to avoid false positives on very short texts if needed,
            // but for now simple check is fine.
            const lang = franc(translateEx.phrase);
            if (lang === 'spa') {
                return null;
            }

            return {
                id: `${ex.id}-listening`,
                type: ExerciseType.LISTENING,
                question: 'Escribe la traducción de lo que escuchas',
                phrase: translateEx.phrase, // Speak the target language
                correctAnswer: translateEx.correctAnswer, // Expect matching text
            };
        case ExerciseType.FILL_IN_THE_BLANK:
            const fillEx = ex as FillInTheBlankExercise;
            // 1. Remove hints
            const sentenceWithoutHints = fillEx.sentence.replace(/\s*\(.*?\)/g, '');
            // 2. Replace underscores with answer
            const fullSentence = sentenceWithoutHints.replace(/_+/g, fillEx.correctAnswer).trim();
            return {
                id: `${ex.id}-listening`,
                type: ExerciseType.LISTENING,
                question: 'Escucha y escribe la oración completa',
                phrase: fullSentence,
                correctAnswer: fullSentence,
            };
        default:
            return null;
    }
};
