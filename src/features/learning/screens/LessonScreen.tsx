import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { LoadingScreen } from '../../../components';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLessonSession } from '../hooks/useLessonSession';
import { useExercises } from '../hooks/useExercises';
import { TheoryViewer } from '../components/TheoryViewer';
import { ExerciseContainer } from '../components/exercises/ExerciseContainer';
import { ProgressBar } from '../components/ProgressBar';
import { LessonEndView } from '../components/LessonEndView';
import { QuitLessonModal } from '../components/QuitLessonModal';
import { Screen, AppText } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { HomeStackParamList } from '../../home/navigation/HomeNavigation';
import { audioService } from '../../settings/services/audio.service';
import { useAppRewardedAd } from '../../../hooks/useAppRewardedAd';
import { Text as PaperText, Button as PaperButton, Card, Modal, Portal } from 'react-native-paper';

type Props = NativeStackScreenProps<HomeStackParamList, 'LessonSession'>;

export const LessonScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
    const route = useRoute<Props['route']>();
    const { lessonId, mode } = route.params || { lessonId: 'lesson_verbs_intro' };

    const onExit = () => navigation.navigate('Main');

    const {
        status,
        theoryContent,
        exercises,
        startExercises,
        completeLesson,
        doubleRewards,
        lesson,
        rewardsInfo
    } = useLessonSession(lessonId);

    const isExam = lessonId?.includes('placement_test') || false;

    const { isLoaded: isAdLoaded, showAd } = useAppRewardedAd();
    const [isReviveModalVisible, setReviveModalVisible] = useState(false);

    // Inner hook for exercises (only active when we have exercises)
    const {
        currentExercise,
        isFinished,
        isGameOver,
        checkAnswer,
        nextExercise,
        lastResult,
        completedCount,
        initialTotal,
        overrideResult,
        lives,
        combo,
        maxCombo,
        missedExercises,
        revive,
    } = useExercises(exercises, isExam);

    // Effect to bridge the "finished exercises" state to "completeLesson"
    useEffect(() => {
        if (isFinished && status === 'exercises') {
            audioService.playSuccessSound();
            completeLesson();
        }
    }, [isFinished, status, completeLesson]);

    // Effect to handle game over (ran out of lives)
    useEffect(() => {
        if (isGameOver && status === 'exercises') {
            audioService.playIncorrectSound();
            if (isAdLoaded) {
                setReviveModalVisible(true);
            } else {
                completeLesson();
            }
        }
    }, [isGameOver, status, completeLesson, isAdLoaded]);

    const handleReviveWithAd = async () => {
        setReviveModalVisible(false);
        const success = await showAd();
        if (success) {
            revive();
        } else {
            completeLesson();
        }
    };

    const handleDeclineRevive = () => {
        setReviveModalVisible(false);
        completeLesson();
    };

    const handleDoubleRewards = async () => {
        const success = await showAd();
        if (success) {
            doubleRewards();
        }
    };

    // Effect to handle mode-specific logic
    useEffect(() => {
        if (status === 'theory' && mode === 'practice') {
            startExercises();
        }
    }, [status, mode, startExercises]);

    const [isQuitModalVisible, setQuitModalVisible] = useState(false);

    // Manejar el botón físico de retroceso (Android) en la pantalla final
    useFocusEffect(
        useCallback(() => {
            const handleBackPress = () => {
                if (status === 'completed') {
                    onExit();
                    return true; // Bloquea el retroceso por defecto y ejecuta nuestra lógica
                } else if (status === 'exercises') {
                    setQuitModalVisible(true);
                    return true;
                }
                return false; // Permite el retroceso normal en otros estados
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
            return () => backHandler.remove();
        }, [status, onExit])
    );

    const styles = useMemo(() => StyleSheet.create({
        centerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        exercisesContainer: {
            flex: 1,
        },
        header: {
            paddingVertical: theme.spacing.xs,
        },
        modalContainer: {
            backgroundColor: theme.colors.background,
            padding: 24,
            margin: 20,
            borderRadius: 16,
        },
        modalTitle: {
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 24,
            fontSize: 24,
            color: theme.colors.text || '#000',
        },
        modalCard: {
            marginBottom: 32,
        },
        modalDescription: {
            textAlign: 'center',
            color: theme.colors.text || '#000',
            lineHeight: 22,
        },
        modalButtonContainer: {
            marginTop: 24,
            gap: 12,
        },
        modalButton: {
            paddingVertical: 6,
        },
        modalButtonLabel: {
            fontSize: 16,
            fontWeight: 'bold',
        },
    }), [theme]);

    if (status === 'loading') {
        return <LoadingScreen type="lesson" />;
    }

    if (status === 'completed') {
        return (
            <Screen>
                <LessonEndView
                    success={!isGameOver}
                    lives={lives}
                    completedCount={completedCount}
                    totalExercises={initialTotal}
                    maxCombo={maxCombo}
                    missedExercises={missedExercises}
                    onContinue={onExit}
                    onInfinity={() => navigation.navigate('InfinityExercise', { lessonId })}
                    rewardsInfo={rewardsInfo}
                    onDoubleRewardsRequested={handleDoubleRewards}
                    isAdLoaded={isAdLoaded}
                />
            </Screen>
        );
    }

    return (
        <Screen>
            {status === 'theory' && mode !== 'practice' && (
                <TheoryViewer
                    content={theoryContent}
                    onContinue={startExercises}
                />
            )}

            {status === 'exercises' && (
                <View style={styles.exercisesContainer}>
                    <View style={styles.header}>
                        {initialTotal > 0 && (
                            <ProgressBar
                                current={completedCount}
                                total={initialTotal}
                                lives={lives}
                                combo={combo}
                                onExit={() => setQuitModalVisible(true)}
                            />
                        )}
                    </View>

                    {currentExercise ? (
                        <ExerciseContainer
                            exercise={currentExercise}
                            onCheck={checkAnswer}
                            onNext={nextExercise}
                            lastResult={lastResult}
                            lessonContext={lesson?.title}
                            onOverrideResult={overrideResult}
                        />
                    ) : (
                        <View style={styles.centerContainer}>
                            <AppText align="center">No se encontraron ejercicios.</AppText>
                        </View>
                    )}
                </View>
            )}

            <QuitLessonModal
                visible={isQuitModalVisible}
                onDismiss={() => setQuitModalVisible(false)}
                onConfirm={() => {
                    setQuitModalVisible(false);
                    onExit();
                }}
            />

            <Portal>
                <Modal
                    visible={isReviveModalVisible}
                    onDismiss={handleDeclineRevive}
                    contentContainerStyle={styles.modalContainer}
                >
                    <PaperText style={styles.modalTitle}>¿Te quedaste sin vidas?</PaperText>
                    <Card style={styles.modalCard}>
                        <Card.Content>
                            <PaperText style={styles.modalDescription}>
                                Mira un corto video para recuperar 1 vida y continuar tu lección sin perder tu progreso.
                            </PaperText>
                        </Card.Content>
                    </Card>
                    <View style={styles.modalButtonContainer}>
                        <PaperButton
                            mode="contained"
                            onPress={handleReviveWithAd}
                            style={styles.modalButton}
                            labelStyle={styles.modalButtonLabel}
                        >
                            Ver Video 🎥
                        </PaperButton>
                        <PaperButton
                            mode="text"
                            onPress={handleDeclineRevive}
                            labelStyle={styles.modalButtonLabel}
                        >
                            No gracias, terminar lección
                        </PaperButton>
                    </View>
                </Modal>
            </Portal>
        </Screen>
    );
};
