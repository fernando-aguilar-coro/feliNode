import { StyleSheet } from 'react-native';

export const getMarkdownStyles = (theme: any) => StyleSheet.create({
    body: {
        fontSize: 16,
        color: theme.colors.text,
        lineHeight: 24,
    },
    heading1: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 10,
        marginTop: 20,
    },
    heading2: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 10,
        marginTop: 15,
    },
    heading3: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
        marginTop: 10,
    },
    paragraph: {
        fontSize: 16,
        color: theme.colors.text,
        marginBottom: 10,
        lineHeight: 24,
    },
    strong: {
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    em: {
        fontStyle: 'italic',
        color: theme.colors.text,
    },
    link: {
        color: theme.colors.primary,
        textDecorationLine: 'underline',
    },
    list_item: {
        fontSize: 16,
        color: theme.colors.text,
        marginBottom: 5,
    },
    // Table specific styles
    table: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        marginVertical: 10,
        backgroundColor: theme.colors.surface,
    },
    tr: {
        borderBottomWidth: 1,
        borderColor: theme.colors.border,
        flexDirection: 'row',
    },
    th: {
        flex: 1,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background, // Alternating background for header
        borderBottomWidth: 1, // Ensure header separation
        borderBottomColor: theme.colors.border,
        fontSize: 12,
        fontWeight: 'bold',
    },
    td: {
        flex: 1,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 0.5, // Optional: add vertical separators
        borderLeftColor: theme.colors.border,
        fontSize: 12,
    },
});

export const getTableMarkdownStyles = (theme: any) => {
    const markdownStyles = getMarkdownStyles(theme);
    return {
        ...markdownStyles,
        // Properties already included above, but explicit override if needed
    };
};
