import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { lessonRepository } from '../../../../db_local/repositories';
import { HomeStackParamList } from '../../../home/navigation/HomeNavigation';
import { PracticeCard } from '../../../learning/components/practice/PracticeCard';
import { PracticeTopicModal, PracticeMode } from '../../../learning/components/practice/PracticeTopicModal';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';

type NavProp = NativeStackNavigationProp<HomeStackParamList>;

const CARD_HEIGHT = 320; // Doubled height as requested

interface LessonSummary {
    id: string;
    title: string;
    order_index: number;
    module_title: string;
}

/**
 * ContinueWhereLeftOff
 *
 * Left  ~50%  – Next lesson card (real data)
 * Right ~50%  – 2x2 Grid of compact PracticeCards
 */
export const ContinueWhereLeftOff = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<NavProp>();

    const [nextLesson, setNextLesson] = useState<LessonSummary | null>(null);
    const [loading, setLoading] = useState(true);

    // Practice modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState<PracticeMode | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const lesson = await lessonRepository.getNextLesson();
            setNextLesson(lesson);
        } catch (e) {
            console.error('[ContinueWhereLeftOff] Error loading next lesson', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const handlePressLesson = () => {
        if (!nextLesson) return;
        navigation.navigate('Lesson', { lessonId: nextLesson.id });
    };

    const openPracticeModal = (mode: PracticeMode) => {
        setModalMode(mode);
        setModalVisible(true);
    };

    const styles = makeStyles(theme);

    return (
        <Animated.View 
            entering={FadeInUp.duration(600)}
            style={styles.wrapper}
        >
            <View style={styles.headerRow}>
                <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                    Continuar
                </Text>
            </View>

            <View style={styles.row}>
                {/* ── Left: Next Lesson card ────────────────────────── */}
                <TouchableOpacity
                    activeOpacity={0.82}
                    style={[
                        styles.cardLesson,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.border,
                        },
                    ]}
                    onPress={handlePressLesson}
                    disabled={loading || !nextLesson}
                >
                    <LinearGradient
                        colors={[theme.colors.primary + '10', 'transparent']}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />

                    <View style={styles.cardHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + '22' }]}>
                            <FontAwesome5 name="book-open" size={24} color={theme.colors.primary} />
                        </View>
                        {nextLesson && (
                            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                                <Text style={styles.badgeText}>{nextLesson.order_index}</Text>
                            </View>
                        )}
                    </View>

                    {loading ? (
                        <ActivityIndicator
                            size="small"
                            color={theme.colors.primary}
                            style={{ marginVertical: 10 }}
                        />
                    ) : nextLesson ? (
                        <View style={styles.lessonInfo}>
                            <Text
                                style={[styles.cardTitle, { color: theme.colors.text }]}
                                numberOfLines={2}
                            >
                                {nextLesson.title}
                            </Text>
                            <Text
                                style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}
                                numberOfLines={1}
                            >
                                {nextLesson.module_title}
                            </Text>
                        </View>
                    ) : (
                        <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>
                            ¡Todo listo! 🎓
                        </Text>
                    )}

                    <View style={[styles.ctaChip, { backgroundColor: theme.colors.primary }]}>
                        <Ionicons name="play" size={12} color="#fff" />
                        <Text style={styles.ctaText}>Lección</Text>
                    </View>
                </TouchableOpacity>

                {/* ── Right: Stack of 4 Practice Cards ───────────────── */}
                <View style={styles.rightColumn}>
                    <MiniPracticeCard
                        iconName="infinite-outline"
                        color={theme.colors.primary}
                        onPress={() => openPracticeModal('combined')}
                        title="Infinito"
                        styles={styles}
                    />
                    <MiniPracticeCard
                        iconName="duplicate-outline"
                        color="#FFBA08"
                        onPress={() => openPracticeModal('pairs')}
                        title="Pares"
                        styles={styles}
                    />
                    <MiniPracticeCard
                        iconName="mic-outline"
                        color="#4CC9F0"
                        onPress={() => navigation.navigate('PronunciationAssessment')}
                        title="Voz"
                        styles={styles}
                    />
                    <MiniPracticeCard
                        iconName="chatbubbles-outline"
                        color="#7209B7"
                        onPress={() => navigation.navigate('Speak')}
                        title="Hablar"
                        styles={styles}
                    />
                </View>
            </View>

            <PracticeTopicModal
                visible={modalVisible}
                mode={modalMode}
                onClose={() => setModalVisible(false)}
            />
        </Animated.View>
    );
};

const MiniPracticeCard = ({ iconName, color, onPress, title, styles }: any) => {
    const theme = useAppTheme();
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.miniCardRow,
                { 
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                }
            ]}
        >
            <View style={[styles.miniIconBgRow, { backgroundColor: color + '15' }]}>
                <Ionicons name={iconName} size={20} color={color} />
            </View>
            <Text style={[styles.miniTitleRow, { color: theme.colors.text }]} numberOfLines={1}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const makeStyles = (theme: ReturnType<typeof import('../../../../theme/ThemeContext').useAppTheme>) =>
    StyleSheet.create({
        wrapper: {
            marginTop: 16,
            marginHorizontal: 16,
            marginBottom: 8,
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
        },
        sectionLabel: {
            fontSize: 12,
            fontFamily: 'Nunito-Bold',
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
        seeAll: {
            // Unused
        },
        row: {
            flexDirection: 'row',
            gap: 12,
            height: CARD_HEIGHT,
        },
        cardLesson: {
            flex: 1.1,
            borderRadius: 24,
            borderWidth: 1,
            padding: 16,
            justifyContent: 'space-between',
            overflow: 'hidden',
            elevation: 4,
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        iconCircle: {
            width: 48,
            height: 48,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
        },
        badge: {
            minWidth: 20,
            height: 20,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 4,
        },
        badgeText: {
            color: '#fff',
            fontSize: 10,
            fontFamily: 'Nunito-Bold',
        },
        lessonInfo: {
            marginTop: 4,
        },
        cardTitle: {
            fontSize: 16,
            fontFamily: 'Nunito-Bold',
            marginBottom: 2,
        },
        cardSubtitle: {
            fontSize: 12,
            fontFamily: 'Nunito-Regular',
        },
        ctaChip: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            borderRadius: 12,
            paddingHorizontal: 10,
            paddingVertical: 6,
            gap: 6,
        },
        ctaText: {
            color: '#fff',
            fontSize: 12,
            fontFamily: 'Nunito-Bold',
        },
        rightColumn: {
            flex: 0.9,
            gap: 8,
        },
        miniCardRow: {
            flex: 1,
            flexDirection: 'row',
            borderRadius: 16,
            borderWidth: 1,
            paddingHorizontal: 10,
            alignItems: 'center',
            elevation: 2,
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 4,
        },
        miniIconBgRow: {
            width: 42,
            height: 42,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        miniTitleRow: {
            fontSize: 14,
            fontFamily: 'Nunito-SemiBold',
            flex: 1,
        },
    });
