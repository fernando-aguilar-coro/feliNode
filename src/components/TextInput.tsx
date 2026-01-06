import React from 'react';
import { TextInput as RNTextInput, View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
}

export const TextInput = ({
    value,
    onChangeText,
    placeholder,
    label,
    error
}: TextInputProps) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <RNTextInput
                style={[styles.input, error ? styles.inputError : null]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        padding: theme.spacing.md,
        fontSize: 16,
        color: theme.colors.text,
        backgroundColor: theme.colors.surface,
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    errorText: {
        marginTop: theme.spacing.xs,
        fontSize: 12,
        color: theme.colors.error,
    },
});
