import React from 'react';
import { Modal, View, StyleSheet, Pressable } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../theme/ThemeContext';

interface QuitLessonModalProps {
    visible: boolean;
    onDismiss: () => void;
    onConfirm: () => void;
}

export const QuitLessonModal: React.FC<QuitLessonModalProps> = ({
    visible,
    onDismiss,
    onConfirm,
}) => {
    const { t } = useTranslation();
    const theme = useAppTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onDismiss}
            statusBarTranslucent
        >
            <Pressable style={styles.backdrop} onPress={onDismiss}>
                <Pressable
                    style={[styles.card, { backgroundColor: theme.colors.background }]}
                    onPress={() => {/* stop propagation */ }}
                >
                    <Text style={[styles.title, { color: theme.colors.background }]}>
                        {t('learning.quitLesson.title')}
                    </Text>

                    <Text style={[styles.description, { color: theme.colors.surface }]}>
                        {t('learning.quitLesson.description')}
                    </Text>

                    <View style={styles.buttons}>
                        <Button
                            mode="contained"
                            onPress={onDismiss}
                            style={styles.btn}
                            labelStyle={styles.label}
                        >
                            {t('learning.quitLesson.cancel')}
                        </Button>

                        <Button
                            mode="text"
                            onPress={onConfirm}
                            labelStyle={[styles.label, { color: theme.colors.surface }]}
                        >
                            {t('learning.quitLesson.confirm')}
                        </Button>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        borderRadius: 16,
        padding: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
    },
    buttons: {
        gap: 10,
    },
    btn: {
        paddingVertical: 4,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
