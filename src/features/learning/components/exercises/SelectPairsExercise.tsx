import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SelectPairsExercise as SelectPairsExerciseType } from '../../types/exercise';
import { AppText } from '../../../../components';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { audioService } from '../../../settings/services/audio.service';
import { TtsService } from '../../services/Tts.service';
import { franc } from 'franc';

interface Props {
    exercise: SelectPairsExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

interface Item {
    id: string;
    text: string;
    pairId: number;
}

export const SelectPairsExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    const theme = useAppTheme();
    const [leftItems, setLeftItems] = useState<Item[]>([]);
    const [rightItems, setRightItems] = useState<Item[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
    const [errorIds, setErrorIds] = useState<[string, string] | null>(null);

    useEffect(() => {
        const newLeftItems: Item[] = [];
        const newRightItems: Item[] = [];
        exercise.pairs.forEach((pair, index) => {
            newLeftItems.push({ id: `l-${index}`, text: String(pair.left), pairId: index });
            newRightItems.push({ id: `r-${index}`, text: String(pair.right), pairId: index });
        });

        // Shuffle left and right independently
        setLeftItems(newLeftItems.sort(() => Math.random() - 0.5));
        setRightItems(newRightItems.sort(() => Math.random() - 0.5));

        setMatchedIds(new Set());
        setSelectedId(null);
        setErrorIds(null);
        onAnswer(''); // reset answer
    }, [exercise, onAnswer]);

    useEffect(() => {
        if (matchedIds.size > 0 && matchedIds.size === exercise.pairs.length * 2) {
            onAnswer('DONE');
        } else {
            onAnswer('');
        }
    }, [matchedIds.size, exercise.pairs.length, onAnswer]);

    const handlePress = (item: Item) => {
        if (matchedIds.has(item.id)) return; // already matched
        if (errorIds) return; // wait for error clear

        // Speak item text with Native TTS
        const language = franc(item.text);
        const lang = (language === 'spa' || language === 'ita') ? 'es-ES' : 'en-US';
        TtsService.speak(item.text, { forceNative: true, language: lang });

        if (selectedId === null) {
            setSelectedId(item.id);
        } else if (selectedId === item.id) {
            setSelectedId(null); // deselect
        } else {
            // Second item selected
            const allItems = [...leftItems, ...rightItems];
            const firstItem = allItems.find(i => i.id === selectedId)!;

            // Prevent selecting two from the same column if you want, 
            // but the pairId logic handles matching anyway. Left/right IDs start with l- and r-.
            if (firstItem.id.charAt(0) === item.id.charAt(0)) {
                // Selected another item from the same column. 
                // We'll just change the selection to this new one instead of erroring.
                setSelectedId(item.id);
                return;
            }

            const leftItem = firstItem.id.startsWith('l-') ? firstItem : item;
            const rightItem = firstItem.id.startsWith('r-') ? firstItem : item;

            const isMatch = exercise.pairs.some((p) => 
                String(p.left).trim().toLowerCase() === leftItem.text.trim().toLowerCase() && 
                String(p.right).trim().toLowerCase() === rightItem.text.trim().toLowerCase()
            );

            if (isMatch) {
                // Match
                setMatchedIds(prev => {
                    const next = new Set(prev);
                    next.add(firstItem.id);
                    next.add(item.id);
                    return next;
                });
                setSelectedId(null);
            } else {
                // No match
                audioService.playIncorrectSound();
                setErrorIds([selectedId, item.id]);
                setTimeout(() => {
                    setErrorIds(null);
                    setSelectedId(null);
                }, 1000);
            }
        }
    };

    const renderItem = (item: Item) => {
        const isMatched = matchedIds.has(item.id);
        const isSelected = selectedId === item.id;
        const isError = errorIds?.includes(item.id);

        let backgroundColor = theme.colors.surface;
        let borderColor = theme.colors.border;

        if (isMatched) {
            backgroundColor = theme.colors.success + '40';
            borderColor = theme.colors.success;
        } else if (isError) {
            backgroundColor = theme.colors.error + '40';
            borderColor = theme.colors.error;
        } else if (isSelected) {
            backgroundColor = theme.colors.primary + '40';
            borderColor = theme.colors.primary;
        }

        return (
            <TouchableOpacity
                key={item.id}
                style={[
                    styles.item,
                    { backgroundColor, borderColor, opacity: isMatched ? 0.5 : 1 }
                ]}
                onPress={() => handlePress(item)}
                disabled={isMatched}
            >
                <AppText
                    style={{
                        color: theme.colors.text,
                        textAlign: 'center'
                    }}
                >
                    {item.text}
                </AppText>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <AppText style={[styles.question, { color: theme.colors.text }]}>{exercise.question}</AppText>
            <View style={styles.columnsContainer}>
                <View style={styles.column}>
                    {leftItems.map(renderItem)}
                </View>
                <View style={styles.column}>
                    {rightItems.map(renderItem)}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    question: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    columnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    column: {
        flex: 1,
        gap: 12,
        marginHorizontal: 6,
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        width: '100%',
        alignItems: 'center',
    },
});
