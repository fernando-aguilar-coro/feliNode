
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { AppText } from '../../../../components';

interface WordBubbleProps {
    word: string;
    isSelected?: boolean;
    onPress?: () => void;
    theme: any;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
}

export const WordBubble = ({
    word,
    isSelected = false,
    onPress,
    theme,
    containerStyle,
    textStyle
}: WordBubbleProps) => {

    const styles = useMemo(() => StyleSheet.create({
        container: {
            backgroundColor: isSelected ? theme.colors.background : theme.colors.surface,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 16,
            margin: 6,
            borderWidth: 1,
            borderColor: isSelected ? theme.colors.background : theme.colors.border,
            // No shadow/elevation for selected (ghost) state, minimal for normal
            ...(!isSelected && {
                shadowColor: theme.colors.text,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2
            })
        },
        text: {
            fontSize: theme.typography.fontSizes.md,
            fontWeight: '500',
            color: isSelected ? 'transparent' : theme.colors.text,
        }
    }), [theme, isSelected]);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            disabled={isSelected}
            style={[styles.container, containerStyle]}
        >
            <AppText style={[styles.text, textStyle]}>{word}</AppText>
        </TouchableOpacity>
    );
};
