
import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { WordBubble } from './WordBubble';

interface WordBankProps {
    words: string[];
    selectedIndices: number[];
    onSelect: (index: number) => void;
    theme: any;
    containerStyle?: ViewStyle;
}

export const WordBank = ({
    words,
    selectedIndices,
    onSelect,
    theme,
    containerStyle
}: WordBankProps) => {

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: theme.spacing.md,
        },
    }), [theme]);

    return (
        <View style={[styles.container, containerStyle]}>
            {words.map((word, index) => (
                <WordBubble
                    key={`bank-word-${index}`}
                    word={word}
                    isSelected={selectedIndices.includes(index)}
                    onPress={() => onSelect(index)}
                    theme={theme}
                />
            ))}
        </View>
    );
};
