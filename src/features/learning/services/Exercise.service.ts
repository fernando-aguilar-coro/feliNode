import { Exercise } from '../types/exercise';
import { exerciseRepository } from '../../../db_local/repositories';
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

            const dbExercises = await exerciseRepository.getExercisesByLessonId(lessonId);

            // 1. Map DB exercises to App exercises
            const mapped = dbExercises
                .map((ex: any) => mapDbExerciseToAppExercise(ex))
                .filter((ex): ex is Exercise => ex !== null);

            // 2. Auto-generate listening exercises
            const generatedListening = mapped
                .map(generateListeningExercise)
                .filter((ex): ex is Exercise => ex !== null);

            // 3. Combine and shuffle
            return shuffleArray([...mapped, ...generatedListening]);
        } catch (error) {
            console.error('[ExerciseService] Error fetching exercises:', error);
            return [];
        }
    },

};
