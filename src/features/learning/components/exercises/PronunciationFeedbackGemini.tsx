import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { Card, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { getMarkdownStyles } from '../../styles/md.style';
import { useAppTheme } from '../../../../theme/ThemeContext';

interface Props {
    feedback?: string;
}

export const PronunciationFeedbackGemini: React.FC<Props> = ({ feedback }) => {
    const theme = useAppTheme();
    const { t } = useTranslation();
    const mdStyles = useMemo(() => getMarkdownStyles(theme), [theme]);

    if (!feedback) return null;

    return (
        <Card style={styles.card}>
            <Card.Content>
                <Text variant="titleMedium" style={{ color: theme.colors.primary, marginBottom: 8, fontWeight: 'bold' }}>
                    {t('learning.pronunciation.suggestions')}
                </Text>
                <Markdown
                    style={mdStyles}
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
