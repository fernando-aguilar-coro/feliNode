import React, { useMemo } from 'react';
import {
    View,
    TextInput,
    TextInputProps,
    StyleSheet,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { AppText } from './AppText';

interface AppTextAreaProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const AppTextArea: React.FC<AppTextAreaProps> = ({
    label,
    error,
    style,
    ...props
}) => {
    const theme = useAppTheme();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            marginBottom: theme.spacing.md,
        },
        label: {
            marginBottom: theme.spacing.xs,
        },
        input: {
            minHeight: 100,
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 12,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            fontSize: 16,
            color: theme.colors.text,
            textAlignVertical: 'top', // Crucial for multiline Android
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
                multiline
                numberOfLines={props.numberOfLines || 4}
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
