import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MultipleChoiceExercise as MultipleChoiceExerciseType } from '../../types/exercise';
import { AppText } from '../../../../components';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { TtsService } from '../../services/Tts.service';

interface Props {
    exercise: MultipleChoiceExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string | null;
}

export const MultipleChoiceExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    const theme = useAppTheme();

    const styles = useMemo(() => StyleSheet.create({
        question: {
            marginBottom: theme.spacing.lg,
            color: theme.colors.text,
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
        optionContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        icon: {
            marginRight: theme.spacing.md,
        },
    }), [theme]);

    return (
        <View>
            <AppText variant="lg" weight="medium" style={styles.question}>
                {exercise.question}
            </AppText>
            {/* Mapeo de las opciones disponibles para el ejercicio */}
            {exercise.options.map((option) => {
                const isSelected = userAnswer === option.text;
                return (
                    <TouchableOpacity
                        key={option.text}
                        onPress={() => {
                            onAnswer(option.text);
                            TtsService.speak(option.text);
                        }}
                        style={[
                            styles.option,
                            isSelected && styles.optionSelected,
                        ]}
                    >
                        <View style={styles.optionContent}>
                            {option.icon && (
                                <Ionicons
                                    name={option.icon as any} // Cast to any to avoid strict icon name checks for now
                                    size={24}
                                    color={isSelected ? theme.colors.primary : theme.colors.text}
                                    style={styles.icon}
                                />
                            )}
                            <AppText
                                color={isSelected ? theme.colors.primary : theme.colors.text}
                                weight={isSelected ? 'bold' : 'regular'}
                            >
                                {option.text}
                            </AppText>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
