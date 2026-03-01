import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useStreak } from '../hooks/useStreak';
import { audioService } from '../../settings/services/audioService';
import { StreakCalendar } from '../components/StreakCalendar';
export const StreakDetailsScreen = () => {
    const navigation = useNavigation();
    const theme = useAppTheme();
    const { streak, loading } = useStreak();

    const handleGoBack = () => {
        audioService.playClickSound();
        navigation.goBack();
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
                <View style={styles.center}>
                    <Text style={{ color: theme.colors.text }}>Cargando...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const { current_streak, highest_streak, freezes_available } = streak;
    const isActive = current_streak > 0;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                        <Ionicons name="close" size={28} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}></Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Main Fire Icon Section */}
                <View style={styles.fireSection}>
                    <View style={[styles.fireCircle, isActive ? styles.fireCircleActive : styles.fireCircleInactive]}>
                        <FontAwesome5
                            name="fire"
                            size={80}
                            color={isActive ? "#FFA500" : "#B0B0B0"}
                            style={{ marginTop: 10 }}
                        />
                    </View>
                    <Text style={[styles.streakNumber, isActive ? styles.textActive : styles.textInactive]}>
                        {current_streak}
                    </Text>
                    <Text style={[styles.streakLabel, { color: theme.colors.text }]}>
                        {current_streak === 1 ? 'días de racha' : 'días de racha'}
                    </Text>

                    <View style={styles.statsRow}>
                        <View style={[styles.statBadge, { backgroundColor: theme.colors.surface }]}>
                            <FontAwesome5 name="medal" size={16} color="#FFD700" />
                            <Text style={[styles.statText, { color: theme.colors.text }]}> Record: {highest_streak}</Text>
                        </View>
                    </View>
                </View>

                {/* Streak Protectors Section */}
                <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="snow" size={24} color="#00BFFF" />
                        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Protectores de Racha</Text>
                    </View>
                    <Text style={[styles.cardDescription, { color: theme.colors.textSecondary || '#666' }]}>
                        El protector de racha te salva si olvidas practicar por un día.
                    </Text>

                    <View style={styles.protectorContainer}>
                        {[...Array(2)].map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.protectorSlot,
                                    i < freezes_available ? styles.protectorEquipped : styles.protectorEmpty
                                ]}
                            >
                                <Ionicons
                                    name="snow"
                                    size={30}
                                    color={i < freezes_available ? "#FFF" : "#DDD"}
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={[styles.protectorStatusText, { color: theme.colors.text }]}>
                        {freezes_available} / 2 Equipados
                    </Text>
                </View>

                {/* Calendar Section */}
                <StreakCalendar
                    history={streak.history || []}
                    currentStreak={current_streak}
                    lastActiveDate={streak.last_active_date}
                />

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        marginBottom: -20
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Nunito-Bold',
        fontWeight: 'bold',
    },
    fireSection: {
        alignItems: 'center',
    },
    fireCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 6,
    },
    fireCircleActive: {
        borderColor: '#FFDCA8',
        backgroundColor: '#FFF4E5',
    },
    fireCircleInactive: {
        borderColor: '#E0E0E0',
        backgroundColor: '#F5F5F5',
    },
    streakNumber: {
        fontSize: 48,
        fontFamily: 'Nunito-Bold',
        fontWeight: '900',
    },
    textActive: {
        color: '#FF8C00',
    },
    textInactive: {
        color: '#A0A0A0',
    },
    streakLabel: {
        fontSize: 18,
        fontFamily: 'Nunito-Regular',
        marginTop: -4,
    },
    statsRow: {
        flexDirection: 'row',
        marginTop: 16,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    statText: {
        fontSize: 14,
        fontFamily: 'Nunito-Bold',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    card: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-Bold',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    cardDescription: {
        fontSize: 14,
        fontFamily: 'Nunito-Regular',
        marginBottom: 20,
        lineHeight: 20,
    },
    protectorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    protectorSlot: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
    },
    protectorEquipped: {
        backgroundColor: '#00BFFF',
        borderColor: '#87CEEB',
    },
    protectorEmpty: {
        backgroundColor: '#F0F0F0',
        borderColor: '#E0E0E0',
    },
    protectorStatusText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Nunito-Bold',
        fontWeight: 'bold',
    },
});
