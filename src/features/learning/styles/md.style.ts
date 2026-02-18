import { StyleSheet, Platform } from 'react-native';

export const getMarkdownStyles = (theme: any) => StyleSheet.create({
    // --- TEXTO GENERAL ---
    body: {
        fontSize: 16,
        color: theme.colors.text,
        lineHeight: 24, // 1.5x del tamaño de fuente es el estándar de oro para lectura
    },
    paragraph: {
        fontSize: 16,
        color: theme.colors.text,
        marginBottom: 16, // Más espacio entre párrafos para que respire
        lineHeight: 24,
        flexWrap: 'wrap',
    },

    // --- ENCABEZADOS (Mejor ritmo vertical) ---
    heading1: {
        fontSize: 26,
        fontWeight: '400', // Un poco más grueso
        color: theme.colors.text,
        marginTop: 30, // Más separación arriba para indicar nueva sección
    },
    heading2: {
        fontSize: 22,
        fontWeight: '400',
        color: theme.colors.text,
        marginTop: 24,
    },
    heading3: {
        fontSize: 18,
        fontWeight: '400',
        color: theme.colors.text,
    },

    // --- ESTILOS DE TEXTO ---
    strong: {
        fontWeight: 'bold',
        color: theme.colors.text, // Asegura contraste
    },
    em: {
        fontStyle: 'italic',
        color: theme.colors.text,
        opacity: 0.9,
    },
    link: {
        color: theme.colors.primary,
        fontWeight: '600',
    },

    // --- LISTAS ---
    list_item: {
        fontSize: 16,
        color: theme.colors.text,
        marginBottom: 8,
        lineHeight: 24,
    },
    bullet_list_icon: {
        fontSize: 20, // Bullet points más visibles
        color: theme.colors.text,
        marginLeft: -10,
    },

    // --- CITAS (BLOCKQUOTES) ---
    // Importante para explicaciones o notas
    blockquote: {
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary, // Línea de acento a la izquierda
        paddingLeft: 12,
        marginLeft: 0,
        marginVertical: 10,
        backgroundColor: theme.colors.surface, // Fondo sutil si lo deseas
        opacity: 0.8,
    },

    // --- TABLAS (Optimizadas) ---
    table: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        marginVertical: 16,
        backgroundColor: theme.colors.surface,
    },
    thead: {
        backgroundColor: theme.colors.background, // Diferencia visual clara
        borderBottomWidth: 2, // Borde más grueso para separar cabecera
        borderBottomColor: theme.colors.border,
        width: 600,
    },
    tbody: {
        width: 600,
    },
    tr: {
        borderBottomWidth: 1,
        borderColor: theme.colors.border,
        flexDirection: 'row',
    },
    th: {
        flex: 1,
        padding: 12, // Más padding
        justifyContent: 'center',
        alignItems: 'flex-start', // Alinear títulos a la izq se ve mejor a veces
        fontWeight: '700',
        color: theme.colors.text,
        fontSize: 14, // Un poco más grande que 12
    },
    td: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'flex-start', // IMPORTANTE: Texto a la izquierda es más legible
        fontSize: 12,
        color: theme.colors.text,
    },

    code_inline: {
        backgroundColor: theme.colors.border, // O un color con opacidad baja
        color: theme.colors.primary, // Color distintivo para código
        fontWeight: 'bold',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 1,
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', // FUENTE MONOSPACED
    },
    fence: {
        backgroundColor: '#1e1e1e', // Fondo oscuro suele ser estándar para bloques de código
        color: '#f8f8f2', // Texto claro
        padding: 16,
        borderRadius: 8,
        marginVertical: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', // FUENTE MONOSPACED
        fontSize: 14,
    },
});
