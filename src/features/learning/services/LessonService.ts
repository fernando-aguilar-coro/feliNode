import { getLessonById, saveUserProgress } from '../../../db_local/api_local';
import { ExerciseService } from './ExerciseService';

export const LessonService = {
    /**
     * Fetches theory content for a specific lesson.
     */
    getTheory: async (lessonId: string) => {
        const lesson: any = await getLessonById(lessonId);
        return lesson?.theory || '';
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
    },

    /**
     * Fetches the full lesson object.
     */
    getLesson: async (lessonId: string) => {
        return await getLessonById(lessonId);
    }
};
