import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Exercise, ExerciseType } from '../../types/exercise';
import { MultipleChoiceExercise } from './MultipleChoiceExercise';
import { FillInTheBlankExercise } from './FillInTheBlankExercise';
import { TranslateExercise } from './TranslateExercise';
import { ScrambledSentenceExercise } from './ScrambledSentenceExercise';
import { PronunciationExercise } from './PronunciationExercise';
import { ListeningExercise } from './ListeningExercise';
import { Card, AppButton, AppText, Spacer } from '../../../../components';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { AiExplainButton } from '../AiExplainButton';

interface Props {
    exercise: Exercise;
    onCheck: (answer: string) => boolean | undefined;
    onNext: () => void;
    lastResult: { correct: boolean; message?: string } | null;
    lessonContext?: string;
    onOverrideResult?: (isCorrect: boolean) => void;
}

export const ExerciseContainer = ({ exercise, onCheck, onNext, lastResult, lessonContext, onOverrideResult }: Props) => {
    const theme = useAppTheme();
    const [userAnswer, setUserAnswer] = useState('');
    const [hasChecked, setHasChecked] = useState(false);
    const [aiResult, setAiResult] = useState<{ correct: boolean; message: string } | null>(null);

    const displayResult = aiResult || lastResult;

    // Reset state when exercise changes
    useEffect(() => {
        if (exercise.type === ExerciseType.PRONUNCIATION) {
            setUserAnswer('READY');
        } else {
            setUserAnswer('');
        }
        setHasChecked(false);
        setAiResult(null);
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
            case ExerciseType.LISTENING:
                return (
                    <ListeningExercise
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

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollContent: {
            padding: theme.spacing.md,
            flexGrow: 1,
        },
        card: {
            minHeight: 200,
            justifyContent: 'center',
            backgroundColor: theme.colors.surface,
        },
        feedback: {
            padding: theme.spacing.md,
            borderRadius: 12,
            marginBottom: theme.spacing.md,
        },
    }), [theme]);

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
            <Card style={styles.card}>
                {renderContent()}
            </Card>

            <Spacer height={theme.spacing.lg} />

            {displayResult && hasChecked && (
                <View
                    style={[
                        styles.feedback,
                        {
                            backgroundColor: displayResult.correct
                                ? theme.colors.success + '20' // 20% opacity
                                : theme.colors.error + '20',
                        },
                    ]}
                >
                    <AppText
                        weight="bold"
                        color={displayResult.correct ? theme.colors.success : theme.colors.error}
                    >
                        {displayResult.message}
                    </AppText>

                    <Spacer height={theme.spacing.sm} />

                    {(exercise.type !== ExerciseType.PRONUNCIATION && exercise.type !== ExerciseType.LISTENING) && (
                        <AiExplainButton
                            userAnswer={userAnswer}
                            question={exercise.question}
                            correctAnswer={exercise.correctAnswer}
                            lessonContext={lessonContext}
                            onAiResult={(result) => {
                                setAiResult(result);
                                if (result.correct && onOverrideResult) {
                                    onOverrideResult(true);
                                }
                            }}
                        />
                    )}
                </View>
            )}

            <Spacer height={theme.spacing.md} />

            {!hasChecked ? (
                /* Botón para comprobar la respuesta */
                <AppButton
                    title={
                        exercise.type === ExerciseType.PRONUNCIATION ? "Saltar" :
                            (exercise.type === ExerciseType.LISTENING && !userAnswer) ? "Saltar" :
                                "Comprobar Respuesta"
                    }
                    onPress={handleCheck}
                    disabled={
                        // Disable if no answer, EXCEPT for Pronunciation (always enabled) OR Listening (enabled for skip)
                        !userAnswer &&
                        exercise.type !== ExerciseType.PRONUNCIATION &&
                        exercise.type !== ExerciseType.LISTENING
                    }
                    variant={
                        exercise.type === ExerciseType.PRONUNCIATION ? "outline" :
                            (exercise.type === ExerciseType.LISTENING && !userAnswer) ? "outline" :
                                "primary"
                    }
                />
            ) : (
                /* Botón para pasar al siguiente ejercicio */
                <AppButton
                    title="Siguiente"
                    onPress={onNext}
                    variant="secondary"
                />
            )}
            <Spacer height={theme.spacing.xl} />
        </ScrollView>
    );
};
