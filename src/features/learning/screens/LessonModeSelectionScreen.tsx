import React, { useMemo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import YoutubeIframe from 'react-native-youtube-iframe';
import { Screen, AppText, AppButton, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { HomeStackParamList } from '../../home/navigation/HomeNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { lessonRepository } from '../../../db_local/repositories';

type LessonModeSelectionRouteProp = RouteProp<HomeStackParamList, 'Lesson'>; // Using 'Lesson' for now, assuming this screen takes over that route name
type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export const LessonModeSelectionScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<LessonModeSelectionRouteProp>();
    const { t } = useTranslation();
    const { lessonId } = route.params || { lessonId: 'lesson_verbs_intro' }; // Default for testing
    const [lessonTitle, setLessonTitle] = useState<string>('');
    const [youtubeId, setYoutubeId] = useState<string | null>(null);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const lesson: any = await lessonRepository.getLessonById(lessonId);
                if (lesson) {
                    if (lesson.title) setLessonTitle(lesson.title);
                    if (lesson.youtube_id) setYoutubeId(lesson.youtube_id);
                }
            } catch (error) {
                console.error('Failed to fetch lesson:', error);
            }
        };
        fetchLesson();
    }, [lessonId]);

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: theme.spacing.lg,
        },
        buttonContainer: {
            width: '100%',
            gap: theme.spacing.md,
        },
        videoContainer: {
            width: '100%',
            borderRadius: 8,
            overflow: 'hidden',
            marginBottom: theme.spacing.xl,
            backgroundColor: theme.colors.surface,
            elevation: 4,
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        }
    }), [theme]);

    const handleSelectMode = (mode: 'theory' | 'practice' | 'infinity') => {
        if (mode === 'infinity') {
            navigation.navigate('InfinityExercise', { lessonId });
        } else {
            // For theory and practice, we go to the standard LessonScreen (which we might rename or add a mode param to)
            // Assuming 'LessonSession' will be the route name for the actual lesson content
            navigation.navigate('LessonSession', { lessonId, mode });
        }
    };

    return (
        <Screen style={styles.container}>
            <AppText variant="xxl" weight="bold" align="center">
                {lessonTitle || t('learning.modeSelection.loading')}
            </AppText>
            <Spacer height={theme.spacing.sm} />
            <AppText variant="lg" align="center" style={{ opacity: 0.8 }}>
                {t('learning.modeSelection.chooseMode')}
            </AppText>
            <Spacer height={theme.spacing.xl} />

            {youtubeId && (
                <View style={styles.videoContainer}>
                    <YoutubeIframe
                        height={200}
                        videoId={youtubeId}
                    />
                </View>
            )}

            <View style={styles.buttonContainer}>
                <AppButton
                    title={t('learning.modeSelection.theory')}
                    onPress={() => handleSelectMode(undefined as any)} // Theory implies standard start
                    variant="outline"
                />
                <AppButton
                    title={t('learning.modeSelection.infinityExercises')}
                    onPress={() => handleSelectMode('infinity')}
                    variant="outline"
                />
                <AppButton
                    title={t('learning.modeSelection.exam')}
                    onPress={() => handleSelectMode('practice')}
                    variant="outline"
                />
            </View>
            <AppButton
                title={t('learning.modeSelection.back')}
                onPress={() => navigation.goBack()}
                variant="ghost"
            />
        </Screen>
    );
};
