import React, { useState, useEffect } from 'react';
import { List } from 'react-native-paper';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { NotificationService } from '../../../services/Notification.service';
import { AppState, AppStateStatus, Linking } from 'react-native';

export const NotificationSettingsSection = () => {
    const theme = useAppTheme();
    const { t } = useTranslation();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const checkStatus = () => {
        NotificationService.checkPermissions().then(setNotificationsEnabled);
    };

    useEffect(() => {
        checkStatus();

        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active') {
                checkStatus();
            }
        });

        return () => subscription.remove();
    }, []);

    const handlePress = async () => {
        if (!notificationsEnabled) {
            const granted = await NotificationService.requestPermissions();
            if (granted) {
                setNotificationsEnabled(true);
            } else {
                Linking.openSettings();
            }
        } else {
            Linking.openSettings();
        }
    };

    return (
        <List.Section>
            <List.Subheader style={{ color: theme.colors.textSecondary }}>{t('settings.notifications.title')}</List.Subheader>
            <List.Item
                title={t('settings.notifications.statusLabel')}
                titleStyle={{ color: theme.colors.text }}
                description={notificationsEnabled 
                    ? t('settings.notifications.enabledDesc') 
                    : t('settings.notifications.disabledDesc')
                }
                descriptionStyle={{ color: theme.colors.textSecondary }}
                left={props => (
                    <List.Icon 
                        {...props} 
                        icon={notificationsEnabled ? "bell-check" : "bell-off"} 
                        color={notificationsEnabled ? theme.colors.primary : theme.colors.error} 
                    />
                )}
                right={props => (
                    <List.Icon 
                        {...props} 
                        icon={notificationsEnabled ? "cog" : "bell-plus"} 
                        color={theme.colors.textSecondary} 
                    />
                )}
                onPress={handlePress}
            />
        </List.Section>
    );
};




