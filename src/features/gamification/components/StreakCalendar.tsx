import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/ThemeContext';

interface StreakCalendarProps {
    history: string[]; // ['2026-02-25', '2026-02-27']
    currentStreak: number;
    lastActiveDate: string | null;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ history, currentStreak, lastActiveDate }) => {
    const theme = useAppTheme();
    const today = new Date();

    // Default to current month
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    const goToPrevMonth = () => {
        setViewDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const goToNextMonth = () => {
        setViewDate(new Date(currentYear, currentMonth + 1, 1));
    };

    // Calendar generations
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

    // Adjust so Monday is first day of week
    const firstDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const calendarDays = [];
    for (let i = 0; i < firstDayIndex; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    const getLocalDateStr = (y: number, m: number, d: number) => {
        const mm = String(m + 1).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        return `${y}-${mm}-${dd}`;
    };

    // Use string parsing manually to avoid time zone issues: YYYY-MM-DD
    const getTsFromDateStr = (dateStr: string) => {
        const [yy, mm, dd] = dateStr.split('-').map(Number);
        return new Date(yy, mm - 1, dd).getTime();
    };

    const lastActiveTs = lastActiveDate ? getTsFromDateStr(lastActiveDate) : 0;

    let activeStreakStartTs = 0;
    if (currentStreak > 0 && lastActiveDate) {
        const d = new Date(lastActiveTs);
        d.setDate(d.getDate() - (currentStreak - 1));
        activeStreakStartTs = d.getTime();
    }

    const todayStr = getLocalDateStr(today.getFullYear(), today.getMonth(), today.getDate());

    const getDayState = (dayStr: string) => {
        if (history.includes(dayStr)) {
            return 'completed'; // Green
        }

        const dayTs = getTsFromDateStr(dayStr);
        if (activeStreakStartTs > 0 && lastActiveTs > 0 && dayTs >= activeStreakStartTs && dayTs <= lastActiveTs) {
            return 'frozen'; // Blue
        }

        return 'none';
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goToPrevMonth} style={styles.navButton}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.monthText, { color: theme.colors.text }]}>
                    {monthNames[currentMonth]} {currentYear}
                </Text>
                <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
                    <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.calendarGrid}>
                {/* Headers */}
                {weekDays.map((wd, index) => (
                    <View key={`header-${index}`} style={styles.dayCell}>
                        <Text style={[styles.dayHeader, { color: theme.colors.textSecondary || '#666' }]}>{wd}</Text>
                    </View>
                ))}

                {/* Days */}
                {calendarDays.map((day, index) => {
                    if (day === null) {
                        return <View key={`empty-${index}`} style={styles.dayCell} />;
                    }

                    const dayStr = getLocalDateStr(currentYear, currentMonth, day);
                    const state = getDayState(dayStr);
                    const isToday = dayStr === todayStr;

                    return (
                        <View key={`day-${day}`} style={styles.dayCell}>
                            <View style={[
                                styles.dayCircle,
                                isToday && styles.dayCircleToday,
                                state === 'completed' && styles.dayCircleCompleted,
                                state === 'frozen' && styles.dayCircleFrozen,
                            ]}>
                                <Text style={[
                                    styles.dayText,
                                    { color: (state === 'completed' || state === 'frozen') ? '#FFF' : (isToday ? '#FF8C00' : theme.colors.text) }
                                ]}>
                                    {day}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    navButton: {
        padding: 8,
    },
    monthText: {
        fontSize: 18,
        fontFamily: 'Nunito-Bold',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    dayCell: {
        width: '14.28%', // 100% / 7 days
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    dayHeader: {
        fontFamily: 'Nunito-Bold',
        fontSize: 14,
        marginBottom: 8,
    },
    dayCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayCircleCompleted: {
        backgroundColor: '#4CAF50', // Green for completed
    },
    dayCircleFrozen: {
        backgroundColor: '#00BFFF', // Blue for frozen
    },
    dayCircleToday: {
        borderWidth: 2,
        borderColor: '#FF8C00',
    },
    dayText: {
        fontFamily: 'Nunito-Bold',
        fontSize: 16,
    },
});
