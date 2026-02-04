import React from 'react';
import { StyleSheet } from 'react-native';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { Card, useTheme, Text } from 'react-native-paper';
import { markdownStyles } from '../../styles/md.style';

interface Props {
    feedback?: string;
}

export const PronunciationFeedbackGemini: React.FC<Props> = ({ feedback }) => {
    const theme = useTheme();

    if (!feedback) return null;

    return (
        <Card style={styles.card}>
            <Card.Content>
                <Text variant="titleMedium" style={{ color: theme.colors.primary, marginBottom: 8, fontWeight: 'bold' }}>
                    Sugerencias de Mejora
                </Text>
                <Markdown
                    style={markdownStyles}
                >
                    {feedback}
                </Markdown>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 10,
        elevation: 2,
    },
});
