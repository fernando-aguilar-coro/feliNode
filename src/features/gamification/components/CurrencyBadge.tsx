import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCurrencies } from '../hooks/useCurrencies';
import { useFocusEffect } from '@react-navigation/native';

export const CurrencyBadge = () => {
    const { currencies, loading, loadCurrencies } = useCurrencies();
    const navigation: any = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            loadCurrencies();
        }, [loadCurrencies])
    );

    if (loading) return null;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('Main', { screen: 'Shop' })}
        >
            <View style={styles.badgeSection}>
                <FontAwesome5 name="star" size={16} color="#FFD700" solid />
                <Text style={styles.text}>{currencies.xp} XP</Text>
            </View>
            <View style={styles.badgeSection}>
                <FontAwesome5 name="coins" size={16} color="#FFBA08" />
                <Text style={styles.text}>{currencies.michi_coins}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 16,
        marginLeft: 8,
        backgroundColor: '#FFF8E1',
        borderWidth: 1,
        borderColor: '#FFE082',
        gap: 8,
    },
    badgeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    text: {
        fontFamily: 'Nunito-Bold',
        fontSize: 14,
        color: '#F57F17',
    }
});
