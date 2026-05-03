import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, Modal, Portal, Card, Text as PaperText, Button as PaperButton, useTheme as usePaperTheme } from 'react-native-paper';
import { useAppTheme } from '../../../theme/ThemeContext';
import { LessonProgress } from '../services/ModuleProgress.service';
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
    const paperTheme = usePaperTheme();
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
            <Portal>
                <Modal
                    visible={confirmVisible}
                    onDismiss={() => {
                        setConfirmVisible(false);
                        setPendingLessonId(null);
                    }}
                    contentContainerStyle={{
                        backgroundColor: theme.colors.background,
                        padding: 24,
                        margin: 20,
                        borderRadius: 16,
                    }}
                >
                    <PaperText style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginBottom: 24,
                        fontSize: 24,
                        color: theme.colors.text,
                    }}>
                        {t('common.confirm')}
                    </PaperText>
                    
                    <Card style={{ marginBottom: 32 }}>
                        <Card.Content>
                            <PaperText style={{
                                textAlign: 'center',
                                color: theme.colors.text,
                                lineHeight: 22,
                            }}>
                                {t('nodes.training.markCompletedConfirm')}
                            </PaperText>
                        </Card.Content>
                    </Card>

                    <View style={{ marginTop: 24, gap: 12 }}>
                        <PaperButton
                            mode="contained"
                            onPress={handleConfirm}
                            style={{ paddingVertical: 6 }}
                            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                        >
                            {t('common.confirm')}
                        </PaperButton>
                        <PaperButton
                            mode="text"
                            onPress={() => {
                                setConfirmVisible(false);
                                setPendingLessonId(null);
                            }}
                            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                            textColor={theme.colors.textSecondary}
                        >
                            {t('common.cancel')}
                        </PaperButton>
                    </View>
                </Modal>
            </Portal>
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
