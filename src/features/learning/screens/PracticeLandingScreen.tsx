import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
            backgroundColor: theme.colors.primary + '15',
            borderWidth: 1,
            borderColor: theme.colors.primary + '30'
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
            backgroundColor: theme.colors.primary + '10',
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
                            <View style={styles.cardIconBg}>
                                <Ionicons name="infinite-outline" size={32} color={theme.colors.primary} />
                            </View>
                            <View style={styles.cardContent}>
                                <AppText style={styles.cardTitle}>{t('learning.practice.infinityChallenge')}</AppText>
                                <AppText style={styles.cardDesc}>{t('learning.practice.infinityDesc')}</AppText>
                                <View style={styles.scoreContainer}>
                                    <Ionicons name="trophy" size={14} color={theme.colors.warning} />
                                    <AppText style={styles.scoreText}>{t('learning.practice.record', { score: maxScore })}</AppText>
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
                            <View style={styles.cardIconBg}>
                                <Ionicons name="duplicate-outline" size={32} color={theme.colors.primary} />
                            </View>
                            <View style={styles.cardContent}>
                                <AppText style={styles.cardTitle}>{t('learning.practice.matching')}</AppText>
                                <AppText style={styles.cardDesc}>{t('learning.practice.matchingDesc')}</AppText>
                                <View style={styles.scoreContainer}>
                                    <Ionicons name="trophy" size={14} color={theme.colors.warning} />
                                    <AppText style={styles.scoreText}>{t('learning.practice.record', { score: maxPairsScore })}</AppText>
                                </View>
                            </View>
                            <View style={styles.playIconWrapper}>
                                <Ionicons name="play" size={20} color={theme.colors.primary} />
                            </View>
                        </AnimatedTouchable>

                        {/* Pronunciación */}
                        <AnimatedTouchable
                            entering={FadeInDown.delay(600).duration(600).springify()}
                            style={[styles.card, { borderWidth: 1, borderColor: theme.colors.border }]}
                            activeOpacity={0.8}
                            onPress={handleStartPronunciation}
                        >
                            <View style={styles.cardIconBg}>
                                <Ionicons name="mic-outline" size={32} color={theme.colors.primary} />
                            </View>
                            <View style={styles.cardContent}>
                                <AppText style={styles.cardTitle}>{t('learning.practice.voiceAssessment')}</AppText>
                                <AppText style={styles.cardDesc}>{t('learning.practice.voiceDesc')}</AppText>
                            </View>
                            <View style={styles.playIconWrapper}>
                                <Ionicons name="play" size={20} color={theme.colors.primary} />
                            </View>
                        </AnimatedTouchable>

                        {/* Conversación Libre / Speak */}
                        <AnimatedTouchable
                            entering={FadeInDown.delay(750).duration(600).springify()}
                            style={[styles.card, { borderWidth: 1, borderColor: theme.colors.border }]}
                            activeOpacity={0.8}
                            onPress={handleStartSpeak}
                        >
                            <View style={styles.cardIconBg}>
                                <Ionicons name="chatbubbles-outline" size={32} color={theme.colors.primary} />
                            </View>
                            <View style={styles.cardContent}>
                                <AppText style={styles.cardTitle}>{t('learning.practice.freeConversation')}</AppText>
                                <AppText style={styles.cardDesc}>{t('learning.practice.freeConvDesc')}</AppText>
                            </View>
                            <View style={styles.playIconWrapper}>
                                <Ionicons name="play" size={20} color={theme.colors.primary} />
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
                            {selectedMode === 'combined' ? t('learning.practice.infinityChallenge') : t('learning.practice.matching')}
                        </AppText>
                        <AppText style={styles.modalSubtitle}>
                            {t('learning.practice.chooseFocus')}
                        </AppText>

                        <AppTextArea
                            label={t('learning.practice.focusLabel')}
                            placeholder={t('learning.practice.focusPlaceholder')}
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
                                <AppText style={[styles.modalButtonText, { color: theme.colors.textSecondary }]}>{t('learning.practice.cancel')}</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                                onPress={handleStartExercise}
                            >
                                <AppText style={[styles.modalButtonText, { color: '#FFF' }]}>{t('learning.practice.start')}</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </Screen>
    );
};
