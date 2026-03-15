import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/ThemeContext';

interface SpeakInputBarProps {
    value: string;
    onChangeText: (t: string) => void;
    onSend: () => void;
    disabled?: boolean;
}

export function SpeakInputBar({ value, onChangeText, onSend, disabled }: SpeakInputBarProps) {
    const theme = useAppTheme();
    const canSend = (value || '').trim().length > 0 && !disabled;

    return (
        <View style={[styles.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Escribe un mensaje…"
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onSend}
                returnKeyType="send"
                editable={!disabled}
                multiline
                maxLength={500}
            />
            <TouchableOpacity
                style={[styles.btn, { opacity: canSend ? 1 : 0.4 }]}
                onPress={onSend}
                disabled={!canSend}
                activeOpacity={0.8}
            >
                <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 6,
        gap: 8,
    },
    input: {
        flex: 1,
        fontFamily: 'Nunito-Regular',
        fontSize: 15,
        maxHeight: 90,
        paddingTop: 4,
        paddingBottom: 4,
    },
    btn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFBA08',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
