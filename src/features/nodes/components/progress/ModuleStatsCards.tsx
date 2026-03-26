import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { useCurrencies } from '../../../gamification/hooks/useCurrencies';
import { useStreak } from '../../../gamification/hooks/useStreak';
import { useSettingsStore } from '../../../../store/SettingsStore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { audioService } from '../../../settings/services/audio.service';

interface ModuleStatsCardsProps {
    orientation?: 'row' | 'column';
}

export const ModuleStatsCards = ({ orientation = 'row' }: ModuleStatsCardsProps) => {
    const theme = useAppTheme();
    const navigation = useNavigation<any>();
    const showStreak = useSettingsStore(state => state.showStreak);
    const { currencies, loadCurrencies } = useCurrencies();
    const { streak } = useStreak();

    useFocusEffect(
        useCallback(() => {
            loadCurrencies();
        }, [loadCurrencies])
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
                        isRow && styles.statCardFlex,
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
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Racha</Text>
                    </View>
                </TouchableOpacity>
            )}

            <View style={[
                styles.statCard,
                isRow && styles.statCardFlex,
                { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }
            ]}>
                <FontAwesome5 name="star" size={24} color="#FFD700" solid />
                <View style={styles.statTextContainer}>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>{currencies.xp || 0}</Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Exp</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[
                    styles.statCard,
                    isRow && styles.statCardFlex,
                    { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }
                ]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ShopScreen')}
            >
                <FontAwesome5 name="coins" size={24} color="#FFBA08" />
                <View style={styles.statTextContainer}>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>{currencies.michi_coins || 0}</Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Monedas</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        gap: 8,
    },
    statCardFlex: {
        flex: 1,
        paddingVertical: 12,
    },
    statTextContainer: {
        alignItems: 'flex-start',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '900',
        lineHeight: 22,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
    }
});
