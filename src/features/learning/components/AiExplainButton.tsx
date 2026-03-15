import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, Alert, View } from 'react-native';
import { AppText } from '../../../components';
import { theme } from '../../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GeminiService } from '../../../api/Gemini.service';
import { ExplanationCard } from './ExplanationCard';

interface AiResult {
    isCorrect: boolean;
    explanation: string;
}

interface Props {
    userAnswer: string;
    question: string;
    correctAnswer?: string;
    lessonContext?: string;
    onAiResult: (result: { correct: boolean; message: string }) => void;
}

export const AiExplainButton = ({ userAnswer, question, correctAnswer, lessonContext, onAiResult }: Props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [explanation, setExplanation] = React.useState<{ specific: string; general: string } | null>(null);
    const [modalType, setModalType] = React.useState<'success' | 'error'>('success');

    const handlePress = async () => {
        setIsLoading(true);
        try {
            const contextPart = lessonContext ? ` In context of the lesson "${lessonContext}".` : '';
            const prompt = `
        Question: "${question}", correct answer: "${correctAnswer}"
        Student's Response: "${userAnswer}"
        ${contextPart}
        Your task is:
        1. Provide a specific explanation (about what the user did wrong or correctly).
        2. Provide a general explanation to "${correctAnswer}" (a translation of the response indicating the meaning and purpose of each word).

        Return your response in strict JSON format (no markdown code blocks, just raw JSON):
        {
            "isCorrect": boolean, // evalua segun tu criterio si es correcta o no , no importa si es diferente a la respuesta correcta que yo te di
            "specificExplanation": "string (markdown)", // explica en español
            "generalExplanation": "string (markdown)" // explica en español
        }
            `;

            const rawResponse = await GeminiService.generateResponse(prompt, { raw: true });

            // Clean up potential code block markers just in case
            const cleanedResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();

            let isCorrect = false;
            let specific = "";
            let general = "";

            try {
                const jsonResponse = JSON.parse(cleanedResponse);
                isCorrect = jsonResponse.isCorrect;
                specific = jsonResponse.specificExplanation;
                general = jsonResponse.generalExplanation;
            } catch (e) {
                console.error("Error parsing AI JSON response:", e);
                // Fallback or error handling
                specific = "Error al procesar la explicación específica.";
                general = "No se pudo obtener la explicación general.";
                isCorrect = false;
            }

            setExplanation({ specific, general });
            setModalType(isCorrect ? 'success' : 'error');

            // Notify parent to update UI state
            onAiResult({
                correct: isCorrect,
                message: isCorrect ? "¡Correcto según la IA!" : "Incorrecto según la IA"
            });

        } catch (error) {
            console.error("Error fetching AI explanation:", error);
            Alert.alert("Error", "No se pudo obtener la evaluación de la IA en este momento.");
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
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : (
                    <>
                        <MaterialCommunityIcons
                            name="robot-happy-outline"
                            size={24}
                            color={theme.colors.primary}
                        />
                        <View style={styles.textContainer}>
                            <AppText variant="sm" color={theme.colors.primary} weight="bold">
                                ¡Calificar/explicar con IA!
                            </AppText>
                        </View>
                    </>
                )}
            </TouchableOpacity>

            <ExplanationCard
                visible={!!explanation}
                onClose={handleClose}
                specificExplanation={explanation?.specific || ''}
                generalExplanation={explanation?.general || ''}
                title={modalType === 'success' ? "¡Bien hecho!" : "Corrección"}
                type={modalType}
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
        marginTop: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: 12, // Increased radius for more modern look
        backgroundColor: theme.colors.surface,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    textContainer: {
        marginLeft: theme.spacing.sm,
    }
});
