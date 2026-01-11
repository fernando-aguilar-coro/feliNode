import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { AppText, AppButton, Spacer } from '../../../components';
import { theme } from '../../../theme';

interface TheoryViewerProps {
    content: any[];
    onContinue: () => void;
}

export const TheoryViewer: React.FC<TheoryViewerProps> = ({ content, onContinue }) => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <AppText variant="xxl" weight="bold" style={styles.title}>Theory</AppText>
            <Spacer height={theme.spacing.lg} />

            {content.map((item, index) => {
                // Determine how to render based on item structure or type
                // For now, assuming simple objects or strings
                const text = typeof item === 'string' ? item : (item.content || JSON.stringify(item));

                return (
                    <View key={index} style={styles.paragraph}>
                        <AppText variant="md" style={styles.text}>{text}</AppText>
                        <Spacer height={theme.spacing.md} />
                    </View>
                );
            })}

            <Spacer height={theme.spacing.xl} />
            <AppButton title="Start Exercises" onPress={onContinue} variant="primary" />
            <Spacer height={theme.spacing.xl} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: theme.spacing.lg,
    },
    title: {
        marginBottom: theme.spacing.md,
    },
    paragraph: {
        marginBottom: theme.spacing.sm,
    },
    text: {
        lineHeight: 24,
    },
});
