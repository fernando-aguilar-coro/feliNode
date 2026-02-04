import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FillInTheBlankExercise as FillInTheBlankExerciseType } from '../../types/exercise';
import { AppText, AppTextInput } from '../../../../components';
import { theme } from '../../../../theme';
import { TtsService } from '../../services/Tts.service';

interface Props {
    exercise: FillInTheBlankExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

export const FillInTheBlankExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    useEffect(() => {
        TtsService.speak(exercise.sentence);
    }, []);

    return (
        <View>
            <AppText variant="lg" weight="medium" style={styles.question}>
                {exercise.question}
            </AppText>
            <TouchableOpacity onPress={() => TtsService.speak(exercise.sentence)} style={styles.sentenceContainer}>
                <MaterialCommunityIcons name="volume-high" size={24} color={theme.colors.primary} style={{ marginRight: 8 }} />
                <AppText variant="md" style={styles.sentence}>
                    {exercise.sentence}
                </AppText>
            </TouchableOpacity>
            <AppTextInput
                value={userAnswer}
                onChangeText={onAnswer}
                /* Sugerencia para el campo de entrada */
                placeholder="Escribe la palabra que falta..."
                autoCapitalize="none"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    question: {
        marginBottom: theme.spacing.lg,
    },
    sentenceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sentence: {
        fontStyle: 'italic',
        color: theme.colors.textSecondary,
        flex: 1,
    },
});
