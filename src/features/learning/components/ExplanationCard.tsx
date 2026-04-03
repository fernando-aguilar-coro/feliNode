import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { AppText, Card } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { getMarkdownStyles } from '../styles/md.style';

interface Props {
    visible: boolean;
    onClose: () => void;
    specificExplanation: string;
    generalExplanation: string;
    title: string;
    type: 'success' | 'error';
}

export const ExplanationCard = ({ visible, onClose, specificExplanation, generalExplanation, title, type }: Props) => {
    const { t } = useTranslation();
    const theme = useAppTheme();
    const color = type === 'success' ? theme.colors.success : theme.colors.error;

    const mdStyles = useMemo(() => getMarkdownStyles(theme), [theme]);

    const styles = useMemo(() => StyleSheet.create({
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            padding: theme.spacing.lg,
        },
        cardContainer: {
            maxHeight: '90%',
            width: '100%',
            overflow: 'hidden',
            borderRadius: 16,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.spacing.md,
            borderBottomWidth: 1,
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
        },
        closeButton: {
            padding: 4,
        },
        content: {
            flexGrow: 0,
        },
        scrollContent: {
            padding: theme.spacing.md,
            paddingBottom: theme.spacing.xl,
        },
        section: {
            marginBottom: theme.spacing.lg,
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.xs,
            gap: 8,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.border,
            marginVertical: theme.spacing.md,
        }
    }), [theme]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Card style={styles.cardContainer} padding={0}>
                    <View style={styles.header}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <MaterialCommunityIcons
                                name={type === 'success' ? 'check-circle' : 'alert-circle'}
                                size={24}
                                color={color}
                            />
                            <AppText variant="lg" weight="bold" color={color}>{title}</AppText>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                        {/* Explicación Específica */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <MaterialCommunityIcons name="text-box-search-outline" size={20} color={theme.colors.primary} />
                                <AppText variant="md" weight="bold" color={theme.colors.primary}>
                                    {t('learning.ai.specificAnalysis')}
                                </AppText>
                            </View>
                            <Markdown style={mdStyles}>
                                {specificExplanation}
                            </Markdown>
                        </View>

                        <View style={styles.divider} />

                        {/* Explicación General */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color={theme.colors.primary} />
                                <AppText variant="md" weight="bold" color={theme.colors.primary}>
                                    {t('learning.ai.stepByStep')}
                                </AppText>
                            </View>
                            <Markdown style={mdStyles}>
                                {generalExplanation}
                            </Markdown>
                        </View>
                    </ScrollView>
                </Card>
            </View>
        </Modal>
    );
};

