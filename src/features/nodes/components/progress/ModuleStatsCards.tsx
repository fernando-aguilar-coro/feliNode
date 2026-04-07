import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { useCurrencies } from '../../../gamification/hooks/useCurrencies';
import { useStreak } from '../../../gamification/hooks/useStreak';
import { useSettingsStore } from '../../../../store/SettingsStore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { audioService } from '../../../settings/services/audio.service';
import { useTranslation } from 'react-i18next';
import { getUserPosition } from '../../../../api/getRanking';

interface ModuleStatsCardsProps {
    orientation?: 'row' | 'column';
}

export const ModuleStatsCards = ({ orientation = 'row' }: ModuleStatsCardsProps) => {
    const theme = useAppTheme();
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const showStreak = useSettingsStore(state => state.showStreak);
    const { currencies, loadCurrencies } = useCurrencies();
    const { streak } = useStreak();

    const [userRank, setUserRank] = useState<number | null>(null);

    const loadData = useCallback(async () => {
        loadCurrencies();
        const position = await getUserPosition();
        setUserRank(position);
    }, [loadCurrencies]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const navigateToStreakDetails = useCallback(() => {
        audioService.playClickSound();
        navigation.navigate('StreakDetails');
    }, [navigation]);

    const isRow = orientation === 'row';

    return (
        <View style={isRow ? styles.statsRow : styles.statsColumn}>
            {showStreak && (
                <TouchableOpacity
                    style={[
                        styles.statCard,
                        isRow ? styles.statCardRowMode : styles.statCardColumnMode,
                        { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }
                    ]}
                    activeOpacity={0.8}
                    onPress={navigateToStreakDetails}
                >
                    <FontAwesome5 name="fire" size={24} color={streak?.current_streak > 0 ? "#FFA500" : "#B0B0B0"} />
                    <View style={styles.statTextContainer}>
                        <Text style={[styles.statValue, { color: theme.colors.text }]}>
                            {streak?.current_streak || 0}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t('nodes.progress.streak')}</Text>
                    </View>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={[
                    styles.statCard,
                    isRow ? styles.statCardRowMode : styles.statCardColumnMode,
                    { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }
                ]}
                activeOpacity={0.8}
                onPress={() => {
                    audioService.playClickSound();
                    navigation.navigate('Ranking');
                }}
            >
                <FontAwesome5 name="star" size={24} color="#FFD700" solid />
                <View style={styles.statTextContainer}>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>{currencies.xp || 0}</Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t('nodes.progress.exp')}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.statCard,
                    isRow ? styles.statCardRowMode : styles.statCardColumnMode,
                    { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }
                ]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Main', { screen: 'Shop' })}
            >
                <FontAwesome5 name="coins" size={24} color="#FFBA08" />
                <View style={styles.statTextContainer}>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>{currencies.michi_coins || 0}</Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t('nodes.progress.coins')}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.statCard,
                    isRow ? styles.statCardRowMode : styles.statCardColumnMode,
                    { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }
                ]}
                activeOpacity={0.8}
                onPress={() => {
                    audioService.playClickSound();
                    navigation.navigate('Ranking');
                }}
            >
                <FontAwesome5 name="trophy" size={20} color="#CD7F32" />
                <View style={styles.statTextContainer}>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>
                        {userRank ? `#${userRank}` : '---'}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                        {t('nodes.progress.ranking')}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 8,
        marginTop: 40,
        marginBottom: 8,
    },
    statsColumn: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
        marginTop: 16,
        marginRight: 16,
    },
    statCard: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    statCardRowMode: {
        flex: 1,
        flexDirection: 'column',
        paddingVertical: 12,
        paddingHorizontal: 4,
        gap: 4,
    },
    statCardColumnMode: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 12,
        gap: 8,
    },
    statTextContainer: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 14,
        fontFamily: 'Nunito-Bold',
        fontWeight: '700',
        lineHeight: 18,
    },
    statLabel: {
        fontSize: 11,
        fontFamily: 'Nunito-SemiBold',
        fontWeight: '500',
    }
});
