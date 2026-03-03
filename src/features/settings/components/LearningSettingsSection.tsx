import React from 'react';
import { List } from 'react-native-paper';
import { useAppTheme } from '../../../theme/ThemeContext';

export const LearningSettingsSection = () => {
    const theme = useAppTheme();

    return (
        <List.Section>
            <List.Subheader style={{ color: theme.colors.textSecondary }}>Aprendizaje</List.Subheader>
            <List.Item
                title="Idioma de la Interfaz"
                titleStyle={{ color: theme.colors.text }}
                description="Español"
                descriptionStyle={{ color: theme.colors.textSecondary }}
                left={props => <List.Icon {...props} icon="translate" color={theme.colors.text} />}
                onPress={() => { }}
            />
        </List.Section>
    );
};
