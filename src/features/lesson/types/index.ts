export type ExerciseType = 'writing' | 'multiple-choice';

export interface Exercise {
    id: string;
    type: ExerciseType;
    prompt: string; // The question (e.g., "Translate: The cat")
    correctAnswer: string;
}

export interface Lesson {
    id: string;
    title: string;
    exercises: Exercise[];
}

export interface LessonState {
    currentExerciseIndex: number;
    answers: Record<string, string>; // exerciseId -> userAnswer
    isComplete: boolean;
}
