import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrambledSentenceExercise as ScrambledSentenceExerciseType } from '../../types/exercise';
import { AppText } from '../../../../components';
import { theme } from '../../../../theme';

interface Props {
    exercise: ScrambledSentenceExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

export const ScrambledSentenceExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

    useEffect(() => {
        // Reset when exercise changes
        setSelectedIndices([]);
    }, [exercise]);

    useEffect(() => {
        // Sync back to parent
        // Construct the answer from the order of selected indices
        const answer = selectedIndices.map(i => exercise.segments[i]).join(' ');
        if (answer !== userAnswer) {
            onAnswer(answer);
        }
    }, [selectedIndices, exercise.segments, onAnswer, userAnswer]);

    const handleSelect = (index: number) => {
        setSelectedIndices([...selectedIndices, index]);
    };

    const handleRemove = (listIndex: number) => {
        const newIndices = [...selectedIndices];
        newIndices.splice(listIndex, 1);
        setSelectedIndices(newIndices);
    };

    return (
        <View style={styles.container}>
            <AppText variant="lg" weight="medium" style={styles.question}>
                {exercise.question}
            </AppText>
            <AppText variant="sm" color={theme.colors.textSecondary} style={styles.instruction}>
                Tap the words to form the correct sentence:
            </AppText>

            {/* Answer Area */}
            <View style={styles.answerArea}>
                {selectedIndices.length === 0 && (
                    <AppText style={styles.placeholder}>Your answer here...</AppText>
                )}
                {selectedIndices.map((segmentIndex, listIndex) => (
                    <TouchableOpacity
                        key={`selected-${listIndex}`}
                        onPress={() => handleRemove(listIndex)}
                        style={styles.wordBubbleSelected}
                    >
                        <AppText style={styles.wordText} color={theme.colors.primaryDark}>
                            {exercise.segments[segmentIndex]}
                        </AppText>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.divider} />

            {/* Word Bank */}
            <View style={styles.wordBank}>
                {exercise.segments.map((word, index) => {
                    const isSelected = selectedIndices.includes(index);

                    if (isSelected) {
                        // Render a ghost of it.
                        return (
                            <View key={`pool-${index}`} style={[styles.wordBubble, styles.wordBubbleGhost]}>
                                <AppText style={styles.wordTextGhost}>{word}</AppText>
                            </View>
                        );
                    }

                    return (
                        <TouchableOpacity
                            key={`pool-${index}`}
                            onPress={() => handleSelect(index)}
                            style={styles.wordBubble}
                        >
                            <AppText style={styles.wordText}>{word}</AppText>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    question: {
        marginBottom: theme.spacing.sm,
    },
    instruction: {
        marginBottom: theme.spacing.lg,
    },
    answerArea: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        minHeight: 80,
        backgroundColor: theme.colors.background,
        borderRadius: 12,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderStyle: 'dashed'
    },
    placeholder: {
        color: theme.colors.textLight,
        fontStyle: 'italic',
        width: '100%',
        textAlign: 'center',
    },
    divider: { height: 10 },
    wordBank: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
    wordBubble: {
        backgroundColor: theme.colors.surface,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        margin: 6,
        borderWidth: 1,
        borderColor: theme.colors.border,
        // Shadow
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    wordBubbleSelected: {
        backgroundColor: theme.colors.primaryLight + '40', // transparent primary
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        margin: 6,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    wordBubbleGhost: {
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.background,
        shadowColor: 'transparent',
        elevation: 0,
    },
    wordText: {
        fontSize: theme.typography.fontSizes.md,
        fontWeight: '500',
    },
    wordTextGhost: { color: 'transparent' }
});
