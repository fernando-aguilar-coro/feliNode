import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../../store/UserStore';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const ShopFloatingButton = () => {
    const navigation = useNavigation<any>();
    const { isAuthenticated } = useUserStore();

    // Animation values
    const scale = useSharedValue(1);

    useEffect(() => {
        // Gentle pulse effect
        scale.value = withRepeat(
            withSequence(
                withTiming(1.08, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const currentRoute = useNavigationState(state => {
        if (!state) return null;
        let route: any = state.routes[state.index];
        while (route.state && route.state.index !== undefined) {
            route = route.state.routes[route.state.index];
        }
        return route.name;
    });

    const hiddenRoutes = [
        'ShopScreen',
        'Shop',
        'Settings',
        'LessonSession',
        'InfinityExercise',
        'InfinitySelectPairs',
        'Pronunciation',
        'SpeakMain'
    ];

    if (!isAuthenticated || (currentRoute && hiddenRoutes.includes(currentRoute))) return null;

    return (
        <AnimatedTouchableOpacity
            style={[styles.button, animatedStyle]}
            onPress={() => navigation.navigate('Home', { screen: 'ShopScreen' })}
            activeOpacity={0.8}
        >
            <Ionicons name="cart" size={28} color="#FFD700" />
        </AnimatedTouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 100,
        left: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(30, 30, 30, 0.95)', // Elegante oscuro traslúcido
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        zIndex: 9999,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 215, 0, 0.6)', // Borde dorado subtil
    },
});
