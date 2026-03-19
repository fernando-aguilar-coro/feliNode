import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import { TranslateExercise as TranslateExerciseType } from '../../types/exercise';
import { AppText, AppTextInput } from '../../../../components';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { TtsService } from '../../services/Tts.service';
import { translateText } from '../../../../services/Translation.service';
import { franc } from 'franc';

interface Props {
    exercise: TranslateExerciseType;
    onAnswer: (answer: string) => void;
    userAnswer: string;
}

export const TranslateExercise = ({ exercise, onAnswer, userAnswer }: Props) => {
    const theme = useAppTheme();
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [tappedWord, setTappedWord] = useState('');
    const [translatedWord, setTranslatedWord] = useState('');

    useEffect(() => {
        const language = franc(exercise.phrase);
        let lang = 'en-US';
        if (language === 'spa' || language === 'ita') {
            lang = 'es-ES';
        }
        TtsService.speak(exercise.phrase, { language: lang });
    }, []);

    const styles = useMemo(() => StyleSheet.create({
        question: {
            marginBottom: theme.spacing.lg,
            color: theme.colors.text,
        },
        phraseContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
        },
        input: {
            height: 100,
            textAlignVertical: 'top',
            paddingTop: theme.spacing.sm,
        },
        wordButton: {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.primary,
            borderStyle: 'dashed',
            marginRight: 6,
            marginBottom: 4,
        },
        wordText: {
            color: theme.colors.textSecondary,
            fontStyle: 'italic',
        }
    }), [theme]);

    const handleWordTap = async (rawWord: string) => {
        // Limpiamos puntuación de la palabra para mejor traducción
        const cleanWord = rawWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
        if (!cleanWord) return;

        setTappedWord(cleanWord);
        try {
            // Lógica solicitada: {frase completa}. {palabra}
            const fullInput = `${exercise.phrase}. ${cleanWord}`;
            const result = await translateText(fullInput);
            
            // Regex para extraer la última parte después del punto
            const match = result.match(/[^.]*$/);
            const translated = match ? match[0].trim() : '';
            
            setTranslatedWord(translated);
            setSnackbarVisible(true);
        } catch (error) {
            console.error('[TranslateExercise] Error traduciendo palabra:', error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <AppText variant="lg" weight="medium" style={styles.question}>
                {exercise.question}
            </AppText>
            
            <View style={styles.phraseContainer}>
                <TouchableOpacity onPress={() => TtsService.speak(exercise.phrase)}>
                    <MaterialCommunityIcons name="volume-high" size={24} color={theme.colors.primary} style={{ marginRight: 12 }} />
                </TouchableOpacity>
                
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
                    {exercise.phrase.split(' ').map((word, i) => (
                        <TouchableOpacity 
                            key={`word-${i}-${word}`} 
                            onPress={() => handleWordTap(word)}
                            style={styles.wordButton}
                            activeOpacity={0.6}
                        >
                            <AppText variant="md" style={styles.wordText}>
                                {word}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <AppTextInput
                value={userAnswer}
                onChangeText={onAnswer}
                placeholder="Traduce esta frase..."
                multiline
                style={styles.input}
            />

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                style={{ backgroundColor: theme.colors.surface }}
                action={{
                    label: 'Cerrar',
                    onPress: () => setSnackbarVisible(false),
                    textColor: theme.colors.primary
                }}
            >
                <AppText style={{ color: theme.colors.text }}>
                    "{tappedWord}" significa: <AppText weight="bold" style={{ color: theme.colors.primary }}>{translatedWord}</AppText>
                </AppText>
            </Snackbar>
        </View>
    );
};
