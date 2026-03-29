import { useState, useEffect, useCallback } from 'react';
import { Exercise, ExerciseType } from '../types/exercise';
import { TextValidationService } from '../services/TextValidation.service';
import { userProgressRepository } from '../../../db_local/repositories';

/** Represents a missed exercise for the end-screen review. */
export interface MissedExercise {
    question: string;
    correctAnswer: string;
    userAnswer: string;
}

interface UseExercisesOptions {
    initialLives?: number;
    comboForLife?: number;
}

/**
 * Hook to manage the state and logic of a set of exercises.
 * 
 * @param initialExercises - The array of exercises to present.
 * @param isExam - Whether this session is an exam (prevents repeating wrong answers).
 * @param options - Optional config for lives & combo thresholds.
 * @returns Object containing current exercise, state flags, and control methods.
 */
export const useExercises = (
    initialExercises: Exercise[],
    isExam: boolean = false,
    options?: UseExercisesOptions,
) => {
    const maxLives = options?.initialLives ?? 7;
    const comboForLife = options?.comboForLife ?? 2;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
    const [isFinished, setIsFinished] = useState(false);
    const [lastResult, setLastResult] = useState<{ correct: boolean; message?: string } | null>(null);
    const [completedCount, setCompletedCount] = useState(0);

    // ── Game mechanics ──────────────────────────────────────────────────────
    const [lives, setLives] = useState(maxLives);
    const [isGameOver, setIsGameOver] = useState(false);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [missedExercises, setMissedExercises] = useState<MissedExercise[]>([]);

    // Sync local state with prop updates (e.g. when async fetch completes)
    useEffect(() => {
        setExercises(initialExercises);
        setCurrentIndex(0);
        setIsFinished(false);
        setLastResult(null);
        setCompletedCount(0);
        setLives(maxLives);
        setIsGameOver(false);
        setCombo(0);
        setMaxCombo(0);
        setMissedExercises([]);
    }, [initialExercises]);

    /**
     * Validates the user's answer for the current exercise.
     * @param userAnswer - The string input from the user.
     */
    const checkAnswer = useCallback((userAnswer: string) => {
        if (!exercises[currentIndex] || isGameOver) return;
        const currentExercise = exercises[currentIndex];

        let isCorrect = false;
        const isPronunciation = currentExercise.type === ExerciseType.PRONUNCIATION;
        const isListening = (currentExercise.type === ExerciseType.LISTENING) && userAnswer === "";
        // Pronunciation exercises are always considered correct to avoid blocking
        if (isPronunciation || isListening) {
            isCorrect = true;
        } else {
            isCorrect = TextValidationService.normalizeAnswer(userAnswer) === TextValidationService.normalizeAnswer(currentExercise.correctAnswer);
        }

        if (isCorrect) {
            setCompletedCount(prev => prev + 1);

            // ── Combo logic ──
            setCombo(prev => {
                const newCombo = prev + 1;
                setMaxCombo(mc => Math.max(mc, newCombo));
                // Grant a life at comboForLife threshold (only at exact multiples)
                if (newCombo > 0 && newCombo % comboForLife === 0) {
                    setLives(l => Math.min(l + 1, maxLives));
                }
                return newCombo;
            });

            if (currentExercise.unlocksLessonId) {
                userProgressRepository.saveUserProgress(currentExercise.unlocksLessonId, 100).catch((err: any) => console.error('[useExercises] Error unlocking lesson:', err));
            }
        } else {
            // Reset combo on mistake
            setCombo(0);

            // Track missed exercise
            const correctAnswerText = currentExercise.type !== ExerciseType.PRONUNCIATION ? currentExercise.correctAnswer : '';
            setMissedExercises(prev => {
                // Avoid duplicate entries for the same question
                if (prev.some(m => m.question === currentExercise.question)) return prev;
                return [...prev, {
                    question: currentExercise.question,
                    correctAnswer: correctAnswerText,
                    userAnswer,
                }];
            });

            // Lose a life
            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setIsGameOver(true);
                }
                return Math.max(newLives, 0);
            });

            // Re-add to the end for retry (unless exam mode or game over)
            if (!isExam) {
                setExercises(prev => [...prev, currentExercise]);
            }
        }

        const correctAnswerText = currentExercise.type !== ExerciseType.PRONUNCIATION ? currentExercise.correctAnswer : '';

        setLastResult({
            correct: isCorrect,
            message: isCorrect ? 'Correct!' : `Incorrect. The answer was: ${correctAnswerText}`,
        });

        return isCorrect;
    }, [exercises, currentIndex, isGameOver, isExam, comboForLife, maxLives]);

    /**
     * Advances to the next exercise or marks the session as finished.
     */
    const nextExercise = useCallback(() => {
        if (isGameOver) return;
        setLastResult(null);
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    }, [currentIndex, exercises.length, isGameOver]);

    /**
     * Allows an external validator (like AI) to override the result of the current exercise.
     * If the override is 'correct', we undo the penalty (remove duplication) and update stats.
     */
    const overrideResult = useCallback((isCorrect: boolean) => {
        if (!exercises[currentIndex]) return;
        const currentExercise = exercises[currentIndex];

        if (isCorrect) {
            // Remove duplicate added at the end
            setExercises(prev => {
                const newExercises = [...prev];
                if (newExercises.length > initialExercises.length && newExercises[newExercises.length - 1].id === currentExercise.id) {
                    newExercises.pop();
                }
                return newExercises;
            });

            setCompletedCount(prev => prev + 1);

            // Restore the lost life
            setLives(prev => Math.min(prev + 1, maxLives));

            // Remove from missed exercises
            setMissedExercises(prev => prev.filter(m => m.question !== currentExercise.question));

            // Restore combo (set to 1 since AI confirmed it correct)
            setCombo(1);

            // If game was over due to this mistake, undo it
            setIsGameOver(false);

            setLastResult({
                correct: true,
                message: '¡Corregido por la IA!',
            });
        }
    }, [exercises, currentIndex, initialExercises.length, maxLives]);

    /**
     * Adds new exercises to the current list.
     * Useful for infinite scrolling / continuous learning.
     */
    const addExercises = useCallback((newExercises: Exercise[]) => {
        setExercises(prev => [...prev, ...newExercises]);
    }, []);

    return {
        currentExercise: exercises[currentIndex],
        currentIndex,
        totalExercises: exercises.length,
        initialTotal: initialExercises.length,
        completedCount,
        isFinished,
        isGameOver,
        checkAnswer,
        nextExercise,
        lastResult,
        overrideResult,
        addExercises,
        exercises,
        // ── Game state ──
        lives,
        maxLives,
        combo,
        maxCombo,
        missedExercises,
    };
};
