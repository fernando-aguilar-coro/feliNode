import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Screen, AppText, AppButton, Spacer } from '../../../components';
import { theme } from '../../../theme';
import { useSettingsStore } from '../../../store/SettingsStore';

export const ChoseInitialTest = () => {
    const navigation = useNavigation<any>();
    const { setHasDecidedPlacementTest } = useSettingsStore();

    const handleSelectTest = (lessonId: string) => {
        navigation.navigate('PlacementEvaluation', { lessonId });
    };

    return (
        <Screen style={styles.container}>
            <View style={styles.content}>
                <AppText variant="xxl" weight="bold" align="center">
                    Elige tu nivel
                </AppText>
                <Spacer height={theme.spacing.lg} />
                <AppText variant="md" color={theme.colors.textSecondary} align="center">
                    Selecciona la prueba que mejor se adapte a ti.
                </AppText>

                <Spacer height={theme.spacing.xl} />

                <AppButton
                    title="Empezar de 0"
                    onPress={() => setHasDecidedPlacementTest(true)}
                    variant="primary"
                    style={styles.button}
                />
                <Spacer height={theme.spacing.lg} />

                <AppText variant="sm" color={theme.colors.textSecondary} align="center">
                    O toma una prueba de nivel:
                </AppText>
                <Spacer height={theme.spacing.md} />

                <AppButton
                    title="Nivel Básico"
                    onPress={() => handleSelectTest('placement_test_basic')}
                    variant="outline"
                    style={styles.button}
                />
                <Spacer height={theme.spacing.md} />

                <AppButton
                    title="Nivel Intermedio"
                    onPress={() => handleSelectTest('placement_test_intermediate')}
                    variant="outline"
                    style={styles.button}
                />
                <Spacer height={theme.spacing.md} />

                <AppButton
                    title="Nivel Avanzado"
                    onPress={() => handleSelectTest('placement_test_advanced')}
                    variant="outline"
                    style={styles.button}
                />
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: theme.spacing.lg,
    },
    button: {
        width: '100%',
    }
});
