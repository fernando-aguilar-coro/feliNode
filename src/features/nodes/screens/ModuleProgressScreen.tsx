import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../../theme/ThemeContext';
import { ModuleAccordion } from '../components/list/ModuleAccordion';
import { OverallProgress } from '../components/progress/OverallProgress';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { StreakBadge } from '../../gamification/components/StreakBadge';
import { CurrencyBadge } from '../../gamification/components/CurrencyBadge';
import { useSettingsStore } from '../../../store/SettingsStore';
import { useNavigation } from '@react-navigation/native';
import { audioService } from '../../settings/services/audio.service';

export const ModuleProgressScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<any>();
    const showStreak = useSettingsStore(state => state.showStreak);
    const { modules, isLoading, expandedModules, toggleModule } = useModuleProgress();

    const navigateToStreakDetails = useCallback(() => {
        audioService.playClickSound();
        navigation.navigate('StreakDetails');
    }, [navigation]);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        centerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
        },
        listContent: {
            paddingBottom: 40,
        },
        headerContainer: {
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 10,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        headerSubtitle: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            marginTop: 4,
        },
        topBannerContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            opacity: 0.8,
            alignItems: 'center',
            paddingHorizontal: 16,
            marginTop: 12,
            marginBottom: 4,
            gap: 8,
        }
    }), [theme]);

    const renderHeader = useMemo(() => (
        <View>
            <View style={[styles.topBannerContainer, { opacity: 0.8 }]}>
                {showStreak && (
                    <TouchableOpacity
                        onPress={navigateToStreakDetails}
                        activeOpacity={0.8}
                    >
                        <StreakBadge />
                    </TouchableOpacity>
                )}
                <CurrencyBadge />
            </View>
            {modules.length > 0 && <OverallProgress modules={modules} />}
        </View>
    ), [modules, showStreak, styles.topBannerContainer, navigateToStreakDetails]);

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <FlatList
                data={modules}
                extraData={expandedModules}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ModuleAccordion
                        module={item}
                        isExpanded={expandedModules.has(item.id)}
                        onToggle={toggleModule}
                    />
                )}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};
