import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppTheme } from '../../../../theme/ThemeContext';
import Animated, { 
    SlideInDown, 
    useSharedValue, 
    useAnimatedStyle, 
    withSequence, 
    withTiming, 
    withRepeat, 
    interpolateColor 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface ShopItemCardProps {
    name: string;
    description: string;
    cost?: number;
    costText?: string;
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
    cost = 0,
    costText,
    icon,
    onPress,
    disabled = false,
    michiCoins,
    buying,
    delay,
    statusText
}) => {
    const theme = useAppTheme();
    
    // If it's an IAP (costText is present), we don't check michiCoins balance for affordability
    const canAfford = costText ? true : michiCoins >= cost;
    
    // Animations for "error" feedback
    const shakeX = useSharedValue(0);
    const errorProgress = useSharedValue(0);

    const triggerErrorEffect = () => {
        // Haptic feedback
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        
        // Shake sequence
        shakeX.value = withSequence(
            withTiming(-8, { duration: 50 }),
            withRepeat(withTiming(8, { duration: 100 }), 3, true),
            withTiming(0, { duration: 50 })
        );

        // Flash red sequence
        errorProgress.value = withSequence(
            withTiming(1, { duration: 200 }),
            withTiming(0, { duration: 800 })
        );
    };

    const handlePress = () => {
        if (buying || disabled) return;
        
        if (!canAfford) {
            triggerErrorEffect();
            return;
        }
        
        onPress();
    };

    const animatedCardStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            errorProgress.value,
            [0, 1],
            [theme.colors.surface || '#FFF', '#FFEBEB']
        );
        
        const borderColor = interpolateColor(
            errorProgress.value,
            [0, 1],
            [theme.colors.border || '#DDD', '#FF3B30']
        );

        return {
            transform: [{ translateX: shakeX.value }],
            backgroundColor,
            borderColor,
            borderWidth: 1,
            borderRadius: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 2,
        };
    });

    const isDisabled = disabled || buying; // For IAP, we only care if it's disabled or already buying

    return (
        <Animated.View 
            entering={SlideInDown.delay(delay).springify()}
            style={animatedCardStyle}
        >
            <Pressable 
                onPress={handlePress}
                style={({ pressed }) => [
                    styles.itemCard,
                    { opacity: (pressed && !isDisabled && canAfford) ? 0.9 : 1 }
                ]}
            >
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
                    style={[
                        styles.buyButton, 
                        (isDisabled || (!costText && !canAfford)) && styles.buyButtonDisabled
                    ]}
                    onPress={handlePress}
                    disabled={buying || disabled} 
                >
                    {!costText && <FontAwesome5 name="coins" size={12} color="#FFF" />}
                    <Text style={styles.buyText}>{costText || cost}</Text>
                </TouchableOpacity>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    itemCard: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    itemIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        flexShrink: 0,
    },
    itemDetails: {
        flex: 1,
        marginRight: 8,
        justifyContent: 'center',
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
        justifyContent: 'center',
        backgroundColor: '#FFBA08',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 24,
        gap: 4,
        minWidth: 80,
        flexShrink: 0,
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
        fontSize: 14,
        textAlign: 'center',
    },
});
