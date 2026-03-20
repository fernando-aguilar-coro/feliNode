import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../../store/UserStore';

export const ShopFloatingButton = () => {
    const navigation = useNavigation<any>();
    const { isAuthenticated } = useUserStore();

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
        <TouchableOpacity
            style={[styles.button, { backgroundColor: '#FFD700' }]}
            onPress={() => navigation.navigate('Home', { screen: 'ShopScreen' })}
            activeOpacity={0.8}
        >
            <Ionicons name="cart" size={28} color="#000" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 100,
        left: 8,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 9999,
        opacity: 0.6,
    },
});
