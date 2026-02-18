import { Exercise, ExerciseType } from '../types/exercise';
import { getExercisesByLessonId } from '../../../db_local/api_local';
import { mapDbExerciseToAppExercise } from '../helpers/exercises/exerciseMapper';
import { generateListeningExercise } from '../helpers/exercises/exerciseGenerator';

// Helper function to shuffle array (Fisher-Yates)
const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const ExerciseService = {
    /**
     * Fetches exercises for a specific lesson from the local SQLite database.
     */
    getExercisesForLesson: async (lessonId: string): Promise<Exercise[]> => {
        try {
            console.log(`[ExerciseService] Fetching exercises for lesson: ${lessonId}`);
            const dbExercises = await getExercisesByLessonId(lessonId);

            // 1. Map DB exercises to App exercises
            const mapped = dbExercises
                .map((ex: any) => mapDbExerciseToAppExercise(ex))
                .filter((ex): ex is Exercise => ex !== null);

            // 2. Auto-generate listening exercises
            const generatedListening = mapped
                .map(generateListeningExercise)
                .filter((ex): ex is Exercise => ex !== null);

            // 3. Combine and shuffle
            return [...mapped, ...generatedListening];
            // return shuffleArray([...mapped, ...generatedListening]);
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
        if (!exercise) return false;
        if (exercise.type === ExerciseType.PRONUNCIATION) return true;
        return answer.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();
    }
};
