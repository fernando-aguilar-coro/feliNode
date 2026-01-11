import React from 'react';
import {
    View,
    TextInput,
    TextInputProps,
    StyleSheet,
} from 'react-native';
import { theme } from '../theme';
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
    return (
        <View style={styles.container}>
            {label && (
                <AppText variant="sm" weight="medium" style={styles.label}>
                    {label}
                </AppText>
            )}
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : null,
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

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    label: {
        marginBottom: theme.spacing.xs,
        color: theme.colors.textSecondary,
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
});
