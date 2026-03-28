import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface PairsTimerTextProps {
    timeLeft: number;
    isLow: boolean;
    color: string;
}

export const PairsTimerText: React.FC<PairsTimerTextProps> = ({ timeLeft, isLow, color }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const animRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        if (animRef.current) animRef.current.stop();

        if (isLow) {
            animRef.current = Animated.loop(
                Animated.sequence([
                    Animated.timing(scale, { toValue: 1.2, duration: 350, useNativeDriver: true }),
                    Animated.timing(scale, { toValue: 1, duration: 350, useNativeDriver: true }),
                ]),
            );
            animRef.current.start();
        } else {
            Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }).start();
        }

        return () => { animRef.current?.stop(); };
    }, [isLow]);

    return (
        <Animated.Text
            pointerEvents="none"
            style={[{ fontWeight: 'bold', color, fontSize: 14 }, { transform: [{ scale }] }]}
        >
            {timeLeft}s
        </Animated.Text>
    );
};
