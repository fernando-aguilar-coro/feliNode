import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../../components';

interface PairsLevelUpBannerProps {
    roundNum: number;
    color: string;
}

export const PairsLevelUpBanner: React.FC<PairsLevelUpBannerProps> = ({ roundNum, color }) => {
    const translateY = useRef(new Animated.Value(-60)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 12, stiffness: 120 }),
            Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View
            pointerEvents="none"
            style={[styles.banner, { backgroundColor: color }, { transform: [{ translateY }], opacity }]}
        >
            <Ionicons name="trophy" size={20} color="#fff" />
            <AppText style={styles.text}>¡Ronda {roundNum}!</AppText>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    banner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 8,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
