import { StyleSheet } from 'react-native';
import { theme } from '../../../theme';

export const markdownStyles = StyleSheet.create({
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
    },
    td: {
        flex: 1,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 0.5, // Optional: add vertical separators
        borderLeftColor: theme.colors.border,
    },
    // Inner text styles for tokens inside table cells need to be targeted via body if possible
    // or by applying specific styles to text nodes.
    // react-native-markdown-display applies styles to elements.
    // To make table text smaller, we target text inside th/td doesn't work directly with stylesheet usually
    // but the library merges styles.
    // Let's try to define text styles for table content if possible, or rely on inheritance if the library supports it.
    // However, the library usually styles `text` node inside `th`.
    // We can define `th` and `td` to have fontSize which SHOULD propagate to text if using the library's defaults logic,
    // OR we might need to target `text_group`? No, usually `th` and `td` styles on the View container don't affect text directly unless layout.
    // Wait, react-native-markdown-display style object keys map to the VALID KEYS for valid html primitives.
    // `th` and `td` map to Views. So fontSize in `th` View style won't affect Text children in RN.
    // We need to style the Text nodes inside tables? 
    // Actually, usually `body` style sets the default text style.
    // If we want smaller text in tables, we might fail unless we use a custom rule.
    // BUT the user said "se soluciono pero ahora el resto de stylos desencaja".
    // This implies my previous change DID work for table size, but broke others.
    // My previous change was:
    /*
    th: { ...fontSize: 12, fontWeight: 'bold' },
    td: { ...fontSize: 12 },
    */
    // If `react-native-markdown-display` passes these styles to the Text component inside, then it works.
    // If it passes to View, it doesn't.
    // Checking docs or assumption: The library often maps generic styles. If `fontSize` is present, maybe it passes it to children?
    // User said "se soluciono", so I will assume passing fontSize to th/td WORKS.
    // I will explicitly include the fontSize here.
});

// We need to extend this to ensure th/td have the font size.
export const tableMarkdownStyles = {
    ...markdownStyles,
    th: {
        ...markdownStyles.th,
        fontSize: 12,
        fontWeight: 'bold',
    },
    td: {
        ...markdownStyles.td,
        fontSize: 12,
    }
};
