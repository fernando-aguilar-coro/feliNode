
import React from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring
} from 'react-native-reanimated';
import { WordBubble } from './WordBubble';

interface SortableDraggableWordProps {
    word: string;
    index: number;
    onDrop: (index: number, absoluteX: number, absoluteY: number) => void;
    onPress: () => void;
    theme: any;
    disabled?: boolean;
}

export const SortableDraggableWord = ({
    word,
    index,
    onDrop,
    onPress,
    theme,
    disabled = false
}: SortableDraggableWordProps) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const isDragging = useSharedValue(false);
    const context = useSharedValue({ startX: 0, startY: 0 });

    const pan = Gesture.Pan()
        .enabled(!disabled)
        .onStart(() => {
            context.value = { startX: translateX.value, startY: translateY.value };
            isDragging.value = true;
        })
        .onUpdate((event) => {
            translateX.value = context.value.startX + event.translationX;
            translateY.value = context.value.startY + event.translationY;
        })
        .onEnd((event) => {
            isDragging.value = false;
            scheduleOnRN(onDrop, index, event.absoluteX, event.absoluteY);

            // Snap back visually - the parent will handle reordering the actual list
            translateX.value = withTiming(0, { duration: 200 });
            translateY.value = withTiming(0, { duration: 200 });
        });

    const tap = Gesture.Tap()
        .enabled(!disabled)
        .onEnd(() => {
            if (onPress) {
                scheduleOnRN(onPress);
            }
        });

    // Compose gestures: Pan takes precedence if dragging starts, but Tap fires if it's a quick touch without movement
    const composed = Gesture.Race(pan, tap);

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: withSpring(isDragging.value ? 1.1 : 1) },
            ],
            zIndex: isDragging.value ? 100 : 1,
            opacity: isDragging.value ? 0.8 : 1,
        };
    });

    return (
        <GestureDetector gesture={composed}>
            <Animated.View style={rStyle}>
                <WordBubble
                    word={word}
                    theme={theme}
                    // Pass empty onPress to WordBubble because we handle it in GestureDetector
                    // to avoid conflict or double handling
                    onPress={undefined}
                />
            </Animated.View>
        </GestureDetector>
    );
};
