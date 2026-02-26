import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useStreak } from '../hooks/useStreak';

export const StreakBadge = () => {
    const { streak, loading } = useStreak();

    if (loading) return null;

    const isActive = streak.current_streak > 0;

    return (
        <View style={[styles.container, isActive ? styles.activeContainer : styles.inactiveContainer]}>
            <FontAwesome5 name="fire" size={16} color={isActive ? "#FFA500" : "#B0B0B0"} />
            <Text style={[styles.text, isActive ? styles.activeText : styles.inactiveText]}>
                {streak.current_streak}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    activeContainer: {
        backgroundColor: '#FFF4E5',
        borderWidth: 1,
        borderColor: '#FFDCA8',
    },
    inactiveContainer: {
        backgroundColor: '#F0F0F0',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    text: {
        marginLeft: 6,
        fontFamily: 'Nunito-Bold', // Assuming Nuito-Bold is standard for FeliNode based on other files
        fontSize: 14,
    },
    activeText: {
        color: '#FF8C00',
    },
    inactiveText: {
        color: '#A0A0A0',
    }
});
