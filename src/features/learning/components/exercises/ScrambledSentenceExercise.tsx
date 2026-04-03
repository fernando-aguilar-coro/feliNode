
import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Platform, UIManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScrambledSentenceExercise as ScrambledSentenceExerciseType } from '../../types/exercise';
import { AppText, TranslateButton } from '../../../../components';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { TtsService } from '../../services/Tts.service';
import { WordBank } from '../../helpers/drag-native/WordBank';
import { AnswerArea } from '../../helpers/drag-native/AnswerArea';

interface Props {
    exercise: ScrambledSentenceExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

export const ScrambledSentenceExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    const theme = useAppTheme();
    const { t } = useTranslation();
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

    useEffect(() => {
        // Reset when exercise changes
        setSelectedIndices([]);
    }, [exercise]);

    useEffect(() => {
        // Sync back to parent
        const answer = selectedIndices.map(i => exercise.segments[i]).join(' ');
        if (answer !== userAnswer) {
            onAnswer(answer);
        }
    }, [selectedIndices, exercise.segments, onAnswer, userAnswer]);

    const handleSelect = (index: number) => {
        setSelectedIndices(current => [...current, index]);
        TtsService.speak(exercise.segments[index], { forceNative: true });
    };

    const handleRemove = (listIndex: number) => {
        const word = exercise.segments[selectedIndices[listIndex]];
        const newIndices = [...selectedIndices];
        newIndices.splice(listIndex, 1);
        setSelectedIndices(newIndices);
        TtsService.speak(word, { forceNative: true });
    };

    const handleReorder = (fromIndex: number, toIndex: number) => {
        const newIndices = [...selectedIndices];
        const [movedItem] = newIndices.splice(fromIndex, 1);
        newIndices.splice(toIndex, 0, movedItem);
        setSelectedIndices(newIndices);
    };

    const selectedWords = useMemo(() =>
        selectedIndices.map(i => exercise.segments[i]),
        [selectedIndices, exercise.segments]);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
        },
        question: {
            marginBottom: theme.spacing.sm,
            color: theme.colors.text,
        },
        instruction: {
            marginBottom: theme.spacing.lg,
            color: theme.colors.textSecondary,
        },
        divider: { height: 10 },
    }), [theme]);

    return (
        <View style={styles.container}>
            <AppText variant="lg" weight="medium" style={styles.question}>
                {exercise.question}
            </AppText>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.md }}>
                <AppText variant="sm" style={[styles.instruction, { marginBottom: 0 }]}>
                    {t('learning.exercises.scrambled')}
                </AppText>
                {userAnswer.trim().length > 0 && (
                    <TranslateButton textToTranslate={userAnswer.trim()} size={20} />
                )}
            </View>

            <AnswerArea
                selectedWords={selectedWords}
                onRemove={handleRemove}
                onReorder={handleReorder}
                theme={theme}
            />

            <View style={styles.divider} />

            <WordBank
                words={exercise.segments}
                selectedIndices={selectedIndices}
                onSelect={handleSelect}
                theme={theme}
            />
        </View>
    );
};
