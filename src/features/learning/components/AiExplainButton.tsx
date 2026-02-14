import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, Alert, View } from 'react-native';
import { AppText } from '../../../components';
import { theme } from '../../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GeminiService } from '../services/Gemini.service';
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
    const [explanation, setExplanation] = React.useState<string | null>(null);
    const [modalType, setModalType] = React.useState<'success' | 'error'>('success');

    const handlePress = async () => {
        setIsLoading(true);
        try {
            const contextPart = lessonContext ? ` En el contexto de la lección sobre "${lessonContext}".` : '';
            const prompt = `
        Act as an expert English teacher. Evaluate the student's response.
        Question: "${question}"
        Student's Response: "${userAnswer}"
        ${contextPart}
        Your task is:
        1. Determine if the response is conceptually and grammatically correct.
        2. Provide a specific explanation (about what the user did wrong or correctly) and a general explanation (a translation of the response indicating the meaning and purpose of each word) in spanish.
        Answer STRICTLY in this format: first word (true or false) depending on whether the answer is correct or not, and the rest of the response as an explanation (string: markdown).            `;

            const rawResponse = await GeminiService.generateResponse(prompt, { raw: true });

            // Clean up potential code block markers just in case
            const cleanedResponse = rawResponse.replace(/```/g, '').trim();

            let isCorrect = true;
            let explanationText = "";

            const firstSpaceIndex = cleanedResponse.indexOf(' ');

            if (firstSpaceIndex === -1) {
                // If there's no space, check if the single word is "true"
                isCorrect = cleanedResponse.toLowerCase() === 'true';
                explanationText = "No explanation provided.";
            } else {
                const firstWord = cleanedResponse.substring(0, firstSpaceIndex).toLowerCase().trim();
                // Check if the first word is strictly "true" (handling potential punctuation like "true." or "true,")
                isCorrect = firstWord.replace(/[^a-z]/g, '') === 'true';
                explanationText = cleanedResponse.substring(firstSpaceIndex + 1).trim();
            }

            setExplanation(explanationText);
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
                content={explanation || ''}
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
