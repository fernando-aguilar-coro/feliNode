import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
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
    const theme = useAppTheme();

    const getVariantStyles = (v: string) => {
        switch (v) {
            case 'primary':
                return {
                    backgroundColor: theme.colors.primary,
                    borderColor: 'transparent',
                    textColor: theme.colors.white,
                };
            case 'secondary':
                return {
                    backgroundColor: theme.colors.secondary,
                    borderColor: 'transparent',
                    textColor: theme.colors.white,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderColor: theme.colors.primary,
                    textColor: theme.colors.primary,
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    textColor: theme.colors.text,
                };
            default:
                return {
                    backgroundColor: theme.colors.primary,
                    borderColor: 'transparent',
                    textColor: theme.colors.white,
                };
        }
    };

    const variantStyles = getVariantStyles(variant);
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
                    paddingHorizontal: theme.spacing.md,
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

const styles = StyleSheet.create({
    button: {
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        textAlign: 'center',
    },
});
