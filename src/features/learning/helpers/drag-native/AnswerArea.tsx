
import React, { useMemo, useRef } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { AppText } from '../../../../components';
import { SortableDraggableWord } from './SortableDraggableWord';

interface AnswerAreaProps {
    selectedWords: string[];
    onRemove: (index: number) => void;
    onReorder?: (fromIndex: number, toIndex: number) => void;
    theme: any;
    placeholder?: string;
    containerStyle?: ViewStyle;
}

export const AnswerArea = ({
    selectedWords,
    onRemove,
    onReorder,
    theme,
    placeholder = "Tu respuesta aparecerá aquí...",
    containerStyle
}: AnswerAreaProps) => {
    // Use standard ref for JS thread measurement
    const containerRef = useRef<View>(null);
    const itemLayouts = useRef<{ [key: number]: { x: number, y: number, width: number, height: number } }>({});

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            minHeight: 120,
            backgroundColor: theme.colors.background,
            borderRadius: 12,
            padding: theme.spacing.md,
            marginBottom: theme.spacing.xl,
            alignItems: 'center',
            borderWidth: 2,
            borderColor: theme.colors.border,
            borderStyle: 'dashed',
            justifyContent: 'flex-start',
        },
        placeholder: {
            color: theme.colors.textLight,
            fontStyle: 'italic',
            width: '100%',
            textAlign: 'center',
            position: 'absolute',
        },
    }), [theme]);

    const handleDrop = (fromIndex: number, absoluteX: number, absoluteY: number) => {
        if (!onReorder) return;

        containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
            const relativeX = absoluteX - pageX;
            const relativeY = absoluteY - pageY;

            // Check if drop is within container bounds (with some buffer)
            const buffer = 50;
            if (
                absoluteX < pageX - buffer ||
                absoluteX > pageX + width + buffer ||
                absoluteY < pageY - buffer ||
                absoluteY > pageY + height + buffer
            ) {
                // Return to original position (handled by SortableDraggableWord visual snap back)
                return;
            }

            let closestIndex = -1;
            let minDistance = Number.MAX_VALUE;
            const layouts = itemLayouts.current;

            // Iterate through valid indices
            for (let i = 0; i < selectedWords.length; i++) {
                const layout = layouts[i];
                if (!layout) continue;

                const centerX = layout.x + layout.width / 2;
                const centerY = layout.y + layout.height / 2;

                const dist = Math.sqrt(Math.pow(relativeX - centerX, 2) + Math.pow(relativeY - centerY, 2));

                if (dist < minDistance) {
                    minDistance = dist;
                    closestIndex = i;
                }
            }

            // If we found a valid drop target that is different from source
            if (closestIndex !== -1 && closestIndex !== fromIndex) {
                onReorder(fromIndex, closestIndex);
            }
        });
    };

    return (
        <View
            ref={containerRef}
            collapsable={false}
            style={[styles.container, containerStyle]}
        >
            {selectedWords.length === 0 && (
                <AppText style={styles.placeholder}>
                    {placeholder}
                </AppText>
            )}
            {selectedWords.map((word, index) => (
                <View
                    key={`answer-word-${index}`}
                    onLayout={(e) => {
                        itemLayouts.current[index] = e.nativeEvent.layout;
                    }}
                    // Ensure the wrapper doesn't collapse or affect layout unexpectedly
                    style={{ zIndex: 1 }}
                >
                    <SortableDraggableWord
                        word={word}
                        index={index}
                        onPress={() => onRemove(index)}
                        onDrop={handleDrop}
                        theme={theme}
                    />
                </View>
            ))}
        </View>
    );
};
