import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { useSpeakStore } from '../../../../store/useSpeakStore';

interface Props {
    onSend: (text?: string) => void;
}

export const SpeakSuggestions: React.FC<Props> = ({ onSend }) => {
    const theme = useAppTheme();
    const suggestions = useSpeakStore(state => state.suggestions);
    const isLoading = useSpeakStore(state => state.isLoading);

    if (!suggestions || suggestions.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.wrapContent}>
                {suggestions.map((suggestion, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.suggestionButton, { borderColor: theme.colors.primary, backgroundColor: theme.colors.surface }]}
                        onPress={() => onSend(suggestion)}
                        disabled={isLoading}
                    >
                        <Text style={[styles.suggestionText, { color: theme.colors.primary }]}>{suggestion}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 4,
    },
    wrapContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 8,
        gap: 6,
        justifyContent: 'center',
    },
    suggestionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    suggestionText: {
        fontFamily: 'Nunito-Bold',
        fontSize: 12,
    },
});
