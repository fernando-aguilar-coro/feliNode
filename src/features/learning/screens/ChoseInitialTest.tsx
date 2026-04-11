import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { Screen, AppText, AppButton, Spacer } from '../../../components';
import { theme } from '../../../theme';
import { useSettingsStore } from '../../../store/SettingsStore';

export const ChoseInitialTest = () => {
    const navigation = useNavigation<any>();
    const { setHasDecidedPlacementTest } = useSettingsStore();
    const { t } = useTranslation();

    const handleSelectTest = (lessonId: string) => {
        navigation.navigate('PlacementEvaluation', { lessonId });
    };

    return (
        <Screen style={styles.container}>
            <View style={styles.content}>
                <AppText variant="xxl" weight="bold" align="center">
                    {t('learning.choseInitialTest.title')}
                </AppText>
                <Spacer height={theme.spacing.lg} />
                <AppText variant="md" color={theme.colors.textSecondary} align="center">
                    {t('learning.choseInitialTest.subtitle')}
                </AppText>

                <Spacer height={theme.spacing.xl} />

                <AppButton
                    title={t('learning.choseInitialTest.startFromZero')}
                    onPress={() => setHasDecidedPlacementTest(true)}
                    variant="primary"
                    style={styles.button}
                />
                <Spacer height={theme.spacing.lg} />

                <AppText variant="sm" color={theme.colors.textSecondary} align="center">
                    {t('learning.choseInitialTest.orTakeLevelTest')}
                </AppText>
                <Spacer height={theme.spacing.md} />

                <AppButton
                    title={t('learning.choseInitialTest.levelA1')}
                    onPress={() => handleSelectTest('placement_test_a1')}
                    variant="outline"
                    style={styles.button}
                />
                <Spacer height={theme.spacing.md} />

                <AppButton
                    title={t('learning.choseInitialTest.levelA2')}
                    onPress={() => handleSelectTest('placement_test_a2')}
                    variant="outline"
                    style={styles.button}
                />
                <Spacer height={theme.spacing.md} />

                <AppButton
                    title={t('learning.choseInitialTest.levelB1')}
                    onPress={() => handleSelectTest('placement_test_b1')}
                    variant="outline"
                    style={styles.button}
                />
                <Spacer height={theme.spacing.md} />

                <AppButton
                    title={t('learning.choseInitialTest.levelB2')}
                    onPress={() => handleSelectTest('placement_test_b2')}
                    variant="outline"
                    style={styles.button}
                />
                <Spacer height={theme.spacing.md} />

                <AppButton
                    title={t('learning.choseInitialTest.levelC1')}
                    onPress={() => handleSelectTest('placement_test_c1')}
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
