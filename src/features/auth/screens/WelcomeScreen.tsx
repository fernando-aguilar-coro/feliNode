import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, AppText, AppButton, Spacer } from '../../../components';
import { theme } from '../../../theme';

export const WelcomeScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <Screen style={styles.container}>
            {/* Sección de encabezado */}
            <View style={styles.header}>
                <AppText variant="xl" weight="bold" align="center" style={styles.title}>
                    Bienvenido a Felinode
                </AppText>
                <Spacer height={theme.spacing.sm} />
                <AppText variant="lg" color={theme.colors.textSecondary} align="center">
                    Domina el inglés de la manera correcta.
                </AppText>
            </View>

            {/* Sección de botones */}
            <View style={styles.buttonContainer}>
                <AppButton
                    title="Prueba de Nivel"
                    onPress={() => navigation.navigate('PlacementEvaluation')}
                    variant="primary"
                />
                <Spacer height={theme.spacing.md} />
                <AppButton
                    title="Entrar / Registrarse"
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