import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, AppText, AppButton, Spacer } from '../../../components';
import { theme } from '../../../theme';

export const WelcomeScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <Screen style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <AppText variant="xxl" weight="bold" align="center" style={styles.title}>
                    Welcome to Felinode
                </AppText>
                <Spacer height={theme.spacing.sm} />
                <AppText variant="lg" color={theme.colors.textSecondary} align="center">
                    Master English the right way.
                </AppText>
            </View>

            {/* Button Section */}
            <View style={styles.buttonContainer}>
                <AppButton
                    title="Take Placement Test / Register"
                    onPress={() => navigation.navigate('PlacementEvaluation')}
                    variant="primary"
                />
                <Spacer height={theme.spacing.md} />
                <AppButton
                    title="Log In"
                    onPress={() => navigation.navigate('Login')}
                    variant="secondary"
                />
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-around',
    },
    header: {
        alignItems: 'center',
        marginTop: theme.spacing.xl,
    },
    title: {
        marginBottom: theme.spacing.xs,
    },
    buttonContainer: {
        width: '100%',
    },
});