import React from 'react';
import { StyleSheet } from 'react-native';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { Card, useTheme, Text } from 'react-native-paper';

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
                    style={{
                        body: {
                            color: theme.colors.onSurface,
                            fontSize: 16,
                            lineHeight: 24,
                        },
                        heading1: {
                            color: theme.colors.primary,
                            marginVertical: 10,
                            fontWeight: 'bold',
                        },
                        heading2: {
                            color: theme.colors.secondary,
                            marginTop: 10,
                            marginBottom: 5,
                            fontWeight: 'bold',
                        },
                        strong: {
                            color: theme.colors.primary,
                            fontWeight: 'bold',
                        },
                        // Ensure lists are properly styled if Gemini returns bullets
                        bullet_list: {
                            marginVertical: 5,
                        },
                        list_item: {
                            marginVertical: 3,
                        }
                    }}
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
