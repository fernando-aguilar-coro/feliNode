import React, { useState } from 'react';
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { AppText, AppTextArea } from '../../../../components';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { RecommendTopicButton } from '../RecommendTopicButton';
import { HomeStackParamList } from '../../../home/navigation/HomeNavigation';

type NavProp = NativeStackNavigationProp<HomeStackParamList>;

export type PracticeMode = 'combined' | 'pairs';

interface PracticeTopicModalProps {
    visible: boolean;
    mode: PracticeMode | null;
    onClose: () => void;
}

/**
 * Modal that asks the user for an optional topic focus before starting
 * InfinityExercise or InfinitySelectPairs.  Extracted from PracticeLandingScreen
 * so it can be reused anywhere that needs to trigger these two practice modes.
 */
export const PracticeTopicModal: React.FC<PracticeTopicModalProps> = ({
    visible,
    mode,
    onClose,
}) => {
    const theme = useAppTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<NavProp>();
    const [topic, setTopic] = useState('');

    const handleStart = () => {
        onClose();
        const trimmed = topic.trim();
        if (mode === 'combined') {
            navigation.navigate('InfinityExercise', { lessonId: trimmed });
        } else if (mode === 'pairs') {
            navigation.navigate('InfinitySelectPairs', { lessonId: trimmed });
        }
        setTopic('');
    };

    const handleClose = () => {
        setTopic('');
        onClose();
    };

    const styles = makeStyles(theme);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.content}>
                    <AppText style={styles.title}>
                        {mode === 'combined'
                            ? t('learning.practice.infinityChallenge')
                            : t('learning.practice.matching')}
                    </AppText>
                    <AppText style={styles.subtitle}>
                        {t('learning.practice.chooseFocus')}
                    </AppText>

                    <AppTextArea
                        label={t('learning.practice.focusLabel')}
                        placeholder={t('learning.practice.focusPlaceholder')}
                        value={topic}
                        onChangeText={setTopic}
                        numberOfLines={4}
                    />

                    <View style={{ marginTop: 12 }}>
                        <RecommendTopicButton onTopicReceived={setTopic} />
                    </View>

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[styles.btn, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }]}
                            onPress={handleClose}
                        >
                            <AppText style={[styles.btnText, { color: theme.colors.textSecondary }]}>
                                {t('learning.practice.cancel')}
                            </AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, { backgroundColor: theme.colors.primary }]}
                            onPress={handleStart}
                        >
                            <AppText style={[styles.btnText, { color: '#FFF' }]}>
                                {t('learning.practice.start')}
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const makeStyles = (theme: ReturnType<typeof import('../../../../theme/ThemeContext').useAppTheme>) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            padding: theme.spacing.lg,
        },
        content: {
            backgroundColor: theme.colors.background,
            borderRadius: 24,
            padding: theme.spacing.xl,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 10,
        },
        title: {
            fontSize: 22,
            fontFamily: 'Nunito-Bold',
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: theme.spacing.sm,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 14,
            fontFamily: 'Nunito-Regular',
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.lg,
            textAlign: 'center',
            lineHeight: 20,
        },
        buttons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: theme.spacing.xl,
            gap: theme.spacing.md,
        },
        btn: {
            flex: 1,
            paddingVertical: theme.spacing.md,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        btnText: {
            fontSize: 16,
            fontFamily: 'Nunito-Bold',
            fontWeight: 'bold',
        },
    });
