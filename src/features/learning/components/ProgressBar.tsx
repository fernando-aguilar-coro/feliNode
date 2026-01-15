import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { theme } from '../../../theme';

interface Props {
    current: number;
    total: number;
}

export const ProgressBar = ({ current, total }: Props) => {
    // Ensure we don't divide by zero and clamp percentage between 0 and 100
    const percentage = Math.min(Math.max((current / total) * 100, 0), 100);
    const widthAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(widthAnim, {
            toValue: percentage,
            duration: 500,
            useNativeDriver: false, // width is not supported by native driver
        }).start();
    }, [percentage]);

    const widthInterpolated = widthAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
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
    );
};

const styles = StyleSheet.create({
    container: {
        height: 8,
        width: '100%',
        marginVertical: theme.spacing.sm,
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
});
