import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Screen } from './Screen';
import { AppText } from './AppText';
import { useAppTheme } from '../theme/ThemeContext';

interface LoadingScreenProps {
    message?: string;
    spinnerColor?: string;
    backgroundColor?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
    message = 'Loading...',
    spinnerColor,
    backgroundColor,
}) => {
    const theme = useAppTheme();
    const activeSpinnerColor = spinnerColor || theme.colors.primary;
    const activeBackgroundColor = backgroundColor || theme.colors.background;

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
                {message && (
                    <View style={styles.textContainer}>
                        <AppText variant="md" color={theme.colors.textSecondary} align="center">
                            {message}
                        </AppText>
                    </View>
                )}
            </View>
        </Screen>
    );
};