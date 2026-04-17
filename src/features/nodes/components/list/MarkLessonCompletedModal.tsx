import React from 'react';
import { View, StyleSheet, Modal, Text, Pressable } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../../theme/ThemeContext';

interface MarkLessonCompletedModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const MarkLessonCompletedModal: React.FC<MarkLessonCompletedModalProps> = ({ visible, onConfirm, onCancel }) => {
    const theme = useAppTheme();
    const { t } = useTranslation();

    const styles = React.useMemo(() => StyleSheet.create({
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        cardWrapper: {
            width: '100%',
            maxWidth: 400,
        },
        card: {
            width: '100%',
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 8,
        },
        modalDescription: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            marginBottom: 20,
            lineHeight: 24,
        },
        modalActions: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 8,
        },
        cancelButton: {
            minWidth: 100,
        },
        confirmButton: {
            minWidth: 100,
        }
    }), [theme]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <Pressable style={styles.modalOverlay} onPress={onCancel}>
                <Pressable onPress={(e) => e.stopPropagation()} style={styles.cardWrapper}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.modalTitle}>{t('common.confirm')}</Text>
                            <Text style={styles.modalDescription}>
                                {t('nodes.training.markCompletedConfirm')}
                            </Text>
                            <View style={styles.modalActions}>
                                <Button 
                                    mode="text" 
                                    onPress={onCancel}
                                    style={styles.cancelButton}
                                    textColor={theme.colors.textSecondary}
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button 
                                    mode="contained" 
                                    onPress={onConfirm}
                                    style={styles.confirmButton}
                                    buttonColor={theme.colors.primary}
                                >
                                    {t('common.confirm')}
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
