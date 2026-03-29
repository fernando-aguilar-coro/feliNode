import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';

interface Props {
    current: number;
    total: number;
    /** If provided, shows a lives badge with a heart icon. */
    lives?: number;
    /** If provided, shows a combo indicator. */
    combo?: number;
    /** Called when the close/exit button is pressed. */
    onExit?: () => void;
}

export const ProgressBar = ({ current, total, lives, combo, onExit }: Props) => {
    const theme = useAppTheme();
    // Ensure we don't divide by zero and clamp percentage between 0 and 100
    const percentage = Math.min(Math.max((current / total) * 100, 0), 100);
    const widthAnim = useRef(new Animated.Value(0)).current;

    // Heart shake animation for when lives decrease
    const heartShake = useRef(new Animated.Value(0)).current;
    const prevLivesRef = useRef(lives);

    useEffect(() => {
        Animated.timing(widthAnim, {
            toValue: percentage,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [percentage]);

    // Trigger shake when lives decrease
    useEffect(() => {
        if (lives !== undefined && prevLivesRef.current !== undefined && lives < prevLivesRef.current) {
            Animated.sequence([
                Animated.timing(heartShake, { toValue: 8, duration: 60, useNativeDriver: true }),
                Animated.timing(heartShake, { toValue: -8, duration: 60, useNativeDriver: true }),
                Animated.timing(heartShake, { toValue: 6, duration: 50, useNativeDriver: true }),
                Animated.timing(heartShake, { toValue: -6, duration: 50, useNativeDriver: true }),
                Animated.timing(heartShake, { toValue: 0, duration: 40, useNativeDriver: true }),
            ]).start();
        }
        prevLivesRef.current = lives;
    }, [lives]);

    const widthInterpolated = widthAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    const styles = useMemo(() => StyleSheet.create({
        wrapper: {
            gap: 6,
            paddingVertical: theme.spacing.xs,
        },
        topRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        leftSection: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        closeButton: {
            padding: 4,
            marginRight: 8,
        },
        livesBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.error + '18',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
        },
        comboBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.primary + '18',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
        },
        progressText: {
            fontSize: 12,
            color: theme.colors.secondary,
        },
        trackContainer: {
            height: 8,
            width: '100%',
        },
        track: {
            flex: 1,
            backgroundColor: theme.colors.border,
            borderRadius: 4,
            overflow: 'hidden',
        },
        fill: {
            height: '100%',
            backgroundColor: theme.colors.primary,
            borderRadius: 4,
        },
    }), [theme]);

    const showHeader = lives !== undefined || onExit;

    return (
        <View style={styles.wrapper}>
            {showHeader && (
                <View style={styles.topRow}>
                    <View style={styles.leftSection}>
                        {onExit && (
                            <TouchableOpacity onPress={onExit} style={styles.closeButton}>
                                <Ionicons name="close" size={26} color={theme.colors.text} />
                            </TouchableOpacity>
                        )}

                        {lives !== undefined && (
                            <Animated.View style={[styles.livesBadge, { transform: [{ translateX: heartShake }] }]}>
                                <Ionicons name="heart" size={15} color={theme.colors.error} />
                                <Spacer width={5} />
                                <AppText weight="bold" style={{ color: theme.colors.error, fontSize: 13 }}>
                                    {lives}
                                </AppText>
                            </Animated.View>
                        )}
                    </View>

                    <View style={styles.leftSection}>
                        {combo !== undefined && combo >= 2 && (
                            <View style={styles.comboBadge}>
                                <Ionicons name="flame" size={14} color={theme.colors.primary} />
                                <Spacer width={4} />
                                <AppText weight="bold" style={{ color: theme.colors.primary, fontSize: 13 }}>
                                    ×{combo}
                                </AppText>
                            </View>
                        )}

                        <Spacer width={8} />

                        <AppText style={styles.progressText}>
                            {current}/{total}
                        </AppText>
                    </View>
                </View>
            )}

            <View style={styles.trackContainer}>
                <View style={styles.track}>
                    <Animated.View
                        style={[
                            styles.fill,
                            {
                                width: widthInterpolated,
                            },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};
