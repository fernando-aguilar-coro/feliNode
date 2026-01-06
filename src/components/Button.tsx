import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../theme';

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'success';
    loading?: boolean;
    disabled?: boolean;
}

export const Button = ({
    label,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false
}: ButtonProps) => {

    const backgroundColor = variant === 'outline' ? 'transparent' : theme.colors[variant];
    const textColor = variant === 'outline' ? theme.colors.primary : theme.colors.surface;

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor, borderColor: theme.colors.primary, borderWidth: variant === 'outline' ? 1 : 0 },
                disabled && styles.disabled
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <Text style={[styles.text, { color: textColor }]}>{label}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        fontWeight: '600',
        fontSize: 16,
    },
});
