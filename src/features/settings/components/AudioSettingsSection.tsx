import React, { useState } from 'react';
import { List, Switch } from 'react-native-paper';
import { useAppTheme } from '../../../theme/ThemeContext';

export const AudioSettingsSection = () => {
    const theme = useAppTheme();
    // Mock state
    const [sfxEnabled, setSfxEnabled] = useState(true);

    return (
        <List.Section>
            <List.Subheader style={{ color: theme.colors.textSecondary }}>Audio</List.Subheader>
            <List.Item
                title="Velocidad de voz (TTS)"
                titleStyle={{ color: theme.colors.text }}
                description="Normal"
                descriptionStyle={{ color: theme.colors.textSecondary }}
                left={props => <List.Icon {...props} icon="speedometer" color={theme.colors.text} />}
                onPress={() => console.log('TODO: Change TTS Speed')}
            />
            <List.Item
                title="Efectos de sonido"
                titleStyle={{ color: theme.colors.text }}
                left={props => <List.Icon {...props} icon="volume-high" color={theme.colors.text} />}
                right={() => <Switch value={sfxEnabled} onValueChange={setSfxEnabled} />}
            />
            <List.Item
                title="Voz"
                titleStyle={{ color: theme.colors.text }}
                description="Seleccionar voz del narrador"
                descriptionStyle={{ color: theme.colors.textSecondary }}
                left={props => <List.Icon {...props} icon="account-voice" color={theme.colors.text} />}
                onPress={() => console.log('TODO: Select Voice')}
            />
        </List.Section>
    );
};
