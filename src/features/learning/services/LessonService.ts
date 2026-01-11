import { getTheoryByLessonId, saveUserProgress } from '../../../db_local/api_local';
import { ExerciseService } from './ExerciseService';

export const LessonService = {
    /**
     * Fetches theory content for a specific lesson.
     */
    getTheory: async (lessonId: string) => {
        const theoryRows: any[] = await getTheoryByLessonId(lessonId);
        // Combine all theory rows into a single content array or object
        // Assuming 'content' is a JSON string in the DB.
        return theoryRows.map(row => {
            try {
                return JSON.parse(row.content);
            } catch (e) {
                return { type: 'text', content: row.content };
            }
        });
    },

    /**
     * Fetches exercises for a specific lesson.
     */
    getExercises: async (lessonId: string) => {
        return await ExerciseService.getExercisesForLesson(lessonId);
    },

    /**
     * Marks a lesson as completed.
     */
    completeLesson: async (lessonId: string, score: number) => {
        await saveUserProgress(lessonId, score);
    }
};
