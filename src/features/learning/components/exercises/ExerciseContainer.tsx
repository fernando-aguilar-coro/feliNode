import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Exercise, ExerciseType } from '../../types/exercise';
import { MultipleChoiceExercise } from './MultipleChoiceExercise';
import { FillInTheBlankExercise } from './FillInTheBlankExercise';
import { TranslateExercise } from './TranslateExercise';
import { ScrambledSentenceExercise } from './ScrambledSentenceExercise';
import { PronunciationExercise } from './PronunciationExercise';
import { Card, AppButton, AppText, Spacer } from '../../../../components';
import { theme } from '../../../../theme';

interface Props {
    exercise: Exercise;
    onCheck: (answer: string) => boolean | undefined;
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
            case ExerciseType.SCRAMBLED_SENTENCE:
                return (
                    <ScrambledSentenceExercise
                        exercise={exercise}
                        onAnswer={setUserAnswer}
                        userAnswer={userAnswer}
                    />
                );
            case ExerciseType.PRONUNCIATION:
                return (
                    <PronunciationExercise
                        exercise={exercise}
                        onAnswer={setUserAnswer}
                        userAnswer={userAnswer}
                    />
                );
            default:
                /* Tipo de ejercicio desconocido o no implementado */
                return <AppText>Tipo de ejercicio desconocido</AppText>;
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                {renderContent()}
            </Card>

            <Spacer height={theme.spacing.lg} />

            {lastResult && hasChecked && (
                <View
                    style={[
                        styles.feedback,
                        {
                            backgroundColor: lastResult.correct
                                ? theme.colors.success + '20' // 20% opacity
                                : theme.colors.error + '20',
                        },
                    ]}
                >
                    <AppText
                        weight="bold"
                        color={lastResult.correct ? theme.colors.success : theme.colors.error}
                    >
                        {lastResult.message}
                    </AppText>
                </View>
            )}

            <Spacer height={theme.spacing.md} />

            {!hasChecked ? (
                /* Botón para comprobar la respuesta */
                <AppButton
                    title="Comprobar Respuesta"
                    onPress={handleCheck}
                    disabled={!userAnswer}
                    variant="primary"
                />
            ) : (
                /* Botón para pasar al siguiente ejercicio */
                <AppButton
                    title="Siguiente"
                    onPress={onNext}
                    variant="secondary"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: theme.spacing.md,
    },
    card: {
        minHeight: 200,
        justifyContent: 'center',
    },
    feedback: {
        padding: theme.spacing.md,
        borderRadius: 12,
        marginBottom: theme.spacing.md,
    },
});
