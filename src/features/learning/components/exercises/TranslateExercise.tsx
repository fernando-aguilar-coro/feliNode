import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { TranslateExercise as TranslateExerciseType } from '../../types/exercise';

interface Props {
    exercise: TranslateExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

export const TranslateExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    return (
        <View>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>{exercise.question}</Text>
            <Text style={{ fontStyle: 'italic', marginBottom: 10 }}>{exercise.phrase}</Text>
            <TextInput
                value={userAnswer}
                onChangeText={onAnswer}
                placeholder="Translate this phrase..."
                multiline
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    height: 100,
                    textAlignVertical: 'top',
                }}
            />
        </View>
    );
};
