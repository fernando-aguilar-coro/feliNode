import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FillInTheBlankExercise as FillInTheBlankExerciseType } from '../../types/exercise';
import { AppText, AppTextInput } from '../../../../components';
import { theme } from '../../../../theme';

interface Props {
    exercise: FillInTheBlankExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

export const FillInTheBlankExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    return (
        <View>
            <AppText variant="lg" weight="medium" style={styles.question}>
                {exercise.question}
            </AppText>
            <AppText variant="md" style={styles.sentence}>
                {exercise.sentence}
            </AppText>
            <AppTextInput
                value={userAnswer}
                onChangeText={onAnswer}
                placeholder="Type the missing word..."
                autoCapitalize="none"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    question: {
        marginBottom: theme.spacing.lg,
    },
    sentence: {
        marginBottom: theme.spacing.md,
        fontStyle: 'italic',
        color: theme.colors.textSecondary,
    },
});
