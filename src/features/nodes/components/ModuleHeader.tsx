import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';

interface ModuleHeaderProps {
    title: string;
    description?: string;
    index: number;
}

export const ModuleHeader = ({ title, description, index }: ModuleHeaderProps) => {
    const theme = useAppTheme();
    const { t } = useTranslation();

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: theme.dark ? 'rgba(255,255,255,0.03)' : '#F8F9FA',
                borderColor: theme.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
            }
        ]}>
            <View style={styles.headerTop}>
                <View style={[styles.pill, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.pillText}>{t('nodes.progress.unit', { index })}</Text>
                </View>
            </View>
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
                {description && (
                    <Text style={[styles.description, { color: theme.dark ? '#999' : '#666' }]}>
                        {description}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 40,
        marginHorizontal: 24,
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
    },
    headerTop: {
        marginBottom: 12,
    },
    pill: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    pillText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    content: {
        gap: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
    }
});



