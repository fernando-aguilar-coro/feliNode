import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppText } from '../../../../components';
import { useAppTheme } from '../../../../theme/ThemeContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export type PracticeCardVariant = 'full' | 'compact';

export interface PracticeCardProps {
    /** Icon name from Ionicons */
    iconName: React.ComponentProps<typeof Ionicons>['name'];
    /** Custom icon background color (hex). Defaults to primary+15 */
    iconColor?: string;
    iconBgColor?: string;
    title: string;
    description?: string;
    /** Record score to display (optional) */
    score?: number;
    scoreLabel?: string;
    onPress: () => void;
    /** 'full' = horizontal row layout (PracticeLandingScreen)
     *  'compact' = vertical stacked layout (ContinueWhereLeftOff) */
    variant?: PracticeCardVariant;
    /** Reanimated FadeInDown delay in ms */
    animDelay?: number;
    style?: ViewStyle;
}

export const PracticeCard: React.FC<PracticeCardProps> = ({
    iconName,
    iconColor,
    iconBgColor,
    title,
    description,
    score,
    scoreLabel,
    onPress,
    variant = 'full',
    animDelay = 0,
    style,
}) => {
    const theme = useAppTheme();

    const resolvedIconColor = iconColor ?? theme.colors.primary;
    const resolvedIconBgColor = iconBgColor ?? theme.colors.primary + '15';

    if (variant === 'compact') {
        return (
            <TouchableOpacity
                activeOpacity={0.82}
                style={[
                    styles.compactCard,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: resolvedIconBgColor,
                        shadowColor: theme.colors.text,
                    },
                    style,
                ]}
                onPress={onPress}
            >
                <View style={[styles.compactIconCircle, { backgroundColor: resolvedIconBgColor }]}>
                    <Ionicons name={iconName} size={14} color={resolvedIconColor} />
                </View>
                <AppText
                    style={[styles.compactTitle, { color: theme.colors.text }]}
                    numberOfLines={1}
                >
                    {title}
                </AppText>
                {description ? (
                    <AppText
                        style={[styles.compactDesc, { color: theme.colors.textSecondary }]}
                        numberOfLines={2}
                    >
                        {description}
                    </AppText>
                ) : null}
            </TouchableOpacity>
        );
    }

    // full variant
    return (
        <AnimatedTouchable
            entering={FadeInDown.delay(animDelay).duration(600).springify()}
            style={[
                styles.fullCard,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    shadowColor: theme.colors.text,
                },
                style,
            ]}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View style={[styles.fullIconBg, { backgroundColor: resolvedIconBgColor, borderColor: resolvedIconColor + '30' }]}>
                <Ionicons name={iconName} size={32} color={resolvedIconColor} />
            </View>

            <View style={styles.fullContent}>
                <AppText style={[styles.fullTitle, { color: theme.colors.text }]}>{title}</AppText>
                {description ? (
                    <AppText style={[styles.fullDesc, { color: theme.colors.textSecondary }]}>
                        {description}
                    </AppText>
                ) : null}
                {score !== undefined && (
                    <View style={styles.scoreRow}>
                        <Ionicons name="trophy" size={14} color={theme.colors.warning} />
                        <AppText style={[styles.scoreText, { color: theme.colors.warning }]}>
                            {scoreLabel ?? `Récord: ${score}`}
                        </AppText>
                    </View>
                )}
            </View>

            <View style={[styles.playBtn, { backgroundColor: theme.colors.primary + '10' }]}>
                <Ionicons name="play" size={20} color={theme.colors.primary} />
            </View>
        </AnimatedTouchable>
    );
};

const styles = StyleSheet.create({
    /* ── Full variant ─────────────────────────────────────── */
    fullCard: {
        borderRadius: 24,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
        // overflow: 'hidden' removed — allows flex:1 from parent to work correctly
    },
    fullIconBg: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        borderWidth: 1,
    },
    fullContent: {
        flex: 1,
    },
    fullTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-Bold',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    fullDesc: {
        fontSize: 13,
        fontFamily: 'Nunito-Regular',
        marginBottom: 8,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    scoreText: {
        fontSize: 13,
        fontFamily: 'Nunito-SemiBold',
        fontWeight: 'bold',
    },
    playBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },

    /* ── Compact variant ──────────────────────────────────── */
    compactCard: {
        flex: 1,
        borderRadius: 14,
        borderWidth: 1,
        padding: 10,
        gap: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        justifyContent: 'center',
    },
    compactIconCircle: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    compactTitle: {
        fontSize: 12,
        fontFamily: 'Nunito-Bold',
        fontWeight: '700',
    },
    compactDesc: {
        fontSize: 10,
        fontFamily: 'Nunito-Regular',
        lineHeight: 13,
    },
});
