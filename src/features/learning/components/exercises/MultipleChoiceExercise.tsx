import React from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { MultipleChoiceExercise as MultipleChoiceExerciseType } from '../../types/exercise';

interface Props {
    exercise: MultipleChoiceExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string | null;
}

export const MultipleChoiceExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    return (
        <View>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>{exercise.question}</Text>
            {exercise.options.map((option) => (
                <TouchableOpacity
                    key={option}
                    onPress={() => onAnswer(option)}
                    style={{
                        padding: 10,
                        marginVertical: 5,
                        backgroundColor: userAnswer === option ? '#ddd' : '#f0f0f0',
                        borderWidth: 1,
                        borderColor: '#ccc',
                    }}
                >
                    <Text>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};
