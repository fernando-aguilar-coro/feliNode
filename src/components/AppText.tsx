import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { theme } from '../theme';

interface AppTextProps extends TextProps {
    variant?: keyof typeof theme.typography.fontSizes;
    weight?: keyof typeof theme.typography.fontWeights;
    color?: string;
    align?: TextStyle['textAlign'];
    children: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
    variant = 'md',
    weight = 'regular',
    color = theme.colors.text,
    align = 'left',
    style,
    children,
    ...props
}) => {
    const fontSize = theme.typography.fontSizes[variant];
    const fontWeight = theme.typography.fontWeights[weight];

    return (
        <Text
            style={[
                {
                    fontSize,
                    fontWeight,
                    color,
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
