import React from 'react';
import { List } from 'react-native-paper';
import { useAppTheme, useThemeControl } from '../../../theme/ThemeContext';

export const InterfaceSettingsSection = () => {
    const theme = useAppTheme();
    const { isDark, toggleTheme } = useThemeControl();

    return (
        <List.Section>
            <List.Subheader style={{ color: theme.colors.textSecondary }}>Interfaz y Apariencia</List.Subheader>

            <List.Item
                title={isDark ? "Modo Oscuro" : "Modo Claro"} // Texto dinámico (opcional)
                titleStyle={{ color: theme.colors.text }}
                description="Toca para cambiar el tema"
                descriptionStyle={{ color: theme.colors.textSecondary }}

                // El icono de la izquierda cambia visualmente indicando el estado actual
                left={props => (
                    <List.Icon
                        {...props}
                        icon={isDark ? "weather-night" : "weather-sunny"}
                        color={isDark ? theme.colors.primary : theme.colors.text}
                    />
                )}

                // Icono derecho simple de "chevron" o nada
                right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.primary} />}

                // La acción ocurre al tocar toda la fila
                onPress={toggleTheme}
            />

            {/* ... resto de items ... */}
        </List.Section>
    );
};
