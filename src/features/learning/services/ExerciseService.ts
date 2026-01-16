import { Exercise, ExerciseType, MultipleChoiceExercise, FillInTheBlankExercise, ScrambledSentenceExercise, TranslateExercise, PronunciationExercise } from '../types/exercise';
import { getExercisesByLessonId } from '../../../db_local/api_local';

/**
 * Maps a raw database exercise object to the application's Exercise interface.
 * 
 * @param dbExercise The raw exercise object from SQLite (any type).
 * @returns An implementation of Exercise (MultipleChoice or FillInTheBlank) or null if type is unknown.
 */
const mapDbExerciseToAppExercise = (dbExercise: any): Exercise | null => {
    // Debug log to inspect raw data coming from DB
    console.log('[ExerciseService] Mapping DB item:', JSON.stringify(dbExercise, null, 2));

    let content: any = {};
    try {
        if (dbExercise.content) {
            content = JSON.parse(dbExercise.content);
        }
    } catch (e) {
        console.error('[ExerciseService] Failed to parse exercise content JSON:', e);
        return null;
    }

    switch (dbExercise.type) {
        case 'multiple_choice':
            // Logic:
            // Content contains { options: [{option_text, is_correct}], correctAnswer }
            const correctOption = content.options?.find((o: any) => o.is_correct);

            if (!content.options || content.options.length === 0) {
                console.warn('[ExerciseService] Warning: Multiple choice exercise has no options', dbExercise.id);
            }

            return {
                id: dbExercise.id.toString(),
                type: ExerciseType.MULTIPLE_CHOICE,
                question: dbExercise.instruction,
                options: content.options?.map((o: any) => ({
                    text: o.option_text,
                    icon: o.icon
                })) || [],
                correctAnswer: correctOption?.option_text || '',
            } as MultipleChoiceExercise;

        case 'fill_blank':
        case 'fill_blanks':
            // Logic:
            // Content contains { phrase, correct_answer } OR { prefix_text, suffix_text, hint, correct_answer }
            let sentence = content.phrase || '';
            if (!sentence && (content.prefix_text || content.suffix_text)) {
                sentence = `${content.prefix_text || ''} ___ ${content.suffix_text || ''}`;
            }

            return {
                id: dbExercise.id.toString(),
                type: ExerciseType.FILL_IN_THE_BLANK,
                question: dbExercise.instruction,
                sentence: sentence,
                correctAnswer: content.correct_answer,
            } as FillInTheBlankExercise;

        case 'scrambled_sentence':
            // Logic:
            // Content contains { segments: string[], correct_answer: string }
            return {
                id: dbExercise.id.toString(),
                type: ExerciseType.SCRAMBLED_SENTENCE,
                question: dbExercise.instruction,
                segments: content.segments || [],
                correctAnswer: content.correct_answer,
            } as ScrambledSentenceExercise;

        case 'translate':
            // Logic:
            // Content contains { phrase, correct_answer }
            return {
                id: dbExercise.id.toString(),
                type: ExerciseType.TRANSLATE,
                question: dbExercise.instruction,
                phrase: content.phrase || '',
                correctAnswer: content.correct_answer || '',
            } as TranslateExercise;

        case 'pronunciation':
            return {
                id: dbExercise.id.toString(),
                type: ExerciseType.PRONUNCIATION,
                question: dbExercise.instruction,
                phrase: content.phrase || '',
                correctAnswer: content.correct_answer || content.phrase || '',
            } as PronunciationExercise;

        default:
            console.warn(`[ExerciseService] Unknown exercise type: ${dbExercise.type}`);
            // Returning null allows us to filter out unsupported types gracefully
            return null;
    }
};

export const ExerciseService = {
    /**
     * Fetches exercises for a specific lesson from the local SQLite database.
     * Encapsulates the DB call and the data mapping transformation.
     */
    getExercisesForLesson: async (lessonId: string): Promise<Exercise[]> => {
        try {
            console.log(`[ExerciseService] Fetching exercises for lesson: ${lessonId}`);
            const dbExercises = await getExercisesByLessonId(lessonId);

            console.log(`[ExerciseService] Raw DB count: ${dbExercises.length}`);

            const mapped = dbExercises
                .map(mapDbExerciseToAppExercise)
                .filter((ex): ex is Exercise => ex !== null);

            console.log(`[ExerciseService] Mapped exercises count: ${mapped.length}`);
            return mapped;
        } catch (error) {
            console.error('[ExerciseService] Error fetching exercises:', error);
            return [];
        }
    },

    /**
     * Validates the user's answer against the correct answer.
     * Performs a case-insensitive trim comparison.
     */
    validateAnswer: (exercise: Exercise, answer: string): boolean => {
        if (!exercise || !exercise.correctAnswer) return false;
        return answer.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();
    }
};
