import { useState, useEffect } from 'react';
import { Exercise, ExerciseType } from '../types/exercise';

/**
 * Hook to manage the state and logic of a set of exercises.
 * 
 * @param initialExercises - The array of exercises to present.
 * @returns Object containing current exercise, state flags, and control methods.
 */
export const useExercises = (initialExercises: Exercise[]) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
    const [isFinished, setIsFinished] = useState(false);
    const [lastResult, setLastResult] = useState<{ correct: boolean; message?: string } | null>(null);
    const [completedCount, setCompletedCount] = useState(0);

    // Sync local state with prop updates (e.g. when async fetch completes)
    useEffect(() => {
        setExercises(initialExercises);
        setCurrentIndex(0);
        setIsFinished(false);
        setLastResult(null);
        setCompletedCount(0);
    }, [initialExercises]);

    const currentExercise = exercises[currentIndex];

    /**
     * Validates the user's answer for the current exercise.
     * @param userAnswer - The string input from the user.
     */
    const checkAnswer = (userAnswer: string) => {
        if (!currentExercise) return;

        let isCorrect = false;

        // Pronunciation exercises are always considered correct to avoid blocking
        if (currentExercise.type === ExerciseType.PRONUNCIATION) {
            isCorrect = true;
        } else {
            // Simple case-insensitive check for now
            isCorrect = userAnswer.trim().toLowerCase() === currentExercise.correctAnswer.trim().toLowerCase();
        }

        if (isCorrect) {
            setCompletedCount(prev => prev + 1);
        } else {
            // Si te equivocas, el ejercicio se añade al final de la cola para repetirlo
            setExercises(prev => [...prev, currentExercise]);
        }

        setLastResult({
            correct: isCorrect,
            message: isCorrect ? 'Correct!' : `Incorrect. The answer was: ${currentExercise.correctAnswer}`,
        });

        return isCorrect;
    };

    /**
     * Advances to the next exercise or marks the session as finished.
     */
    const nextExercise = () => {
        setLastResult(null);
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    return {
        currentExercise,
        currentIndex,
        totalExercises: exercises.length, // List length might grow
        initialTotal: initialExercises.length, // Fixed initial length for progress bar
        completedCount, // Actual progress
        isFinished,
        checkAnswer,
        nextExercise,
        lastResult,
    };
};
