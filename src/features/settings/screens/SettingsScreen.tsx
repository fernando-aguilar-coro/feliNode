import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import {
    AudioSettingsSection,
    LearningSettingsSection,
    InterfaceSettingsSection,
    NotificationSettingsSection,
    AccountSettingsSection
} from '../components';

export const SettingsScreen = () => {
    const theme = useAppTheme();
    const { t } = useTranslation();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.text }]}>{t('settings.title')}</Text>

                <AudioSettingsSection />
                <Divider style={{ backgroundColor: theme.colors.border }} />

                <LearningSettingsSection />
                <Divider style={{ backgroundColor: theme.colors.border }} />

                <InterfaceSettingsSection />
                <Divider style={{ backgroundColor: theme.colors.border }} />

                <NotificationSettingsSection />
                <Divider style={{ backgroundColor: theme.colors.border }} />

                <AccountSettingsSection />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        padding: 16,
        paddingBottom: 0,
        fontWeight: 'bold',
    },
    content: {
        paddingBottom: 20,
    },
});
