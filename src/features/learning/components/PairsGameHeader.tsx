import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { PairsTimerText } from './PairsTimerText';

interface PairsGameHeaderProps {
    lives: number;
    timeLeft: number;
    isTimeLow: boolean;
    onExit: () => void;
}

export const PairsGameHeader: React.FC<PairsGameHeaderProps> = ({
    lives,
    timeLeft,
    isTimeLow,
    onExit,
}) => {
    const theme = useAppTheme();

    const timerColor = isTimeLow ? theme.colors.error : theme.colors.warning;
    const timerBg = isTimeLow ? theme.colors.error + '25' : theme.colors.warning + '18';

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onExit} style={styles.backButton}>
                <Ionicons name="close" size={26} color={theme.colors.text} />
            </TouchableOpacity>
            <View style={styles.statsContainer}>
                {/* Lives */}
                <View style={[styles.badge, { backgroundColor: theme.colors.error + '18' }]}>
                    <Ionicons name="heart" size={15} color={theme.colors.error} />
                    <Spacer width={5} />
                    <AppText weight="bold" style={{ color: theme.colors.error, fontSize: 13 }}>
                        {lives}
                    </AppText>
                </View>

                <Spacer width={8} />

                {/* Timer */}
                <View style={[styles.badge, { backgroundColor: timerBg }]}>
                    <Ionicons name="time" size={15} color={timerColor} />
                    <Spacer width={5} />
                    <PairsTimerText timeLeft={timeLeft} isLow={isTimeLow} color={timerColor} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    backButton: {
        padding: 6,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
});
