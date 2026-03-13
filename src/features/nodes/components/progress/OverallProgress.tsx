import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { ModuleProgress } from '../../services/ModuleProgress.service';

interface OverallProgressProps {
    modules: ModuleProgress[];
}

export const OverallProgress: React.FC<OverallProgressProps> = ({ modules }) => {
    const theme = useAppTheme();

    const totalLessons = modules.reduce((sum, mod) => sum + mod.totalLessonsCount, 0);
    const completedLessons = modules.reduce((sum, mod) => sum + mod.completedLessonsCount, 0);
    const progress = totalLessons === 0 ? 0 : completedLessons / totalLessons;
    const progressPercentage = Math.round(progress * 100);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <MaterialCommunityIcons name="trophy-variant" size={28} color={theme.colors.primary} />
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        Tu Progreso Global
                    </Text>
                </View>
                <Text style={[styles.percentageText, { color: theme.colors.primary }]}>
                    {progressPercentage}%
                </Text>
            </View>
            
            <ProgressBar 
                progress={progress} 
                color={theme.colors.primary} 
                style={[styles.progressBar, { backgroundColor: theme.colors.border }]} 
            />
            
            <View style={styles.footer}>
                <Text style={[styles.detailsText, { color: theme.colors.textSecondary }]}>
                    {completedLessons} de {totalLessons} lecciones completadas
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        padding: 20,
        margin: 16,
        marginBottom: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    percentageText: {
        fontSize: 24,
        fontWeight: '900',
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
    },
    footer: {
        marginTop: 12,
        alignItems: 'flex-end',
    },
    detailsText: {
        fontSize: 14,
        fontWeight: '500',
    }
});
