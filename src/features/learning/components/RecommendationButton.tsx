import React, { useState } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, Alert, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppText } from '../../../components';
import { theme } from '../../../theme';
import { GeminiService } from '../../../api/Gemini.service';

interface RecommendationButtonProps {
    onRecommendationReceived: (phrase: string) => void;
    currentLesson: string;
}

export const RecommendationButton: React.FC<RecommendationButtonProps> = ({ onRecommendationReceived, currentLesson }) => {
    const [loading, setLoading] = useState(false);

    const handlePress = async () => {
        setLoading(true);
        try {
            // const userProgress = await getProgressUser(); // Removed as requested
            const prompt = `El usuario tiene disponibles las siguientes lecciones: "${currentLesson}". Recomiéndame una frase (de 5 a 40 palabras en funcion del progreso del usuario) en inglés para practicar pronunciación, relacionada con estos temas. Solo dame la frase, sin ninguna explicación.`;
            const phrase = await GeminiService.generateResponse(prompt);
            onRecommendationReceived(phrase);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo obtener una recomendación.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={loading}
            style={[styles.button, loading && styles.disabled]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
                <View style={styles.content}>
                    <MaterialCommunityIcons name="magic-staff" size={24} color={theme.colors.white} style={styles.icon} />
                    <AppText variant="md" color={theme.colors.white} weight="bold">
                        Recomendar frase
                    </AppText>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 48,
        backgroundColor: theme.colors.secondary, // Using secondary to distinguish from "Comenzar" but still look prominent
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        width: '100%', // Full width
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    disabled: {
        opacity: 0.6,
    },
    icon: {
        marginRight: 8,
    }
});
