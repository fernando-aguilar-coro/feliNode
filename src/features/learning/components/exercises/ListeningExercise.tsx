import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ListeningExercise as ListeningExerciseType } from '../../types/exercise';
import { AppText } from '../../../../components';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { TtsService } from '../../services/Tts.service';
import { ReactNativeTts } from '../../helpers/tts/reactNativeTTS';
import { WordBank } from '../../helpers/drag-native/WordBank';
import { AnswerArea } from '../../helpers/drag-native/AnswerArea';

interface Props {
    exercise: ListeningExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

export const ListeningExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    const theme = useAppTheme();
    const { t } = useTranslation();
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

    useEffect(() => {
        // Reproducir el audio al montar el componente
        TtsService.speak(exercise.phrase);
    }, [exercise.phrase]);

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
        TtsService.speak(exercise.segments[index]);
    };

    const handleRemove = (listIndex: number) => {
        const word = exercise.segments[selectedIndices[listIndex]];
        const newIndices = [...selectedIndices];
        newIndices.splice(listIndex, 1);
        setSelectedIndices(newIndices);
        TtsService.speak(word);
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
        contentContainer: {
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.xl,
        },
        question: {
            marginBottom: theme.spacing.xl,
            color: theme.colors.text,
            textAlign: 'center',
        },
        controlsContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: theme.spacing.xl,
            gap: 40,
        },
        controlItem: {
            alignItems: 'center',
            gap: theme.spacing.xs,
        },
        playButton: {
            backgroundColor: theme.colors.primary,
            width: 64,
            height: 64,
            borderRadius: 32,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        },
        slowButton: {
            backgroundColor: theme.colors.secondary,
            width: 48,
            height: 48,
            borderRadius: 24,
        },
        buttonLabel: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        instruction: {
            marginBottom: theme.spacing.sm,
            color: theme.colors.textSecondary,
        },
        divider: { height: 10 },
    }), [theme]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <AppText variant="xl" weight="bold" style={styles.question}>
                    {exercise.question}
                </AppText>

                <View style={styles.controlsContainer}>
                    <View style={styles.controlItem}>
                        <TouchableOpacity
                            onPress={() => TtsService.speak(exercise.phrase)}
                            style={styles.playButton}
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons name="volume-high" size={32} color="white" />
                        </TouchableOpacity>
                        <AppText style={styles.buttonLabel}>{t('learning.exercises.listening.normal')}</AppText>
                    </View>

                    <View style={styles.controlItem}>
                        <TouchableOpacity
                            onPress={() => TtsService.speak(exercise.phrase, { rate: 0.4 })}
                            style={[styles.playButton, styles.slowButton]}
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons name="tortoise" size={24} color="white" />
                        </TouchableOpacity>
                        <AppText style={styles.buttonLabel}>{t('learning.exercises.listening.slow')}</AppText>
                    </View>

                    <View style={styles.controlItem}>
                        <TouchableOpacity
                            onPress={() => ReactNativeTts.speak(exercise.phrase, 'en-US', 0.1)}
                            style={[styles.playButton, styles.slowButton, { backgroundColor: '#795548' }]}
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons name="bug" size={24} color="white" />
                        </TouchableOpacity>
                        <AppText style={styles.buttonLabel}>{t('learning.exercises.listening.ultraSlow')}</AppText>
                    </View>
                </View>

                <AppText variant="md" weight="medium" style={styles.instruction}>
                    {t('learning.exercises.listening.instruction')}
                </AppText>

                <AnswerArea
                    selectedWords={selectedWords}
                    onRemove={handleRemove}
                    onReorder={handleReorder}
                    theme={theme}
                />

                <View style={styles.divider} />

                <WordBank
                    words={exercise.segments || []}
                    selectedIndices={selectedIndices}
                    onSelect={handleSelect}
                    theme={theme}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
