import React, { useMemo } from 'react';
import { StyleSheet, View, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { AppText, Card } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { getMarkdownStyles } from '../styles/md.style';

interface Props {
    visible: boolean;
    onClose: () => void;
    content: string;
    title: string;
    type: 'success' | 'error';
}

export const ExplanationCard = ({ visible, onClose, content, title, type }: Props) => {
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
            maxHeight: '95%',
            width: '100%',
            overflow: 'hidden',
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
                        <AppText variant="lg" weight="bold" color={color}>{title}</AppText>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                        <Markdown style={mdStyles}>
                            {content}
                        </Markdown>
                    </ScrollView>
                </Card>
            </View>
        </Modal>
    );
};

