import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { Exercise, ExerciseType } from '../../types/exercise';
import { MultipleChoiceExercise } from './MultipleChoiceExercise';
import { FillInTheBlankExercise } from './FillInTheBlankExercise';
import { TranslateExercise } from './TranslateExercise';

interface Props {
    exercise: Exercise;
    onCheck: (answer: string) => boolean;
    onNext: () => void;
    lastResult: { correct: boolean; message?: string } | null;
}

export const ExerciseContainer = ({ exercise, onCheck, onNext, lastResult }: Props) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [hasChecked, setHasChecked] = useState(false);

    // Reset state when exercise changes
    useEffect(() => {
        setUserAnswer('');
        setHasChecked(false);
    }, [exercise]);

    const handleCheck = () => {
        onCheck(userAnswer);
        setHasChecked(true);
    };

    const renderContent = () => {
        switch (exercise.type) {
            case ExerciseType.MULTIPLE_CHOICE:
                return (
                    <MultipleChoiceExercise
                        exercise={exercise}
                        onAnswer={setUserAnswer}
                        userAnswer={userAnswer}
                    />
                );
            case ExerciseType.FILL_IN_THE_BLANK:
                return (
                    <FillInTheBlankExercise
                        exercise={exercise}
                        onAnswer={setUserAnswer}
                        userAnswer={userAnswer}
                    />
                );
            case ExerciseType.TRANSLATE:
                return (
                    <TranslateExercise
                        exercise={exercise}
                        onAnswer={setUserAnswer}
                        userAnswer={userAnswer}
                    />
                );
            default:
                return <Text>Unknown exercise type</Text>;
        }
    };

    return (
        <View style={{ padding: 20 }}>
            {renderContent()}

            {lastResult && hasChecked && (
                <View style={{ marginVertical: 20, padding: 10, backgroundColor: lastResult.correct ? '#d4edda' : '#f8d7da' }}>
                    <Text style={{ color: lastResult.correct ? '#155724' : '#721c24' }}>{lastResult.message}</Text>
                </View>
            )}

            {!hasChecked ? (
                <Button title="Check Answer" onPress={handleCheck} disabled={!userAnswer} />
            ) : (
                <Button title="Next" onPress={onNext} />
            )}
        </View>
    );
};
