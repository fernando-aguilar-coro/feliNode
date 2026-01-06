import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from '../../../components/TextInput'; // Import Core Component
import { Button } from '../../../components/Button'; // Import Core Component
import { theme } from '../../../theme';
import { Exercise } from '../types';

interface WritingExerciseProps {
    exercise: Exercise;
    userAnswer: string;
    onAnswerChange: (text: string) => void;
    onSubmit: () => void;
    feedback: 'idle' | 'success' | 'error';
}

export const WritingExercise = ({
    exercise,
    userAnswer,
    onAnswerChange,
    onSubmit,
    feedback,
}: WritingExerciseProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.prompt}>{exercise.prompt}</Text>

            <TextInput
                value={userAnswer}
                onChangeText={onAnswerChange}
                placeholder="Type your answer in English..."
                error={feedback === 'error' ? 'Incorrect, try again!' : undefined}
            />

            <Button
                label={feedback === 'success' ? 'Correct! Next' : 'Check'}
                onPress={onSubmit}
                variant={feedback === 'success' ? 'success' : 'primary'} // Assuming success variant exists or falling back
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        // Shadow for "Premium" feel
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    prompt: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
    },
});
