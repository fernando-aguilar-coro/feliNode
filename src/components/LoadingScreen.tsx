import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Screen } from './Screen';
import { AppText } from './AppText';
import { useAppTheme } from '../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export type LoadingType = 'loading' | 'syncing' | 'lessons' | 'progress' | 'generating' | 'lesson' | 'placement' | 'pairs';

interface LoadingScreenProps {
    type?: LoadingType;
    message?: string;
    spinnerColor?: string;
    backgroundColor?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
    type = 'loading',
    message,
    spinnerColor,
    backgroundColor,
}) => {
    const { t } = useTranslation();
    const theme = useAppTheme();
    const activeSpinnerColor = spinnerColor || theme.colors.primary;
    const activeBackgroundColor = backgroundColor || theme.colors.background;

    const tips = useMemo(() => {
        const tTips = t('common.tips', { returnObjects: true });
        return Array.isArray(tTips) ? tTips : [];
    }, [t]);

    const [currentTipIndex, setCurrentTipIndex] = useState(() => 
        tips.length > 0 ? Math.floor(Math.random() * tips.length) : 0
    );

    useEffect(() => {
        if (tips.length === 0) return;
        const interval = setInterval(() => {
            setCurrentTipIndex((prev) => (prev + 1) % tips.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [tips.length]);

    const displayMessage = message || t(`common.${type}`);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: theme.spacing.xl,
        },
        textContainer: {
            marginTop: theme.spacing.lg,
            alignItems: 'center',
        },
        tipContainer: {
            marginTop: theme.spacing.xl * 2,
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.lg,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: '90%',
        },
        tipText: {
            flex: 1,
            marginLeft: theme.spacing.sm,
            fontStyle: 'italic',
        }
    }), [theme]);

    return (
        <Screen style={styles.container} backgroundColor={activeBackgroundColor}>
            <View style={styles.content}>
                <ActivityIndicator size="large" color={activeSpinnerColor} />
                {displayMessage && (
                    <View style={styles.textContainer}>
                        <AppText variant="lg" weight="bold" color={theme.colors.text} align="center">
                            {displayMessage}
                        </AppText>
                    </View>
                )}

                <View style={styles.tipContainer}>
                    <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color={theme.colors.primary} />
                    <AppText
                        variant="sm"
                        color={theme.colors.textSecondary}
                        style={styles.tipText}
                        align="left"
                    >
                        {tips[currentTipIndex]}
                    </AppText>
                </View>
            </View>
        </Screen>
    );
};