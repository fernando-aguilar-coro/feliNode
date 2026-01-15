import React from 'react';
import { ScrollView, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { AppText, AppButton, Spacer } from '../../../components';
import { theme } from '../../../theme';

interface TheoryViewerProps {
    content: string;
    onContinue: () => void;
}

export const TheoryViewer: React.FC<TheoryViewerProps> = ({ content, onContinue }) => {
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <AppText variant="xxl" weight="bold" style={styles.title}>
                Teoría
            </AppText>
            <Spacer height={theme.spacing.lg} />

            <Markdown style={markdownStyles}>
                {content}
            </Markdown>

            <Spacer height={theme.spacing.xl} />
            <AppButton
                title="Comenzar Ejercicios"
                onPress={onContinue}
                variant="primary"
            />
            <Spacer height={theme.spacing.xxl} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        padding: theme.spacing.lg,
    },
    title: {
        color: theme.colors.text,
    },
});

// Usa Record con tipos de React Native
const markdownStyles: Record<string, TextStyle | ViewStyle> = {
    body: {
        fontSize: 16,
        lineHeight: 24,
        color: theme.colors.text,
    },
    heading2: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    heading3: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.xs,
    },
    paragraph: {
        marginBottom: theme.spacing.md,
    },
    bullet_list: {
        marginLeft: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    bullet_list_icon: {
        color: theme.colors.primary,
        marginRight: theme.spacing.sm,
    },
    list_item: {
        marginBottom: theme.spacing.xs,
    },
    blockquote: {
        backgroundColor: theme.colors.surface,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
        borderRadius: 12,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        marginVertical: theme.spacing.sm,
    },
    strong: {
        fontWeight: 'bold',
    },
    em: {
        fontStyle: 'italic',
        color: theme.colors.textSecondary,
    },
};