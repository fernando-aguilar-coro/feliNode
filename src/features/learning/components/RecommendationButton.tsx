import React, { useState } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, Alert, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppText } from '../../../components';
import { theme } from '../../../theme';
import { getProgressUser } from '../../../db_local/api_local';
import { GeminiService } from '../services/GeminiService';

interface RecommendationButtonProps {
    onRecommendationReceived: (phrase: string) => void;
}

export const RecommendationButton: React.FC<RecommendationButtonProps> = ({ onRecommendationReceived }) => {
    const [loading, setLoading] = useState(false);

    const handlePress = async () => {
        setLoading(true);
        try {
            const userProgress = await getProgressUser();
            const prompt = `El usuario tiene el siguiente progreso: "${userProgress}". Recomiéndame una frase corta (máximo 25 palabras) en inglés para practicar pronunciación, basada en su nivel. Solo dame la frase, sin explicaciones.`;
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
