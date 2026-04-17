import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Screen, AppText } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { infinityProgressRepository } from '../../../db_local/repositories';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../home/navigation/HomeNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PracticeCard } from '../components/practice/PracticeCard';
import { PracticeTopicModal, PracticeMode } from '../components/practice/PracticeTopicModal';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

type NavProp = NativeStackNavigationProp<HomeStackParamList>;

export const PracticeLandingScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<NavProp>();
    const { t } = useTranslation();

    const [maxScore, setMaxScore] = useState(0);
    const [maxPairsScore, setMaxPairsScore] = useState(0);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState<PracticeMode | null>(null);

    const fetchScores = useCallback(async () => {
        try {
            const [combined, pairs] = await Promise.all([
                infinityProgressRepository.getInfinityScore('General English'),
                infinityProgressRepository.getInfinityScore('General Pairs'),
            ]);
            setMaxScore(combined);
            setMaxPairsScore(pairs);
        } catch (e) {
            console.error('[PracticeLandingScreen] Failed to fetch scores', e);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchScores();
        }, [fetchScores])
    );

    const openModal = (mode: PracticeMode) => {
        setModalMode(mode);
        setModalVisible(true);
    };

    const styles = makeStyles(theme);

    return (
        <Screen style={styles.screen}>
            <LinearGradient
                colors={[theme.colors.primary + '15', 'transparent']}
                style={StyleSheet.absoluteFill}
            />
            
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.header}>
                        <View style={styles.headerTitleRow}>
                            <View style={[styles.headerIconBg, { backgroundColor: theme.colors.primary }]}>
                                <Ionicons name="rocket" size={24} color="#FFF" />
                            </View>
                            <View>
                                <AppText style={styles.welcomeText}>{t('learning.practice.title', 'Zona de Práctica')}</AppText>
                                <AppText style={[styles.subtitleText, { color: theme.colors.textSecondary }]}>
                                    {t('learning.practice.subtitle', 'Perfecciona tus habilidades')}
                                </AppText>
                            </View>
                        </View>
                    </Animated.View>

                    <View style={styles.cardsGap}>
                        {/* Ejercicios Combinados */}
                        <PracticeCard
                            iconName="infinite-outline"
                            title={t('learning.practice.infinityChallenge')}
                            description={t('learning.practice.infinityDesc')}
                            score={maxScore}
                            scoreLabel={t('learning.practice.record', { score: maxScore })}
                            onPress={() => openModal('combined')}
                            animDelay={150}
                        />

                        {/* Pares */}
                        <PracticeCard
                            iconName="duplicate-outline"
                            iconColor="#FFBA08"
                            iconBgColor="#FFBA0815"
                            title={t('learning.practice.matching')}
                            description={t('learning.practice.matchingDesc')}
                            score={maxPairsScore}
                            scoreLabel={t('learning.practice.record', { score: maxPairsScore })}
                            onPress={() => openModal('pairs')}
                            animDelay={300}
                        />

                        {/* Pronunciación */}
                        <PracticeCard
                            iconName="mic-outline"
                            iconColor="#4CC9F0"
                            iconBgColor="#4CC9F015"
                            title={t('learning.practice.voiceAssessment')}
                            description={t('learning.practice.voiceDesc')}
                            onPress={() => navigation.navigate('PronunciationAssessment')}
                            animDelay={450}
                        />

                        {/* Conversación Libre / Speak */}
                        <PracticeCard
                            iconName="chatbubbles-outline"
                            iconColor="#7209B7"
                            iconBgColor="#7209B715"
                            title={t('learning.practice.freeConversation')}
                            description={t('learning.practice.freeConvDesc')}
                            onPress={() => navigation.navigate('Speak')}
                            animDelay={600}
                        />
                    </View>
                    
                    <View style={styles.footerInfo}>
                        <Ionicons name="information-circle-outline" size={16} color={theme.colors.textSecondary} />
                        <AppText style={[styles.footerText, { color: theme.colors.textSecondary }]}>
                            {t('learning.practice.footerInfo', 'Practicar diariamente mejora tu retención en un 40%')}
                        </AppText>
                    </View>
                </ScrollView>
            </SafeAreaView>

            <PracticeTopicModal
                visible={modalVisible}
                mode={modalMode}
                onClose={() => setModalVisible(false)}
            />
        </Screen>
    );
};

const makeStyles = (theme: ReturnType<typeof import('../../../theme/ThemeContext').useAppTheme>) =>
    StyleSheet.create({
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
            paddingBottom: theme.spacing.xl,
            paddingTop: theme.spacing.md,
        },
        header: {
            marginBottom: 28,
            marginTop: 10,
        },
        headerTitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
        },
        headerIconBg: {
            width: 52,
            height: 52,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
        },
        welcomeText: {
            fontSize: 24,
            fontFamily: 'Nunito-Bold',
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        subtitleText: {
            fontSize: 14,
            fontFamily: 'Nunito-Regular',
        },
        cardsGap: {
            gap: 16,
        },
        footerInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 40,
            gap: 8,
            opacity: 0.7,
        },
        footerText: {
            fontSize: 12,
            fontFamily: 'Nunito-SemiBold',
            fontStyle: 'italic',
        },
    });
