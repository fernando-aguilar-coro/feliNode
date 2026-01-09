import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Exercise } from '../types/exercise';
import { useExercises } from '../hooks/useExercises';
import { ExerciseContainer } from '../components/exercises/ExerciseContainer';
import { ExerciseService } from '../services/ExerciseService';

export const PlacementTestScreen = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);

    useEffect(() => {
        const loadExercises = async () => {
            try {
                const data = await ExerciseService.getPlacementExercises();
                setExercises(data);
            } catch (error) {
                console.error('Failed to load exercises', error);
            }
        };
        loadExercises();
    }, []);

    const {
        currentExercise,
        isFinished,
        checkAnswer,
        nextExercise,
        lastResult,
    } = useExercises(exercises);
    if (isFinished) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 24 }}>Test Complete!</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Placement Test </Text>
            </View>
            {currentExercise && (
                <View>
                    <ExerciseContainer
                        exercise={currentExercise}
                        onCheck={checkAnswer}
                        onNext={nextExercise}
                        lastResult={lastResult}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};
