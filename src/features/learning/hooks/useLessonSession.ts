import { useState, useCallback, useEffect } from 'react';
import { LessonService } from '../services/LessonService';
import { Exercise } from '../types/exercise';

export type LessonStatus = 'loading' | 'theory' | 'exercises' | 'completed';

export const useLessonSession = (lessonId: string) => {
    const [status, setStatus] = useState<LessonStatus>('loading');
    const [theoryContent, setTheoryContent] = useState<string>('');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [lesson, setLesson] = useState<any>(null);

    useEffect(() => {
        const loadLessonData = async () => {
            try {
                setStatus('loading');
                const [theory, exList, lessonData] = await Promise.all([
                    LessonService.getTheory(lessonId),
                    LessonService.getExercises(lessonId),
                    LessonService.getLesson(lessonId)
                ]);

                setTheoryContent(theory);
                setExercises(exList);
                setLesson(lessonData);

                if (theory && theory.length > 0) {
                    setStatus('theory');
                } else if (exList.length > 0) {
                    setStatus('exercises');
                } else {
                    setStatus('completed'); // Empty lesson?
                }

            } catch (error) {
                console.error('Failed to load lesson data', error);
                // Handle error state if needed
            }
        };

        if (lessonId) {
            loadLessonData();
        }
    }, [lessonId]);

    const startExercises = useCallback(() => {
        setStatus('exercises');
    }, []);

    const completeLesson = useCallback(async () => {
        setStatus('completed');
        try {
            // Assuming perfect score for now as we don't track detailed scoring yet
            await LessonService.completeLesson(lessonId, 100);
        } catch (error) {
            console.error('Failed to complete lesson:', error);
        }
    }, [lessonId]);

    return {
        status,
        theoryContent,
        exercises,
        startExercises,
        completeLesson,
        lesson
    };
};
