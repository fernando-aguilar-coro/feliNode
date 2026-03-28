import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { AppText } from '../../../components';

interface PairsComboChipProps {
    combo: number;
    color: string;
}

const getComboEmoji = (combo: number): string => {
    if (combo >= 7) return '💎';
    if (combo >= 5) return '🔥';
    if (combo >= 3) return '⚡';
    return '✨';
};

export const PairsComboChip: React.FC<PairsComboChipProps> = ({ combo, color }) => {
    const scale = useRef(new Animated.Value(0.3)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (combo < 2) {
            opacity.setValue(0);
            return;
        }
        // Reset and pop in
        scale.setValue(0.3);
        opacity.setValue(0);

        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
                damping: 6,
                stiffness: 160,
            }),
            Animated.timing(opacity, {
                toValue: 0.7, // Semi-transparent appearance
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Wait ~0.5s then disappear completely
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                delay: 100,
                useNativeDriver: true,
            }).start();
        });
    }, [combo]);

    const isMilestone = combo > 0 && (combo % 5 === 0 || combo % 7 === 0);
    if (!isMilestone) return null;

    const emoji = getComboEmoji(combo);

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.overlay,
                { transform: [{ scale }], opacity },
            ]}
        >
            <AppText style={[styles.comboText, { color }]}>
                {emoji} ×{combo}
            </AppText>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    comboText: {
        fontSize: 64,
        fontWeight: '900',
        textShadowColor: 'rgba(0,0,0,0.25)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
});
