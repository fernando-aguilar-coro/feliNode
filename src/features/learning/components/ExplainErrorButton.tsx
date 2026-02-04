import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AppText } from '../../../components';
import { theme } from '../../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GeminiService } from '../services/Gemini.service';
import { ExplanationCard } from './ExplanationCard';

interface Props {
    userAnswer: string;
    correctAnswer: string;
    question: string;
    lessonContext?: string;
}

export const ExplainErrorButton = ({ userAnswer, correctAnswer, question, lessonContext }: Props) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [explanation, setExplanation] = React.useState<string | null>(null);

    const handlePress = async () => {
        setIsLoading(true);
        try {
            ;
            const prompt = `Explica por qué esta respuesta es incorrecta en ${lessonContext}. Pregunta: "${question}". Respuesta del usuario: "${userAnswer}". Respuesta correcta: "${correctAnswer}". Si la respuesta del usuario esta muy mal, responde de manera muy corta, si no explicalo de manera clara.`;
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
                    <ActivityIndicator size="small" color={theme.colors.error} />
                ) : (
                    <>
                        <MaterialCommunityIcons
                            name="help-circle-outline"
                            size={20}
                            color={theme.colors.error}
                        />
                        <AppText variant="sm" color={theme.colors.error} weight="bold" style={styles.text}>
                            ¿Por qué está mal?
                        </AppText>
                    </>
                )}
            </TouchableOpacity>

            <ExplanationCard
                visible={!!explanation}
                onClose={handleClose}
                content={explanation || ''}
                title="Explicación del error"
                type="error"
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
        borderColor: theme.colors.error,
        borderRadius: 8,
        backgroundColor: theme.colors.surface,
    },
    text: {
        marginLeft: theme.spacing.xs,
    }
});
