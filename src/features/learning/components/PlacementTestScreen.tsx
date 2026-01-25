import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { LearningSection } from './LearningSection';
import { Screen, AppText, AppButton, Spacer } from '../../../components';
import { theme } from '../../../theme';

import { useRoute } from '@react-navigation/native';

export const PlacementTestScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { lessonId } = route.params || {};

    return (
        <LearningSection
            lessonId={lessonId || "placement_test_basic"}
            headerTitle="Prueba de Nivel"
            loadingText="Cargando prueba de nivel..."
            onExit={() => navigation.navigate('Home')}
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
                            title="Ir al Inicio"
                            onPress={() => navigation.navigate('Home')}
                            variant="primary"
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
