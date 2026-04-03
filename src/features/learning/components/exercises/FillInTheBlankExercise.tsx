import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { FillInTheBlankExercise as FillInTheBlankExerciseType } from '../../types/exercise';
import { AppText, AppTextInput, TranslateButton } from '../../../../components';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { TtsService } from '../../services/Tts.service';

interface Props {
    exercise: FillInTheBlankExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

export const FillInTheBlankExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    const theme = useAppTheme();
    const { t } = useTranslation();

    useEffect(() => {
        TtsService.speak(exercise.sentence);
    }, []);

    const styles = useMemo(() => StyleSheet.create({
        question: {
            marginBottom: theme.spacing.lg,
            color: theme.colors.text,
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
    }), [theme]);

    return (
        <View>
            <AppText variant="lg" weight="medium" style={styles.question}>
                {exercise.question}
            </AppText>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md }}>
                <TouchableOpacity 
                    onPress={() => TtsService.speak(exercise.sentence)} 
                    style={[styles.sentenceContainer, { flex: 1, marginBottom: 0 }]}
                >
                    <MaterialCommunityIcons name="volume-high" size={24} color={theme.colors.primary} style={{ marginRight: 8 }} />
                    <AppText variant="md" style={styles.sentence}>
                        {exercise.sentence}
                    </AppText>
                </TouchableOpacity>
                <TranslateButton textToTranslate={exercise.sentence} />
            </View>

            <AppTextInput
                value={userAnswer}
                onChangeText={onAnswer}
                placeholder={t('learning.exercises.fillBlank')}
                autoCapitalize="none"
            />
        </View>
    );
};
