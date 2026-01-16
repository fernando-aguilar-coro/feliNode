import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../../store/UserStore';
import { LearningSection } from '../components/LearningSection';
import { Screen, AppText, AppButton, Spacer } from '../../../components';
import { theme } from '../../../theme';

export const PlacementTestScreen = () => {
    const navigation = useNavigation<any>();
    const completeOnboarding = useUserStore((state) => state.completeOnboarding);

    return (
        <LearningSection
            lessonId="placement_test"
            headerTitle="Prueba de Nivel"
            loadingText="Cargando prueba de nivel..."
            onExit={() => navigation.navigate('Welcome')}
            renderCompleted={() => (
                <Screen style={styles.centerContainer}>
                    <AppText variant="xxl" weight="bold" color={theme.colors.success} align="center">
                        ¡Todo listo!
                    </AppText>
                    <Spacer height={theme.spacing.sm} />
                    <AppText variant="lg" color={theme.colors.textSecondary} align="center">
                        Hemos determinado tu nivel. ¡Empecemos!
                    </AppText>

                    <Spacer height={theme.spacing.xl} />
                    <View style={styles.completionButtonContainer}>
                        <AppButton
                            title="Identifícate para guardar tu progreso"
                            onPress={() => navigation.navigate('Login')}
                            variant="primary"
                        />
                        <Spacer height={theme.spacing.md} />
                        {/* Opción para continuar sin cuenta */}
                        <AppButton
                            title="Continuar sin registrarse"
                            onPress={() => completeOnboarding()}
                            variant="secondary"
                        />
                    </View>
                </Screen>
            )}
        />
    );
};

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completionButtonContainer: {
        width: '100%',
    },
});
