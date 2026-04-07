import { lessonRepository, userProgressRepository } from '../../../db_local/repositories';
import { ExerciseService } from './Exercise.service';

export const LessonService = {
    /**
     * Fetches theory content for a specific lesson.
     */
    getTheory: async (lessonId: string) => {
        const lesson: any = await lessonRepository.getLessonById(lessonId);
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
        await userProgressRepository.saveUserProgress(lessonId, score);
    },

    /**
     * Marks a lesson as completed without giving rewards.
     */
    markAsCompletedManually: async (lessonId: string) => {
        await userProgressRepository.saveUserProgress(lessonId, 100, false);
    },

    /**
     * Fetches the full lesson object.
     */
    getLesson: async (lessonId: string) => {
        return await lessonRepository.getLessonById(lessonId);
    }
};
