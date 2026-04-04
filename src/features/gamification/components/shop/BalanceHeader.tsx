import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppTheme } from '../../../../theme/ThemeContext';

interface BalanceHeaderProps {
    xp: number;
    michiCoins: number;
}

export const BalanceHeader: React.FC<BalanceHeaderProps> = ({ xp, michiCoins }) => {
    const theme = useAppTheme();
    return (
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.balancePill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <FontAwesome5 name="star" size={18} color="#FFD700" solid />
                <Text style={[styles.balanceText, { color: theme.colors.text }]}>{xp} XP</Text>
            </View>
            <View style={[styles.balancePill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <FontAwesome5 name="coins" size={18} color="#FFBA08" />
                <Text style={[styles.balanceText, { color: theme.colors.text }]}>{michiCoins}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    balancePill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        gap: 8,
        minWidth: 100,
        justifyContent: 'center',
    },
    balanceText: {
        fontSize: 16,
        fontFamily: 'Nunito-Bold',
    },
});
