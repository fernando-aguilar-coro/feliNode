import React, { ReactNode } from 'react';
import { StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withDecay } from 'react-native-reanimated';


// Basic props for the PannableCanvas
interface PannableCanvasProps {
    children: ReactNode;
    width: number;
    height: number;
    initialX?: number;
    initialY?: number;
}

export interface PannableCanvasRef {
    reset: () => void;
}

const clamp = (val: number, min: number, max: number) => {
    'worklet';
    return Math.min(Math.max(val, min), max);
};
const sensitivity = 0.5;
/**
 * PannableCanvas
 * 
 * Provides an infinite-like canvas that supports panning and zooming.
 * Simplified based on user feedback to use basic Scale * Event.scale logic + Limits.
 * 
 * Key Architecture:
 * - Outer Viewport (handled by GestureDetector) must be STATIC in size/position.
 * - Inner Content View is where transforms (Scale, Translation) are applied.
 * - This ensures gestures are always detected even if content moves off-screen.
 */
export const PannableCanvas = React.forwardRef<PannableCanvasRef, PannableCanvasProps>(({
    children,
    width: canvasWidth,
    height: canvasHeight,
    initialX = 0,
    initialY = 0
}, ref) => {
    // 1. Shared Values
    const translationX = useSharedValue(initialX);
    const translationY = useSharedValue(initialY);
    const scale = useSharedValue(1);

    // State for gestures (matching user's provided pattern)
    const startScale = useSharedValue(1);
    const prevTranslationX = useSharedValue(initialX);
    const prevTranslationY = useSharedValue(initialY);

    // Zoom limits
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 4;

    // Expose reset to parent
    React.useImperativeHandle(ref, () => ({
        reset: () => {
            // Reset to initial values with animation
            // Cancel momentum might be needed if tracking ID, but updating values usually stops decay naturally
            // We set velocity to 0 effectively by overwriting value.

            translationX.value = initialX;
            translationY.value = initialY;
            scale.value = 1;

            // Reset saved state
            prevTranslationX.value = initialX;
            prevTranslationY.value = initialY;
            startScale.value = 1;
        }
    }));

    /**
     * Pan Gesture
     */
    const panGesture = Gesture.Pan()
        .minDistance(1)
        .onStart(() => {
            prevTranslationX.value = translationX.value;
            prevTranslationY.value = translationY.value;
        })
        .onUpdate((event) => {
            translationX.value = prevTranslationX.value + event.translationX * sensitivity;
            translationY.value = prevTranslationY.value + event.translationY * sensitivity;
        })
        .onEnd((event) => {
            // Momentum for natural feel
            translationX.value = withDecay({ velocity: event.velocityX * sensitivity, deceleration: 0.998 });
            translationY.value = withDecay({ velocity: event.velocityY * sensitivity, deceleration: 0.998 });
        });

    /**
     * Pinch Gesture
     */
    const pinchGesture = Gesture.Pinch()
        .onStart(() => {
            startScale.value = scale.value;
        })
        .onUpdate((event) => {
            // Apply sensitivity to the delta scale (deviation from 1)
            const scaleDelta = event.scale - 1;
            const dampenedScale = 1 + scaleDelta * sensitivity;

            scale.value = clamp(
                startScale.value * dampenedScale,
                MIN_SCALE,
                MAX_SCALE
            );
        });

    const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translationX.value },
                { translateY: translationY.value },
                { scale: scale.value },
            ],
        };
    });

    return (
        <GestureDetector gesture={composedGesture}>
            <Animated.View style={[
                styles.canvasContainer,
                { width: canvasWidth, height: canvasHeight, overflow: 'hidden' }
            ]}>
                {/* The Content moves inside the static viewport */}
                <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                    {children}
                </Animated.View>
            </Animated.View>
        </GestureDetector>
    );
});

const styles = StyleSheet.create({
    canvasContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    }
});
