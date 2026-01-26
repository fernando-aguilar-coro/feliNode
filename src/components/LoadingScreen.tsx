import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Screen } from './Screen';
import { AppText } from './AppText';
import { theme } from '../theme';

interface LoadingScreenProps {
    message?: string;
    spinnerColor?: string;
    backgroundColor?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
    message = 'Loading...',
    spinnerColor = theme.colors.primary,
    backgroundColor = theme.colors.background,
}) => {
    return (
        <Screen style={styles.container} backgroundColor={backgroundColor}>
            <View style={styles.content}>
                <ActivityIndicator size="large" color={spinnerColor} />
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

const styles = StyleSheet.create({
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
});