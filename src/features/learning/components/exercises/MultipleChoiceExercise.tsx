import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MultipleChoiceExercise as MultipleChoiceExerciseType } from '../../types/exercise';
import { AppText } from '../../../../components';
import { theme } from '../../../../theme';

interface Props {
    exercise: MultipleChoiceExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string | null;
}

export const MultipleChoiceExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    return (
        <View>
            <AppText variant="lg" weight="medium" style={styles.question}>
                {exercise.question}
            </AppText>
            {exercise.options.map((option) => {
                const isSelected = userAnswer === option;
                return (
                    <TouchableOpacity
                        key={option}
                        onPress={() => onAnswer(option)}
                        style={[
                            styles.option,
                            isSelected && styles.optionSelected,
                        ]}
                    >
                        <AppText
                            color={isSelected ? theme.colors.primary : theme.colors.text}
                            weight={isSelected ? 'bold' : 'regular'}
                        >
                            {option}
                        </AppText>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    question: {
        marginBottom: theme.spacing.lg,
    },
    option: {
        padding: theme.spacing.md,
        marginVertical: theme.spacing.xs,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 12,
    },
    optionSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10', // 10% opacity
    },
});
