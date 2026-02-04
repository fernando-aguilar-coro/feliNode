import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    padding?: number;
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    padding, // Default handled in body to access theme
}) => {
    const theme = useAppTheme();

    // Check if padding was passed, else use theme default
    const finalPadding = padding ?? theme.spacing.md;

    const styles = useMemo(() => ({
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            // Shadow for iOS
            shadowColor: theme.colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            // Elevation for Android
            elevation: 3,
        },
    }), [theme]);

    return (
        <View
            style={[
                styles.card,
                { padding: finalPadding },
                style,
            ]}
        >
            {children}
        </View>
    );
};
