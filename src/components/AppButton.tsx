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
}

export const AppButton: React.FC<AppButtonProps> = ({
    title,
    variant = 'primary',
    loading = false,
    style,
    disabled,
    ...props
}) => {
    const getBackgroundColor = () => {
        if (variant === 'primary') return theme.colors.primary;
        if (variant === 'secondary') return theme.colors.secondary;
        return 'transparent';
    };

    const getTextColor = () => {
        if (variant === 'outline') return theme.colors.primary;
        if (variant === 'ghost') return theme.colors.text;
        return theme.colors.white;
    };

    const getBorderColor = () => {
        if (variant === 'outline') return theme.colors.primary;
        return 'transparent';
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    borderWidth: variant === 'outline' ? 1 : 0,
                    opacity: disabled || loading ? 0.6 : 1,
                },
                style,
            ]}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <AppText
                    variant="md"
                    weight="bold"
                    color={getTextColor()}
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
        paddingHorizontal: theme.spacing.md,
        flexDirection: 'row',
    },
    text: {
        textAlign: 'center',
    },
});
