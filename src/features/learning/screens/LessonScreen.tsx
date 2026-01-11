import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useLessonSession } from '../hooks/useLessonSession';
import { TheoryViewer } from '../components/TheoryViewer';
import { ExerciseContainer } from '../components/exercises/ExerciseContainer';
import { useExercises } from '../hooks/useExercises';

type RootStackParamList = {
    Lesson: { lessonId: string };
};

type LessonScreenRouteProp = RouteProp<RootStackParamList, 'Lesson'>;

export const LessonScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<LessonScreenRouteProp>();
    const { lessonId } = route.params || { lessonId: 'lesson_verbs_intro' }; // Fallback for dev/testing without nav params

    const {
        status,
        theoryContent,
        exercises,
        startExercises,
        completeLesson
    } = useLessonSession(lessonId);

    // Inner hook for exercises (only active when we have exercises)
    const {
        currentExercise,
        isFinished,
        checkAnswer,
        nextExercise,
        lastResult,
    } = useExercises(exercises);

    // Effect to bridge the "finished exercises" state to "completeLesson"
    React.useEffect(() => {
        if (isFinished && status === 'exercises') {
            completeLesson();
        }
    }, [isFinished, status, completeLesson]);


    if (status === 'loading') {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    if (status === 'completed') {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Lesson Complete!</Text>
                <Text style={{ marginBottom: 20 }}>Great job!</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {status === 'theory' && (
                <TheoryViewer content={theoryContent} onContinue={startExercises} />
            )}

            {status === 'exercises' && (
                <View style={{ flex: 1 }}>
                    <View style={{ padding: 10 }}>
                        <Text>Exercises</Text>
                    </View>
                    {currentExercise ? (
                        <ExerciseContainer
                            exercise={currentExercise}
                            onCheck={checkAnswer}
                            onNext={nextExercise}
                            lastResult={lastResult}
                        />
                    ) : (
                        <Text>No exercises found.</Text>
                    )}
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
