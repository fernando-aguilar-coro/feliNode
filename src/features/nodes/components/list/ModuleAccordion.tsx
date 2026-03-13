import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProgressBar } from 'react-native-paper';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ModuleProgress, LessonProgress } from '../../services/ModuleProgress.service';
import { audioService } from '../../../settings/services/audio.service';

interface ModuleAccordionProps {
    module: ModuleProgress;
    isExpanded: boolean;
    onToggle: (moduleId: number) => void;
}

export const ModuleAccordion: React.FC<ModuleAccordionProps> = React.memo(({ module, isExpanded, onToggle }) => {
    const theme = useAppTheme();
    const navigation = useNavigation<any>();

    const progress = module.totalLessonsCount === 0 ? 0 : module.completedLessonsCount / module.totalLessonsCount;
    const progressPercentage = Math.round(progress * 100);
    const isModuleComplete = progress === 1;

    const styles = useMemo(() => StyleSheet.create({
        moduleContainer: {
            marginBottom: 20,
            marginHorizontal: 16,
            borderRadius: 16,
            backgroundColor: theme.colors.surface,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            borderWidth: 1,
            borderColor: isModuleComplete ? theme.colors.success + '40' : theme.colors.border,
        },
        moduleHeader: {
            padding: 16,
            backgroundColor: isModuleComplete ? theme.colors.success + '10' : theme.colors.surface,
        },
        moduleHeaderTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        titleContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isModuleComplete ? theme.colors.success + '20' : theme.colors.primary + '20',
            justifyContent: 'center',
            alignItems: 'center',
        },
        moduleTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            flex: 1,
        },
        progressContainer: {
            marginTop: 4,
        },
        progressHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
        },
        progressText: {
            fontSize: 14,
            fontWeight: '600',
            color: isModuleComplete ? theme.colors.success : theme.colors.textSecondary,
        },
        progressBar: {
            height: 8,
            borderRadius: 4,
        },
        lessonListContainer: {
            backgroundColor: theme.colors.surface,
            paddingBottom: 8,
        },
        lessonItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 16,
            marginHorizontal: 12,
            marginBottom: 8,
            borderRadius: 12,
        },
        lessonItemCompleted: {
            backgroundColor: theme.colors.success + '15',
        },
        lessonItemAvailable: {
            backgroundColor: theme.colors.background,
        },
        lessonIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
        },
        iconCompleted: {
            backgroundColor: theme.colors.success,
        },
        iconAvailable: {
            backgroundColor: theme.colors.primary + '15',
            borderWidth: 2,
            borderColor: theme.colors.primary,
        },
        lessonTextContainer: {
            flex: 1,
        },
        lessonTitleCompleted: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 4,
        },
        lessonTitleAvailable: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.text,
            marginBottom: 4,
        },
        lessonDescription: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginTop: 2,
        },
    }), [theme, isModuleComplete]);

    const handleLessonPress = (lesson: LessonProgress) => {
        audioService.playClickSound();
        navigation.navigate('Lesson', { lessonId: lesson.id });
    };

    const renderLesson = (lesson: LessonProgress, index: number) => {
        const isCompleted = lesson.status === 'completed';

        return (
            <TouchableOpacity
                key={lesson.id}
                style={[
                    styles.lessonItem,
                    isCompleted ? styles.lessonItemCompleted : styles.lessonItemAvailable
                ]}
                onPress={() => handleLessonPress(lesson)}
                activeOpacity={0.7}
            >
                <View style={[
                    styles.lessonIconContainer,
                    isCompleted ? styles.iconCompleted : styles.iconAvailable
                ]}>
                    <MaterialCommunityIcons
                        name={isCompleted ? 'check-decagram' : 'book-open-page-variant'}
                        size={24}
                        color={isCompleted ? theme.colors.white : theme.colors.primary}
                    />
                </View>
                <View style={styles.lessonTextContainer}>
                    <Text style={isCompleted ? styles.lessonTitleCompleted : styles.lessonTitleAvailable}>
                        {index + 1}. {lesson.title}
                    </Text>
                    {lesson.description ? (
                        <Text style={styles.lessonDescription} numberOfLines={2}>
                            {lesson.description}
                        </Text>
                    ) : null}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.moduleContainer}>
            <TouchableOpacity
                style={styles.moduleHeader}
                onPress={() => onToggle(module.id)}
                activeOpacity={0.8}
            >
                <View style={styles.moduleHeaderTop}>
                    <View style={styles.titleContainer}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons 
                                name={isModuleComplete ? 'star-circle' : 'rhombus-split'} 
                                size={24} 
                                color={isModuleComplete ? theme.colors.success : theme.colors.primary} 
                            />
                        </View>
                        <Text style={styles.moduleTitle}>
                            Módulo {module.order_index}: {module.title}
                        </Text>
                    </View>
                    <MaterialIcons
                        name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={28}
                        color={theme.colors.textSecondary}
                    />
                </View>

                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressText}>
                            {progressPercentage}% Completado
                        </Text>
                        <Text style={styles.progressText}>
                            {module.completedLessonsCount}/{module.totalLessonsCount}
                        </Text>
                    </View>
                    <ProgressBar 
                        progress={progress} 
                        color={isModuleComplete ? theme.colors.success : theme.colors.primary} 
                        style={[styles.progressBar, { backgroundColor: theme.colors.border }]} 
                    />
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.lessonListContainer}>
                    {module.lessons.map((lesson, index) => renderLesson(lesson, index))}
                </View>
            )}
        </View>
    );
});
