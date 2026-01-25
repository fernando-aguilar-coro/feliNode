import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';
import { theme } from '../theme';
import { AppText } from './AppText';

interface AppButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    loading?: boolean;
    textColor?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
    title,
    variant = 'primary',
    loading = false,
    textColor,
    style,
    disabled,
    ...props
}) => {
    const variantStyles = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: variantStyles.backgroundColor,
                    borderColor: variantStyles.borderColor,
                    borderWidth: variant === 'outline' ? 1 : 0,
                    opacity: isDisabled ? 0.6 : 1,
                },
                style,
            ]}
            disabled={isDisabled}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={textColor || variantStyles.textColor} />
            ) : (
                <AppText
                    variant="md"
                    weight="bold"
                    color={textColor || variantStyles.textColor}
                    style={styles.text}
                >
                    {title}
                </AppText>
            )}
        </TouchableOpacity>
    );
};

const BUTTON_VARIANTS = {
    primary: {
        backgroundColor: theme.colors.primary,
        borderColor: 'transparent',
        textColor: theme.colors.white,
    },
    secondary: {
        backgroundColor: theme.colors.secondary,
        borderColor: 'transparent',
        textColor: theme.colors.white,
    },
    outline: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary,
        textColor: theme.colors.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: theme.colors.text,
    },
};

const styles = StyleSheet.create({
    button: {
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        flexDirection: 'row',
    },
    text: {
        textAlign: 'center',
    },
});
