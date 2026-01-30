import React from 'react';
import { StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AppText } from '../../../components';
import { theme } from '../../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GeminiService } from '../services/GeminiService';

interface Props {
    userAnswer: string;
    correctAnswer: string;
    question: string;
}

export const ExplainErrorButton = ({ userAnswer, correctAnswer, question }: Props) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handlePress = async () => {
        setIsLoading(true);
        try {
            const prompt = `Explica por qué esta respuesta es incorrecta. Pregunta: "${question}". Respuesta del usuario: "${userAnswer}". Respuesta correcta: "${correctAnswer}". Explica el error y por qué la correcta es la adecuada. Sé amable y constructivo. Responde en español.`;
            const response = await GeminiService.generateResponse(prompt);
            Alert.alert("Explicación del error", response);
        } catch (error) {
            console.error("Error fetching explanation:", error);
            Alert.alert("Error", "No se pudo obtener la explicación en este momento.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
