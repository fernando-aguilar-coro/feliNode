import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { LearningSection } from '../components/LearningSection';
import { Screen, AppText, AppButton, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';

type RootStackParamList = {
    Lesson: { lessonId: string };
};

type LessonScreenRouteProp = RouteProp<RootStackParamList, 'Lesson'>;

export const LessonScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<any>();
    const route = useRoute<LessonScreenRouteProp>();
    const { lessonId } = route.params || { lessonId: 'lesson_verbs_intro' };

    const styles = useMemo(() => StyleSheet.create({
        centerContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        button: {
            width: '100%',
        },
    }), []);

    return (
        <LearningSection
            lessonId={lessonId}
            loadingText="Cargando lección..."
            onExit={() => navigation.goBack()}
            renderCompleted={() => (
                <Screen style={styles.centerContainer}>
                    <AppText variant="xxl" weight="bold" color={theme.colors.success} align="center">
                        ¡Lección Completada!
                    </AppText>
                    <Spacer height={theme.spacing.md} />
                    <AppText variant="lg" align="center">
                        ¡Buen trabajo! Has dominado esta lección.
                    </AppText>
                    <Spacer height={theme.spacing.xl} />
                    <AppButton
                        title="Continuar"
                        onPress={() => navigation.goBack()}
                        style={styles.button}
                    />
                </Screen>
            )}
        />
    );
};
