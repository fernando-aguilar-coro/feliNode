import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TranslateExercise as TranslateExerciseType } from '../../types/exercise';
import { AppText, AppTextInput } from '../../../../components';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { TtsService } from '../../services/Tts.service';
import { franc } from 'franc';

interface Props {
    exercise: TranslateExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

export const TranslateExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    const theme = useAppTheme();

    useEffect(() => {
        const language = franc(exercise.phrase);
        let lang = 'en-US';
        if (language === 'spa' || language === 'ita') {
            lang = 'es-ES';
        }
        TtsService.speak(exercise.phrase, { language: lang });
    }, []);

    const styles = useMemo(() => StyleSheet.create({
        question: {
            marginBottom: theme.spacing.lg,
            color: theme.colors.text,
        },
        phraseContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
        },
        phrase: {
            fontStyle: 'italic',
            color: theme.colors.textSecondary,
            flex: 1,
        },
        input: {
            height: 100,
            textAlignVertical: 'top',
            paddingTop: theme.spacing.sm, // Add some top padding for multiline
        },
    }), [theme]);

    return (
        <View>
            <AppText variant="lg" weight="medium" style={styles.question}>
                {exercise.question}
            </AppText>
            <TouchableOpacity onPress={() => TtsService.speak(exercise.phrase)} style={styles.phraseContainer}>
                <MaterialCommunityIcons name="volume-high" size={24} color={theme.colors.primary} style={{ marginRight: 8 }} />
                <AppText variant="md" style={styles.phrase}>
                    {exercise.phrase}
                </AppText>
            </TouchableOpacity>
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
