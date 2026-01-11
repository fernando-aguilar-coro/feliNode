import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLessonSession } from '../hooks/useLessonSession';
import { useExercises } from '../hooks/useExercises';
import { ExerciseContainer } from '../components/exercises/ExerciseContainer';

export const PlacementTestScreen = () => {
    const navigation = useNavigation<any>();

    // Placement test is a special "lesson" in our DB
    const {
        status,
        exercises,
        completeLesson
    } = useLessonSession('placement_test');

    const {
        currentExercise,
        isFinished,
        checkAnswer,
        nextExercise,
        lastResult,
    } = useExercises(exercises);

    // When exercises are finished, mark lesson as completed
    useEffect(() => {
        if (isFinished && status === 'exercises') {
            completeLesson();
        }
    }, [isFinished, status, completeLesson]);

    // When status becomes completed, navigate to Login
    useEffect(() => {
        if (status === 'completed') {
            // Reached the end of the placement test
            navigation.navigate('Login');
        }
    }, [status, navigation]);

    if (status === 'loading') {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#58cc02" />
                <Text style={styles.loadingText}>Loading placement test...</Text>
            </SafeAreaView>
        );
    }

    if (status === 'completed') {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <Text style={styles.title}>All set!</Text>
                <Text style={styles.subtitle}>We've determined your level. Let's get started!</Text>
                <ActivityIndicator size="small" color="#1cb0f6" style={{ marginTop: 20 }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Placement Test</Text>
            </View>

            <View style={styles.content}>
                {currentExercise ? (
                    <ExerciseContainer
                        exercise={currentExercise}
                        onCheck={checkAnswer}
                        onNext={nextExercise}
                        lastResult={lastResult}
                    />
                ) : (
                    <View style={styles.centerContainer}>
                        <Text>No exercises found for the placement test.</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('Welcome')}
                        >
                            <Text style={styles.buttonText}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    button: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#58cc02',
        borderRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
