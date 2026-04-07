import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { useAppTheme } from '../../../theme/ThemeContext';
import { LessonProgress } from '../services/ModuleProgress.service';
import { GenericModal } from '../../../components/GenericModal';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ModuleLessonsListProps {
    lessons: LessonProgress[];
    onLessonPress: (lessonId: string) => void;
    onMarkAsCompleted?: (lessonId: string) => void;
}

/**
 * A reusable component to display a list of lessons for a module.
 * It indicates completion status with a checkmark.
 */
export const ModuleLessonsList: React.FC<ModuleLessonsListProps> = ({ lessons, onLessonPress, onMarkAsCompleted }) => {
    const theme = useAppTheme();
    const { t } = useTranslation();
    const [confirmVisible, setConfirmVisible] = React.useState(false);
    const [pendingLessonId, setPendingLessonId] = React.useState<string | null>(null);

    const handleConfirm = () => {
        if (pendingLessonId && onMarkAsCompleted) {
            onMarkAsCompleted(pendingLessonId);
        }
        setConfirmVisible(false);
        setPendingLessonId(null);
    };

    const requestMarkAsCompleted = (lessonId: string) => {
        setPendingLessonId(lessonId);
        setConfirmVisible(true);
    };

    return (
        <ScrollView style={styles.scrollView}>
            {lessons.map((lesson, index) => {
                const isCompleted = lesson.status === 'completed';

                return (
                    <List.Item
                        key={lesson.id}
                        title={`${index + 1}. ${lesson.title}`}
                        description={lesson.description}
                        onPress={() => onLessonPress(lesson.id)}
                        left={props => (
                            <List.Icon
                                {...props}
                                icon={isCompleted ? 'check-circle' : 'play-circle-outline'}
                                color={isCompleted ? theme.colors.success : theme.colors.primary}
                            />
                        )}
                        right={props => (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {!isCompleted && onMarkAsCompleted && (
                                    <TouchableOpacity
                                        onPress={() => requestMarkAsCompleted(lesson.id)}
                                        style={styles.markDoneButton}
                                    >
                                        <MaterialCommunityIcons
                                            name="check-circle-outline"
                                            size={22}
                                            color={theme.colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                )}
                                <List.Icon {...props} icon="chevron-right" />
                            </View>
                        )}
                        titleStyle={[
                            styles.title,
                            { color: theme.colors.text }
                        ]}
                        descriptionStyle={{ color: theme.colors.textSecondary }}
                    />
                );
            })}
            <GenericModal
                visible={confirmVisible}
                title={t('common.confirm')}
                description={t('nodes.training.markCompletedConfirm')}
                primaryButtonText={t('common.confirm')}
                secondaryButtonText={t('common.cancel')}
                onPrimaryPress={handleConfirm}
                onSecondaryPress={() => {
                    setConfirmVisible(false);
                    setPendingLessonId(null);
                }}
                dismissable={true}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        maxHeight: 400,
    },
    title: {
        fontWeight: 'bold',
    },
    markDoneButton: {
        padding: 8,
        marginRight: 4,
    }
});
