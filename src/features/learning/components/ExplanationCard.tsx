import React from 'react';
import { StyleSheet, View, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { AppText, Card } from '../../../components';
import { theme } from '../../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { markdownStyles } from '../styles/md.style';

interface Props {
    visible: boolean;
    onClose: () => void;
    content: string;
    title: string;
    type: 'success' | 'error';
}

export const ExplanationCard = ({ visible, onClose, content, title, type }: Props) => {
    const color = type === 'success' ? theme.colors.success : theme.colors.error;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Card style={styles.cardContainer} padding={0}>
                    <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                        <AppText variant="lg" weight="bold" color={color}>{title}</AppText>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                        <Markdown style={markdownStyles}>
                            {content}
                        </Markdown>
                    </ScrollView>
                </Card>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)', // Slightly darker for better focus
        justifyContent: 'center',
        padding: theme.spacing.lg,
    },
    cardContainer: {
        maxHeight: '95%',
        width: '100%',
        overflow: 'hidden', // Ensures children don't overflow the rounded corners
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        backgroundColor: theme.colors.surface, // Ensure header has background
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
});

