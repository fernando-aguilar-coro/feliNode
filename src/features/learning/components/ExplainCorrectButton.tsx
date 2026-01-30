import React from 'react';
import { StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AppText } from '../../../components';
import { theme } from '../../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GeminiService } from '../services/GeminiService';

interface Props {
    userAnswer: string;
    question: string;
}

export const ExplainCorrectButton = ({ userAnswer, question }: Props) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handlePress = async () => {
        setIsLoading(true);
        try {
            const prompt = `Explica por qué esta respuesta es correcta. Pregunta: "${question}". Respuesta del usuario: "${userAnswer}". Dame una explicación breve y motivadora en español.`;
            const response = await GeminiService.generateResponse(prompt);
            Alert.alert("Explicación", response);
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
