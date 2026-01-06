import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { useLesson } from '../hooks/useLesson';
import { WritingExercise } from '../components/WritingExercise';
import { theme } from '../../../theme';

export const LessonScreen = () => {
    // 1. Logic Layer (Hook)
    const {
        lesson,
        loading,
        currentExercise,
        userAnswer,
        setUserAnswer,
        checkAnswer,
        feedback
    } = useLesson('1'); // Generic ID for demo

    if (loading || !lesson) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    // 2. UI Layer (Feature Components)
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{lesson.title}</Text>
            </View>

            <View style={styles.content}>
                {currentExercise?.type === 'writing' && (
                    <WritingExercise
                        exercise={currentExercise}
                        userAnswer={userAnswer}
                        onAnswerChange={setUserAnswer}
                        onSubmit={checkAnswer}
                        feedback={feedback}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg,
        justifyContent: 'center',
    },
});
