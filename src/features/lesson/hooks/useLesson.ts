import { useState, useEffect } from 'react';
import { Lesson, Exercise } from '../types';

// Mock data (Normally this would come from `../services/lessonService`)
const MOCK_LESSON: Lesson = {
    id: '1',
    title: 'Basic Sentence Structure',
    exercises: [
        {
            id: '1',
            type: 'writing',
            prompt: 'Translate: The cat is on the table',
            correctAnswer: 'The cat is on the table',
        },
    ],
};

export const useLesson = (lessonId: string) => {
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setLesson(MOCK_LESSON);
            setLoading(false);
        }, 1000);
    }, [lessonId]);

    const checkAnswer = () => {
        if (!lesson) return;
        const currentExercise = lesson.exercises[currentIndex];

        // Logic simple for demo
        const isCorrect = userAnswer.trim().toLowerCase() === currentExercise.correctAnswer.toLowerCase();

        setFeedback(isCorrect ? 'success' : 'error');

        if (isCorrect) {
            // Move to next or finish after delay
            // setTimeout(() => should move index, 1000)
        }
    };

    return {
        lesson,
        loading,
        currentExercise: lesson?.exercises[currentIndex],
        userAnswer,
        setUserAnswer,
        checkAnswer,
        feedback,
    };
};
