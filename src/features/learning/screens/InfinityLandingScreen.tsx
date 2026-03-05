import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Screen, AppText, AppButton, Spacer, AppTextInput } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { infinityProgressRepository } from '../../../db_local/repositories';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../home/navigation/HomeNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';

type InfinityLandingNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'InfinityExercise'>;

export const InfinityLandingScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<InfinityLandingNavigationProp>();
    const [maxScore, setMaxScore] = useState(0);
    const [maxPairsScore, setMaxPairsScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [lessonTopic, setLessonTopic] = useState('');

    const fetchScore = useCallback(async (topic: string) => {
        setLoading(true);
        try {
            const targetId = topic.trim() ? `Lesson: ${topic.trim()}` : 'General English';
            const pairsTargetId = topic.trim() ? `Pairs: ${topic.trim()}` : 'General Pairs';

            const score = await infinityProgressRepository.getInfinityScore(targetId);
            const pairsScore = await infinityProgressRepository.getInfinityScore(pairsTargetId);

            setMaxScore(score);
            setMaxPairsScore(pairsScore);
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
        screen: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        safeArea: {
            flex: 1,
        },
        scrollContainer: {
            flexGrow: 1,
            padding: theme.spacing.lg,
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconContainer: {
            marginBottom: theme.spacing.xl,
            alignItems: 'center',
            backgroundColor: theme.colors.primary + '15',
            padding: theme.spacing.xl,
            borderRadius: 60,
        },
        title: {
            marginBottom: theme.spacing.sm,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        description: {
            textAlign: 'center',
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xl,
            lineHeight: 24,
            paddingHorizontal: theme.spacing.md,
        },
        inputContainer: {
            width: '100%',
            marginBottom: theme.spacing.xl,
        },
        cardsContainer: {
            width: '100%',
            gap: theme.spacing.md,
        },
        gameCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: theme.spacing.lg,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            width: '100%',
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
        },
        scoreBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.warning + '20',
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            borderRadius: 16,
            gap: 4,
        },
        scoreValueSmall: {
            fontWeight: 'bold',
            color: theme.colors.warning,
            fontSize: 14,
        },
        cardTitle: {
            fontWeight: 'bold',
            marginBottom: theme.spacing.xs,
        },
        cardSubtitle: {
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.md,
            fontSize: 14,
        },
        actionButton: {
            width: '100%',
            marginTop: theme.spacing.sm,
        }
    });

    return (
        <Screen style={styles.screen}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.iconContainer}>
                        <Ionicons name="infinite" size={80} color={theme.colors.primary} />
                    </View>

                    <AppText variant="xxl" style={styles.title}>
                        Modo Infinito
                    </AppText>

                    <AppText style={styles.description}>
                        ¡Practica sin límites! Resuelve ejercicios generados infinitamente, mejora tu fluidez y mantén tu racha.
                    </AppText>

                    <View style={styles.inputContainer}>
                        <AppTextInput
                            label="Tema o Lección (Opcional)"
                            placeholder="Ej. travel, food, present-simple..."
                            value={lessonTopic}
                            onChangeText={setLessonTopic}
                        />
                    </View>

                    <View style={styles.cardsContainer}>
                        <View style={styles.gameCard}>
                            <View style={styles.cardHeader}>
                                <Ionicons name="document-text" size={32} color={theme.colors.primary} />
                                <View style={styles.scoreBadge}>
                                    <Ionicons name="trophy" size={16} color={theme.colors.warning} />
                                    <AppText style={styles.scoreValueSmall}>{maxScore}</AppText>
                                </View>
                            </View>
                            <AppText variant="lg" style={styles.cardTitle}>Ejercicios Combinados</AppText>
                            <AppText style={styles.cardSubtitle}>
                                {lessonTopic.trim() ? `Récord en ${lessonTopic}` : 'Récord General'}
                            </AppText>
                            <AppButton
                                title="Iniciar Ejercicios"
                                onPress={handleStart}
                                style={styles.actionButton}
                            />
                        </View>

                        <View style={styles.gameCard}>
                            <View style={styles.cardHeader}>
                                <Ionicons name="layers" size={32} color={theme.colors.secondary} />
                                <View style={styles.scoreBadge}>
                                    <Ionicons name="trophy" size={16} color={theme.colors.warning} />
                                    <AppText style={styles.scoreValueSmall}>{maxPairsScore}</AppText>
                                </View>
                            </View>
                            <AppText variant="lg" style={styles.cardTitle}>Emparejar Palabras</AppText>
                            <AppText style={styles.cardSubtitle}>
                                {lessonTopic.trim() ? `Récord en ${lessonTopic}` : 'Récord General'}
                            </AppText>
                            <AppButton
                                title="Iniciar Pares"
                                variant="secondary"
                                onPress={handleStartPairs}
                                style={styles.actionButton}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Screen>
    );
};
