import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { ModuleProgress, LessonProgress } from '../../services/ModuleProgress.service';
import { audioService } from '../../../settings/services/audioService';

interface ModuleAccordionProps {
    module: ModuleProgress;
    isExpanded: boolean;
    onToggle: (moduleId: number) => void;
}

export const ModuleAccordion: React.FC<ModuleAccordionProps> = ({ module, isExpanded, onToggle }) => {
    const theme = useAppTheme();
    const navigation = useNavigation<any>();

    const styles = useMemo(() => StyleSheet.create({
        moduleContainer: {
            marginBottom: 16,
            borderRadius: 12,
            backgroundColor: theme.colors.surface,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: theme.colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        moduleHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            backgroundColor: theme.colors.primary,
        },
        moduleTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.white,
            flex: 1,
        },
        lessonListContainer: {
            backgroundColor: theme.colors.surface,
        },
        lessonItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        lessonItemCompleted: {
            backgroundColor: theme.colors.success + '1A', // 10% opacity success background
        },
        lessonItemAvailable: {
            backgroundColor: theme.colors.surface,
        },
        lessonIconContainer: {
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
        },
        iconCompleted: {
            backgroundColor: theme.colors.success,
        },
        iconAvailable: {
            backgroundColor: theme.colors.primary + '20', // dim primary for available
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
            textDecorationLine: 'none',
        },
        lessonTitleAvailable: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 4,
        },
        lessonDescription: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
    }), [theme]);

    const handleLessonPress = (lesson: LessonProgress) => {
        audioService.playClickSound();
        navigation.navigate('Lesson', { lessonId: lesson.id });
    };

    const renderLesson = (lesson: LessonProgress) => {
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
                    <MaterialIcons
                        name={isCompleted ? 'check-circle' : 'play-arrow'}
                        size={24}
                        color={isCompleted ? theme.colors.white : theme.colors.primary}
                    />
                </View>
                <View style={styles.lessonTextContainer}>
                    <Text style={isCompleted ? styles.lessonTitleCompleted : styles.lessonTitleAvailable}>
                        {lesson.title}
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
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <MaterialIcons
                    name={isExpanded ? 'expand-less' : 'expand-more'}
                    size={28}
                    color={theme.colors.white}
                />
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.lessonListContainer}>
                    {module.lessons.map(renderLesson)}
                </View>
            )}
        </View>
    );
};
