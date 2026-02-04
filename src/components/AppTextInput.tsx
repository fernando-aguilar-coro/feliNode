import React, { useMemo } from 'react';
import {
    View,
    TextInput,
    TextInputProps,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { AppText } from './AppText';

interface AppTextInputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const AppTextInput: React.FC<AppTextInputProps> = ({
    label,
    error,
    style,
    ...props
}) => {
    const theme = useAppTheme();

    const styles = useMemo(() => ({
        container: {
            marginBottom: theme.spacing.md,
        },
        label: {
            marginBottom: theme.spacing.xs,
        },
        input: {
            height: 48,
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            paddingHorizontal: theme.spacing.md,
            fontSize: theme.typography.fontSizes.md,
            color: theme.colors.text,
        },
        inputError: {
            borderColor: theme.colors.error,
        },
        error: {
            marginTop: theme.spacing.xs,
        },
    }), [theme]);

    return (
        <View style={styles.container}>
            {label && (
                <AppText variant="sm" weight="medium" style={styles.label} color={theme.colors.textSecondary}>
                    {label}
                </AppText>
            )}
            <TextInput
                style={[
                    styles.input,
                    error && styles.inputError,
                    style,
                ]}
                placeholderTextColor={theme.colors.textLight}
                {...props}
            />
            {error && (
                <AppText variant="xs" color={theme.colors.error} style={styles.error}>
                    {error}
                </AppText>
            )}
        </View>
    );
};
