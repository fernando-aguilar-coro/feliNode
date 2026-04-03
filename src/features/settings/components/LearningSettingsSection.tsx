import React from 'react';
import { List, Switch } from 'react-native-paper';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useSettingsStore } from '../../../store/SettingsStore';
import { useTranslation } from 'react-i18next';

export const LearningSettingsSection = () => {
    const theme = useAppTheme();
    const showStreak = useSettingsStore(state => state.showStreak);
    const setShowStreak = useSettingsStore(state => state.setShowStreak);
    const { t } = useTranslation();

    return (
        <List.Section>
            <List.Subheader style={{ color: theme.colors.textSecondary }}>{t('learning.title')}</List.Subheader>
            <List.Item
                title={t('learning.showStreak')}
                titleStyle={{ color: theme.colors.text }}
                description={t('learning.showStreakDesc')}
                descriptionStyle={{ color: theme.colors.textSecondary }}
                left={props => <List.Icon {...props} icon="fire" color={theme.colors.text} />}
                right={() => <Switch value={showStreak} onValueChange={setShowStreak} />}
            />
        </List.Section>
    );
};
