import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AppText } from '../../../components';
import { theme } from '../../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GeminiService } from '../services/GeminiService';
import { ExplanationCard } from './ExplanationCard';

interface Props {
    userAnswer: string;
    question: string;
    lessonContext?: string;
}

export const ExplainCorrectButton = ({ userAnswer, question, lessonContext }: Props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [explanation, setExplanation] = React.useState<string | null>(null);

    const handlePress = async () => {
        setIsLoading(true);
        try {
            const contextPart = lessonContext ? ` En el contexto de la lección sobre "${lessonContext}".` : '';
            const prompt = `Explica por qué esta respuesta es correcta.${contextPart} Pregunta: "${question}". Respuesta del usuario: "${userAnswer}". Si es algo simple responde de manera corta y directa y alaba al usuario`;
            const response = await GeminiService.generateResponse(prompt);
            setExplanation(response);
        } catch (error) {
            console.error("Error fetching explanation:", error);
            Alert.alert("Error", "No se pudo obtener la explicación en este momento.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setExplanation(null);
    };

    return (
        <>
            <TouchableOpacity style={styles.container} onPress={handlePress} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator size="small" color={theme.colors.success} />
                ) : (
                    <>
                        <MaterialCommunityIcons
                            name="lightbulb-on-outline"
                            size={20}
                            color={theme.colors.success}
                        />
                        <AppText variant="sm" color={theme.colors.success} weight="bold" style={styles.text}>
                            Explícame
                        </AppText>
                    </>
                )}
            </TouchableOpacity>

            <ExplanationCard
                visible={!!explanation}
                onClose={handleClose}
                content={explanation || ''}
                title="Explicación"
                type="success"
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.sm,
        marginTop: theme.spacing.xs,
        borderWidth: 1,
        borderColor: theme.colors.success,
        borderRadius: 8,
        backgroundColor: theme.colors.surface,
    },
    text: {
        marginLeft: theme.spacing.xs,
    }
});
