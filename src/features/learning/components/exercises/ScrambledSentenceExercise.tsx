import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrambledSentenceExercise as ScrambledSentenceExerciseType } from '../../types/exercise';

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
            <Text style={styles.question}>{exercise.question}</Text>
            <Text style={styles.instruction}>Tap the words to form the correct sentence:</Text>

            {/* Answer Area */}
            <View style={styles.answerArea}>
                {selectedIndices.length === 0 && (
                    <Text style={styles.placeholder}>Your answer here...</Text>
                )}
                {selectedIndices.map((segmentIndex, listIndex) => (
                    <TouchableOpacity
                        key={`selected-${listIndex}`}
                        onPress={() => handleRemove(listIndex)}
                        style={styles.wordBubbleSelected}
                    >
                        <Text style={styles.wordText}>{exercise.segments[segmentIndex]}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.divider} />

            {/* Word Bank */}
            <View style={styles.wordBank}>
                {exercise.segments.map((word, index) => {
                    const isSelected = selectedIndices.includes(index);

                    if (isSelected) {
                        // Render a placeholder or invisible equivalent to keep layout stable, 
                        // OR just render a "ghost" of it.
                        // Let's render a ghost.
                        return (
                            <View key={`pool-${index}`} style={[styles.wordBubble, styles.wordBubbleGhost]}>
                                <Text style={styles.wordTextGhost}>{word}</Text>
                            </View>
                        );
                    }

                    return (
                        <TouchableOpacity
                            key={`pool-${index}`}
                            onPress={() => handleSelect(index)}
                            style={styles.wordBubble}
                        >
                            <Text style={styles.wordText}>{word}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 10 },
    question: { fontSize: 20, marginBottom: 10, fontWeight: 'bold', color: '#333' },
    instruction: { fontSize: 14, color: '#666', marginBottom: 20 },
    answerArea: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        minHeight: 80,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 10,
        marginBottom: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#eee',
        borderStyle: 'dashed'
    },
    placeholder: { color: '#ccc', fontStyle: 'italic', width: '100%', textAlign: 'center' },
    divider: { height: 10 },
    wordBank: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
    wordBubble: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        margin: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    wordBubbleSelected: {
        backgroundColor: '#e3f2fd',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        margin: 6,
        borderWidth: 1,
        borderColor: '#2196f3',
    },
    wordBubbleGhost: {
        backgroundColor: '#f0f0f0',
        borderColor: '#f0f0f0',
        shadowColor: 'transparent',
    },
    wordText: { fontSize: 16, color: '#333', fontWeight: '500' },
    wordTextGhost: { color: 'transparent' }
});
