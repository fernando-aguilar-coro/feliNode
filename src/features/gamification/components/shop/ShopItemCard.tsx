import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppTheme } from '../../../../theme/ThemeContext';
import Animated, { SlideInDown } from 'react-native-reanimated';

interface ShopItemCardProps {
    name: string;
    description: string;
    cost: number;
    icon: React.ReactNode;
    onPress: () => void;
    disabled?: boolean;
    michiCoins: number;
    buying: boolean;
    delay: number;
    statusText?: string;
}

export const ShopItemCard: React.FC<ShopItemCardProps> = ({
    name,
    description,
    cost,
    icon,
    onPress,
    disabled = false,
    michiCoins,
    buying,
    delay,
    statusText
}) => {
    const theme = useAppTheme();
    const canAfford = michiCoins >= cost;
    const isDisabled = disabled || buying || !canAfford;

    return (
        <Animated.View entering={SlideInDown.delay(delay).springify()}>
            <View style={[styles.itemCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={[styles.itemIconContainer, { backgroundColor: theme.colors.background }]}>
                    {icon}
                </View>
                <View style={styles.itemDetails}>
                    <Text style={[styles.itemName, { color: theme.colors.text }]}>{name}</Text>
                    <Text style={[styles.itemDescription, { color: theme.colors.textSecondary || '#888' }]}>
                        {description}
                    </Text>
                    {statusText && (
                        <Text style={[styles.itemLimit, { color: theme.colors.primary }]}>
                            {statusText}
                        </Text>
                    )}
                </View>
                <TouchableOpacity
                    style={[styles.buyButton, isDisabled && styles.buyButtonDisabled]}
                    onPress={onPress}
                    disabled={isDisabled}
                >
                    <FontAwesome5 name="coins" size={12} color="#FFF" />
                    <Text style={styles.buyText}>{cost}</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    itemCard: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    itemIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemDetails: {
        flex: 1,
        marginRight: 8,
    },
    itemName: {
        fontSize: 17,
        fontFamily: 'Nunito-Bold',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 13,
        fontFamily: 'Nunito-Regular',
        lineHeight: 18,
    },
    itemLimit: {
        fontSize: 12,
        fontFamily: 'Nunito-Bold',
        marginTop: 6,
    },
    buyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFBA08',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        gap: 6,
        shadowColor: '#FFBA08',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    buyButtonDisabled: {
        backgroundColor: '#CCC',
        shadowOpacity: 0,
        elevation: 0,
    },
    buyText: {
        color: '#FFF',
        fontFamily: 'Nunito-Bold',
        fontSize: 15,
    },
});
