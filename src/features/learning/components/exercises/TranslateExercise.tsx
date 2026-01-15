import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TranslateExercise as TranslateExerciseType } from '../../types/exercise';
import { AppText, AppTextInput } from '../../../../components';
import { theme } from '../../../../theme';

interface Props {
    exercise: TranslateExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

export const TranslateExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    return (
        <View>
            <AppText variant="lg" weight="medium" style={styles.question}>
                {exercise.question}
            </AppText>
            <AppText variant="md" style={styles.phrase}>
                {exercise.phrase}
            </AppText>
            <AppTextInput
                value={userAnswer}
                onChangeText={onAnswer}
                /* Sugerencia para la traducción */
                placeholder="Traduce esta frase..."
                multiline
                style={styles.input}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    question: {
        marginBottom: theme.spacing.lg,
    },
    phrase: {
        marginBottom: theme.spacing.md,
        fontStyle: 'italic',
        color: theme.colors.textSecondary,
    },
    input: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: theme.spacing.sm, // Add some top padding for multiline
    },
});
