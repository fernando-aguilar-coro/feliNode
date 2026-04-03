import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Screen } from './Screen';
import { AppText } from './AppText';
import { useAppTheme } from '../theme/ThemeContext';

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

    const displayMessage = message || t(`common.${type}`);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        textContainer: {
            marginTop: theme.spacing.md,
        },
    }), [theme]);

    return (
        <Screen style={styles.container} backgroundColor={activeBackgroundColor}>
            <View style={styles.content}>
                <ActivityIndicator size="large" color={activeSpinnerColor} />
                {displayMessage && (
                    <View style={styles.textContainer}>
                        <AppText variant="md" color={theme.colors.textSecondary} align="center">
                            {displayMessage}
                        </AppText>
                    </View>
                )}
            </View>
        </Screen>
    );
};