import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, AppButton, Spacer, Screen } from '../../../components';
import { theme } from '../../../theme';
import { PronunciationExercise } from '../components/exercises/PronunciationExercise';
import { ExerciseType, PronunciationExercise as PronunciationExerciseType } from '../types/exercise';

export const PronunciationAssessmentScreen = () => {
    const navigation = useNavigation();
    const [phrase, setPhrase] = useState('');
    const [isExercising, setIsExercising] = useState(false);
    const [lastScore, setLastScore] = useState<string | null>(null);

    const handleStart = () => {
        if (phrase.trim()) {
            Keyboard.dismiss();
            setIsExercising(true);
            setLastScore(null);
        }
    };

    const handleAnswer = (score: string) => {
        setLastScore(score);
    };

    const handleReset = () => {
        setIsExercising(false);
        setLastScore(null);
        setPhrase('');
    };

    // Construct a mock exercise object
    const mockExercise: PronunciationExerciseType = {
        id: 'custom-assessment',
        type: ExerciseType.PRONUNCIATION,
        question: 'Pronuncia la siguiente frase:',
        phrase: phrase,
        correctAnswer: phrase,
    };

    return (
        <Screen>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AppText variant="md" color={theme.colors.primary} weight="bold">{'< Volver'}</AppText>
                </TouchableOpacity>
                <AppText variant="lg" weight="bold" style={styles.title}>Evaluación de Voz</AppText>
                <View style={styles.placeholder} />
            </View>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
                    {!isExercising ? (
                        <View style={styles.inputContainer}>
                            <AppText variant="lg" weight="bold" style={styles.label}>
                                ¿Qué frase quieres practicar?
                            </AppText>
                            <AppText variant="sm" color={theme.colors.textSecondary} style={styles.subtitle}>
                                Escribe una frase en español o inglés para evaluar tu pronunciación.
                            </AppText>

                            <Spacer height={theme.spacing.md} />

                            <TextInput
                                style={styles.input}
                                value={phrase}
                                onChangeText={setPhrase}
                                placeholder="Escribe aquí tu frase..."
                                placeholderTextColor={theme.colors.textLight}
                                autoCapitalize="sentences"
                                multiline
                            />

                            <Spacer height={theme.spacing.xl} />

                            <AppButton
                                title="Comenzar Práctica"
                                onPress={handleStart}
                                disabled={!phrase.trim()}
                                variant="primary"
                                style={styles.fullWidth}
                            />
                        </View>
                    ) : (
                        <View style={styles.exerciseContainer}>
                            <View style={styles.card}>
                                <PronunciationExercise
                                    exercise={mockExercise}
                                    onAnswer={handleAnswer}
                                    userAnswer=""
                                />
                            </View>

                            <Spacer height={theme.spacing.xl} />

                            <AppButton
                                title="Probar otra frase"
                                onPress={handleReset}
                                variant="outline"
                                style={styles.fullWidth}
                            />
                            <Spacer height={theme.spacing.xl} />
                        </View>
                    )}
                </ScrollView>
            </TouchableWithoutFeedback>
        </Screen>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.background,
    },
    backButton: {
        padding: theme.spacing.xs,
    },
    title: {
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 60,
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: theme.spacing.lg,
        flexGrow: 1,
    },
    inputContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        marginBottom: theme.spacing.xs,
        color: theme.colors.text,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    input: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: theme.spacing.lg,
        fontSize: 18,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: theme.colors.border,
        minHeight: 120,
        textAlignVertical: 'top',
        textAlign: 'center',
    },
    exerciseContainer: {
        flex: 1,
        paddingTop: theme.spacing.md,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: theme.spacing.md,
        // Shadow for elevation
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    fullWidth: {
        width: '100%',
    },
});
