import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Screen, AppText, AppTextArea } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { infinityProgressRepository } from '../../../db_local/repositories';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../home/navigation/HomeNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn, Easing, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { RecommendTopicButton } from '../components/RecommendTopicButton';

type PracticeLandingNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const { width } = Dimensions.get('window');

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const PracticeLandingScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<PracticeLandingNavigationProp>();
    const [maxScore, setMaxScore] = useState(0);
    const [maxPairsScore, setMaxPairsScore] = useState(0);

    // Modal State
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedMode, setSelectedMode] = useState<'combined' | 'pairs' | null>(null);
    const [modalTopic, setModalTopic] = useState('');

    const fetchCombinedScore = useCallback(async () => {
        try {
            const score = await infinityProgressRepository.getInfinityScore('General English');
            setMaxScore(score);
        } catch (error) {
            console.error('Failed to fetch combined score', error);
        }
    }, []);

    const fetchPairsScore = useCallback(async () => {
        try {
            const score = await infinityProgressRepository.getInfinityScore('General Pairs');
            setMaxPairsScore(score);
        } catch (error) {
            console.error('Failed to fetch pairs score', error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchCombinedScore();
            fetchPairsScore();
        }, [fetchCombinedScore, fetchPairsScore])
    );

    const openModal = (mode: 'combined' | 'pairs') => {
        setSelectedMode(mode);
        setModalTopic('');
        setModalVisible(true);
    };

    const handleStartExercise = () => {
        setModalVisible(false);
        if (selectedMode === 'combined') {
            navigation.navigate('InfinityExercise', { lessonId: modalTopic.trim() });
        } else if (selectedMode === 'pairs') {
            navigation.navigate('InfinitySelectPairs', { lessonId: modalTopic.trim() });
        }
    };

    const handleStartPronunciation = () => {
        // Asumiendo que esta pantalla existe y no requiere params.
        navigation.navigate('PronunciationAssessment');
    };

    const handleStartSpeak = () => {
        navigation.navigate('Speak');
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
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.xs
        },
        headerContainer: {
            marginTop: theme.spacing.xl,
            marginBottom: theme.spacing.xl,
            alignItems: 'center',
        },
        topIconContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
        },
        title: {
            fontSize: 28,
            fontWeight: '900',
            color: theme.colors.text,
            textAlign: 'center',
            letterSpacing: 0.5,
        },
        subtitle: {
            marginTop: theme.spacing.sm,
            fontSize: 15,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            lineHeight: 22,
            paddingHorizontal: theme.spacing.md,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            padding: theme.spacing.lg,
        },
        modalContent: {
            backgroundColor: theme.colors.background,
            borderRadius: 24,
            padding: theme.spacing.xl,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 10,
        },
        modalTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: theme.spacing.sm,
            textAlign: 'center',
        },
        modalSubtitle: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.lg,
            textAlign: 'center',
            lineHeight: 20,
        },
        modalButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: theme.spacing.xl,
            gap: theme.spacing.md,
        },
        modalButton: {
            flex: 1,
            paddingVertical: theme.spacing.md,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        modalButtonText: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        cardsGap: {
            gap: theme.spacing.lg,
        },
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: 24,
            padding: theme.spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 6,
            overflow: 'hidden',
        },
        cardIconBg: {
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme.spacing.md,
        },
        cardContent: {
            flex: 1,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 4,
        },
        cardDesc: {
            fontSize: 13,
            color: theme.colors.textSecondary,
            marginBottom: 8,
        },
        scoreContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        scoreText: {
            fontSize: 13,
            fontWeight: 'bold',
            color: theme.colors.warning,
        },
        playIconWrapper: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.colors.background,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: theme.spacing.sm,
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
                    <View style={styles.cardsGap}>
                        {/* Ejercicios Combinados */}
                        <AnimatedTouchable
                            entering={FadeInDown.delay(150).duration(600).springify()}
                            style={[styles.card, { borderWidth: 1, borderColor: theme.colors.border }]}
                            activeOpacity={0.8}
                            onPress={() => openModal('combined')}
                        >
                            <View style={[styles.cardIconBg, { backgroundColor: 'transparent' }]}>
                                <Ionicons name="infinite-outline" size={32} color={theme.colors.primary} />
                            </View>
                            <View style={styles.cardContent}>
                                <AppText style={styles.cardTitle}>Desafío Infinito</AppText>
                                <AppText style={styles.cardDesc}>Ejercicios de vocabulario y gramática sin fin.</AppText>
                                <View style={styles.scoreContainer}>
                                    <Ionicons name="trophy" size={14} color={theme.colors.warning} />
                                    <AppText style={styles.scoreText}>Récord: {maxScore}</AppText>
                                </View>
                            </View>
                            <View style={styles.playIconWrapper}>
                                <Ionicons name="play" size={20} color={theme.colors.primary} />
                            </View>
                        </AnimatedTouchable>

                        {/* Pares */}
                        <AnimatedTouchable
                            entering={FadeInDown.delay(300).duration(600).springify()}
                            style={[styles.card, { borderWidth: 1, borderColor: theme.colors.border }]}
                            activeOpacity={0.8}
                            onPress={() => openModal('pairs')}
                        >
                            <View style={[styles.cardIconBg, { backgroundColor: 'transparent' }]}>
                                <Ionicons name="duplicate-outline" size={32} color={theme.colors.secondary} />
                            </View>
                            <View style={styles.cardContent}>
                                <AppText style={styles.cardTitle}>Emparejar</AppText>
                                <AppText style={styles.cardDesc}>Une palabras con su significado o traducción.</AppText>
                                <View style={styles.scoreContainer}>
                                    <Ionicons name="trophy" size={14} color={theme.colors.warning} />
                                    <AppText style={styles.scoreText}>Récord: {maxPairsScore}</AppText>
                                </View>
                            </View>
                            <View style={styles.playIconWrapper}>
                                <Ionicons name="play" size={20} color={theme.colors.secondary} />
                            </View>
                        </AnimatedTouchable>

                        {/* Pronunciación */}
                        <AnimatedTouchable
                            entering={FadeInDown.delay(600).duration(600).springify()}
                            style={[styles.card, { borderWidth: 1, borderColor: theme.colors.border }]}
                            activeOpacity={0.8}
                            onPress={handleStartPronunciation}
                        >
                            <View style={[styles.cardIconBg, { backgroundColor: 'transparent' }]}>
                                <Ionicons name="mic-outline" size={32} color={theme.colors.success || '#10b981'} />
                            </View>
                            <View style={styles.cardContent}>
                                <AppText style={styles.cardTitle}>Evaluación de Voz</AppText>
                                <AppText style={styles.cardDesc}>Habla libremente y evalúa tu pronunciación.</AppText>
                            </View>
                            <View style={styles.playIconWrapper}>
                                <Ionicons name="play" size={20} color={theme.colors.success || '#10b981'} />
                            </View>
                        </AnimatedTouchable>

                        {/* Conversación Libre / Speak */}
                        <AnimatedTouchable
                            entering={FadeInDown.delay(750).duration(600).springify()}
                            style={[styles.card, { borderWidth: 1, borderColor: theme.colors.border }]}
                            activeOpacity={0.8}
                            onPress={handleStartSpeak}
                        >
                            <View style={[styles.cardIconBg, { backgroundColor: 'transparent' }]}>
                                <Ionicons name="chatbubbles-outline" size={32} color={theme.colors.info || '#3b82f6'} />
                            </View>
                            <View style={styles.cardContent}>
                                <AppText style={styles.cardTitle}>Conversación Libre</AppText>
                                <AppText style={styles.cardDesc}>Práctica hablar con IA de forma natural.</AppText>
                            </View>
                            <View style={styles.playIconWrapper}>
                                <Ionicons name="play" size={20} color={theme.colors.info || '#3b82f6'} />
                            </View>
                        </AnimatedTouchable>


                    </View>
                </ScrollView>
            </SafeAreaView>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.modalContent}>
                        <AppText style={styles.modalTitle}>
                            {selectedMode === 'combined' ? 'Desafío Infinito' : 'Emparejar'}
                        </AppText>
                        <AppText style={styles.modalSubtitle}>
                            Elige un enfoque o tema opcional para tu práctica.
                        </AppText>

                        <AppTextArea
                            label="Enfoque (Opcional)"
                            placeholder="Ej. greetings, grammar, animals..."
                            value={modalTopic}
                            onChangeText={setModalTopic}
                            numberOfLines={4}
                        />
                        <View style={{ marginTop: 12 }}>
                            <RecommendTopicButton onTopicReceived={setModalTopic} />
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <AppText style={[styles.modalButtonText, { color: theme.colors.textSecondary }]}>Cancelar</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                                onPress={handleStartExercise}
                            >
                                <AppText style={[styles.modalButtonText, { color: '#FFF' }]}>Empezar</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </Screen>
    );
};
