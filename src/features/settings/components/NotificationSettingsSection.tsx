import React from 'react';
import { List, Switch, Button } from 'react-native-paper';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useSettingsStore } from '../../../store/SettingsStore';
import { NotificationService } from '../../../services/Notification.service';

export const NotificationSettingsSection = () => {
    const theme = useAppTheme();
    const showStreak = useSettingsStore(state => state.showStreak);
    const setShowStreak = useSettingsStore(state => state.setShowStreak);

    return (
        <List.Section>
            <List.Subheader style={{ color: theme.colors.textSecondary }}>Notificaciones</List.Subheader>
            <List.Item
                title="Mostrar Racha"
                titleStyle={{ color: theme.colors.text }}
                description="Ver contador de días seguidos"
                descriptionStyle={{ color: theme.colors.textSecondary }}
                left={props => <List.Icon {...props} icon="fire" color={theme.colors.text} />}
                right={() => <Switch value={showStreak} onValueChange={setShowStreak} />}
            />
            <Button 
                mode="text" 
                onPress={() => NotificationService.triggerTestNotification()}
                style={{ alignSelf: 'flex-start', marginLeft: 8 }}
                textColor={theme.colors.primary}
            >
                Probar Notificación 🔔
            </Button>
        </List.Section>
    );
};
