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

            <Markdown>
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
