import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

interface AppTextProps extends TextProps {
    variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
    weight?: 'regular' | 'medium' | 'bold' | 'extraBold';
    color?: string;
    align?: TextStyle['textAlign'];
    children: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
    variant = 'md',
    weight = 'regular',
    color,
    align = 'left',
    style,
    children,
    ...props
}) => {
    const theme = useAppTheme();
    const fontSize = theme.typography.fontSizes[variant];
    const fontWeight = theme.typography.fontWeights[weight];
    const finalColor = color || theme.colors.text;

    return (
        <Text
            style={[
                {
                    fontSize,
                    fontWeight,
                    color: finalColor,
                    textAlign: align,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};
