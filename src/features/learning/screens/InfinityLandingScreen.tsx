import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Screen, AppText, AppButton, Spacer, AppTextInput } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getInfinityScore } from '../../../db_local/api_local';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../home/navigation/HomeNavigation';

type InfinityLandingNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'InfinityExercise'>;

export const InfinityLandingScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<InfinityLandingNavigationProp>();
    const [maxScore, setMaxScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [lessonTopic, setLessonTopic] = useState('');

    const fetchScore = useCallback(async (topic: string) => {
        setLoading(true);
        try {
            const targetId = topic.trim() ? `Lesson: ${topic.trim()}` : 'General English';
            const score = await getInfinityScore(targetId);
            setMaxScore(score);
        } catch (error) {
            console.error('Failed to fetch max score', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchScore(lessonTopic);
        }, [lessonTopic, fetchScore])
    );

    // Debounce fetching score when typing
    React.useEffect(() => {
        const timer = setTimeout(() => {
            fetchScore(lessonTopic);
        }, 500);
        return () => clearTimeout(timer);
    }, [lessonTopic, fetchScore]);

    const handleStart = () => {
        navigation.navigate('InfinityExercise', { lessonId: lessonTopic.trim() });
    };

    const handleStartPairs = () => {
        navigation.navigate('InfinitySelectPairs', { lessonId: lessonTopic.trim() });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.lg,
        },
        iconContainer: {
            marginBottom: theme.spacing.xl,
            alignItems: 'center',
        },
        scoreContainer: {
            alignItems: 'center',
            marginBottom: theme.spacing.xl,
            padding: theme.spacing.md,
            backgroundColor: theme.colors.surface,
            borderRadius: 8,
            width: '100%',
            maxWidth: 300,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        scoreLabel: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xs,
        },
        scoreValue: {
            fontSize: 36,
            fontWeight: 'bold',
            color: theme.colors.primary,
        },
        description: {
            textAlign: 'center',
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xl,
            lineHeight: 24,
        }
    });

    return (
        <Screen style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="logo-octocat" size={120} color={theme.colors.primary} />
            </View>

            <AppText variant="xxl" style={{ marginBottom: theme.spacing.md }}>
                Modo Infinito
            </AppText>

            <AppText style={styles.description}>
                ¡Practica sin límites! Resuelve ejercicios generados infinitamente y mejora tu racha.
            </AppText>

            <View style={{ width: '100%', maxWidth: 300, marginBottom: theme.spacing.md }}>
                <AppTextInput
                    label="Tema o Lección (Opcional)"
                    placeholder="Ej. travel, food, how-much how-many..."
                    value={lessonTopic}
                    onChangeText={setLessonTopic}
                />
            </View>

            <View style={styles.scoreContainer}>
                <AppText style={styles.scoreLabel}>
                    {lessonTopic.trim() ? `Récord (${lessonTopic})` : 'Récord General'}
                </AppText>
                <AppText style={styles.scoreValue}>{maxScore}</AppText>
            </View>

            <AppButton
                title="Comenzar Reto"
                onPress={handleStart}
                style={{ width: '100%', maxWidth: 300, marginBottom: theme.spacing.md }}
            />

            <AppButton
                title="Emparejar Palabras"
                variant="secondary"
                onPress={handleStartPairs}
                style={{ width: '100%', maxWidth: 300 }}
            />
        </Screen>
    );
};
