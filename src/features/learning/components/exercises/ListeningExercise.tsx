import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ListeningExercise as ListeningExerciseType } from '../../types/exercise';
import { AppText, AppTextInput } from '../../../../components';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { TtsService } from '../../services/Tts.service';

interface Props {
    exercise: ListeningExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

export const ListeningExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    const theme = useAppTheme();

    useEffect(() => {
        // Reproducir el audio al montar el componente
        TtsService.speak(exercise.phrase);
    }, [exercise.phrase]);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
        },
        contentContainer: {
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.xl,
        },
        question: {
            marginBottom: theme.spacing.xl,
            color: theme.colors.text,
            textAlign: 'center',
        },
        controlsContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: theme.spacing.xl,
            gap: 40,
        },
        controlItem: {
            alignItems: 'center',
            gap: theme.spacing.xs,
        },
        playButton: {
            backgroundColor: theme.colors.primary,
            width: 64,
            height: 64,
            borderRadius: 32,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        },
        slowButton: {
            backgroundColor: theme.colors.secondary,
            width: 48,
            height: 48,
            borderRadius: 24,
        },
        buttonLabel: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        input: {
            minHeight: 100,
            textAlignVertical: 'top',
        }
    }), [theme]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <AppText variant="xl" weight="bold" style={styles.question}>
                    {exercise.question}
                </AppText>

                <View style={styles.controlsContainer}>
                    <View style={styles.controlItem}>
                        <TouchableOpacity
                            onPress={() => TtsService.speak(exercise.phrase, { rate: 0.4 })}
                            style={styles.playButton}
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons name="volume-high" size={32} color="white" />
                        </TouchableOpacity>
                        <AppText style={styles.buttonLabel}>Normal</AppText>
                    </View>

                    <View style={styles.controlItem}>
                        <TouchableOpacity
                            onPress={() => TtsService.speak(exercise.phrase, { rate: 0.15 })}
                            style={[styles.playButton, styles.slowButton]}
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons name="tortoise" size={24} color="white" />
                        </TouchableOpacity>
                        <AppText style={styles.buttonLabel}>Lento</AppText>
                    </View>
                </View>

                <AppText
                    variant="md"
                    weight="medium"
                    style={{ marginBottom: theme.spacing.sm, color: theme.colors.textSecondary }}
                >
                    Escribe lo que escuchas:
                </AppText>

                <AppTextInput
                    value={userAnswer}
                    onChangeText={onAnswer}
                    placeholder="Escribe tu respuesta aquí..."
                    autoCapitalize="none"
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
