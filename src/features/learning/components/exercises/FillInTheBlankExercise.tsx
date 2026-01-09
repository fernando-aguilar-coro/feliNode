import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { FillInTheBlankExercise as FillInTheBlankExerciseType } from '../../types/exercise';

interface Props {
    exercise: FillInTheBlankExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

export const FillInTheBlankExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    return (
        <View>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>{exercise.question}</Text>
            <Text style={{ marginBottom: 10 }}>{exercise.sentence}</Text>
            <TextInput
                value={userAnswer}
                onChangeText={onAnswer}
                placeholder="Type the missing word..."
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 10,
                }}
            />
        </View>
    );
};
