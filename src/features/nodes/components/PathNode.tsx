import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Canvas, Circle, Group } from '@shopify/react-native-skia';
import { useAppTheme } from '../../../theme/ThemeContext';
import { PATH_CONSTANTS } from '../hooks/usePathLayout';

interface PathNodeProps {
    lesson: {
        id: string;
        title: string;
        status: 'available' | 'completed' | 'current';
    };
    onPress: (id: string) => void;
}

const { ITEM_HEIGHT } = PATH_CONSTANTS;

export const PathNode = ({ lesson, onPress }: PathNodeProps) => {
    const theme = useAppTheme();
    const status = lesson.status;
    const isCurrent = status === 'current';

    // Pulsation animation using native Animated
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!isCurrent) return;

        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.25,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );

        loop.start();
        return () => loop.stop();
    }, [isCurrent, pulseAnim]);

    const getConfig = () => {
        switch (status) {
            case 'completed':
                return { color: theme.colors.primary, size: 32 };
            case 'current':
                return { color: theme.colors.primary, size: 38 };
            default:
                return { color: theme.dark ? '#333' : '#E0E0E0', size: 32 };
        }
    };

    const config = getConfig();
    const canvasSize = 100;
    const cx = canvasSize / 2;
    const cy = canvasSize / 2;

    return (
        <TouchableOpacity
            style={styles.nodeContainer}
            onPress={() => onPress(lesson.id)}
            activeOpacity={0.75}
        >
            {/* Container for the Circle and Pulse */}
            <View style={styles.circleContainer}>
                {isCurrent && (
                    <Animated.View
                        style={[
                            styles.pulseRing,
                            {
                                borderColor: theme.colors.primary,
                                transform: [{ scale: pulseAnim }],
                                opacity: pulseAnim.interpolate({
                                    inputRange: [1, 1.25],
                                    outputRange: [0.6, 0]
                                })
                            },
                        ]}
                    />
                )}

                <Canvas style={{ width: canvasSize, height: canvasSize }} pointerEvents="none">
                    <Group>
                        <Circle
                            cx={cx}
                            cy={cy}
                            r={config.size}
                            color={config.color}
                        />
                    </Group>
                </Canvas>
            </View>

            {/* Text Area */}
            <View style={styles.textContainer}>
                <Text
                    style={[
                        styles.title,
                        { color: theme.colors.text },
                        isCurrent && styles.currentTitle,
                    ]}
                    numberOfLines={3}
                >
                    {lesson.title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    nodeContainer: {
        alignItems: 'center',
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        width: 160,
    },
    circleContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    pulseRing: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
    },
    textContainer: {
        marginTop: 4,
        paddingHorizontal: 10,
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    currentTitle: {
        fontWeight: '800',
        fontSize: 14,
    },
});
