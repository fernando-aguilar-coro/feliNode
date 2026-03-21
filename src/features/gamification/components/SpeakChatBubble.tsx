import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ChatMessage } from '../services/SpeakChat.service';
import { TtsService } from '../../learning/services/Tts.service';
import { translateText } from '../../../services/Translation.service';
import { Ionicons } from '@expo/vector-icons';

interface SpeakChatBubbleProps {
    message: ChatMessage;
    theme: any; // theme from useAppTheme()
}

export const SpeakChatBubble = ({ message, theme }: SpeakChatBubbleProps) => {
    const isUser = message.role === 'user';
    const [isTranslated, setIsTranslated] = useState<boolean>(false);
    const [translatedText, setTranslatedText] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handlePress = () => {
        if (!isUser) {
            TtsService.speak(message.text, { language: 'en-US' });
        }
    };

    const handleTranslate = async () => {
        if (isTranslated) {
            setIsTranslated(false);
            return;
        }

        if (translatedText) {
            setIsTranslated(true);
            return;
        }

        setLoading(true);
        try {
            const result = await translateText(message.text);
            setTranslatedText(result);
            setIsTranslated(true);
        } catch (error) {
            console.error('[SpeakChatBubble] Error during translation:', error);
        } finally {
            setLoading(false);
        }
    };

    const displayText = isTranslated && translatedText ? translatedText : message.text;

    return (
        <View style={[styles.bubbleWrapper, isUser ? styles.userWrapper : styles.aiWrapper]}>
            <TouchableOpacity
                style={[
                    styles.bubble,
                    { opacity: 0.85 },
                    isUser
                        ? { backgroundColor: theme.colors.primary, borderBottomRightRadius: 4 }
                        : { backgroundColor: theme.colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: theme.colors.border }
                ]}
                onPress={handlePress}
                disabled={isUser}
                activeOpacity={0.7}
            >
                <Text style={[
                    styles.bubbleText,
                    { color: isUser ? '#ffffff' : theme.colors.text }
                ]}>
                    {displayText}
                </Text>
            </TouchableOpacity>

            {!isUser && (
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleTranslate}
                    disabled={loading}
                    activeOpacity={0.7}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color={theme.colors.textSecondary || '#666'} />
                    ) : (
                        <Ionicons
                            name={isTranslated ? "eye-off-outline" : "language-outline"}
                            size={22}
                            color={isTranslated ? theme.colors.primary : (theme.colors.textSecondary || '#666')}
                        />
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    bubbleWrapper: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center', // Center vertically next to the bubble
        gap: 8,
    },
    userWrapper: { justifyContent: 'flex-end' },
    aiWrapper: { justifyContent: 'flex-start' },

    bubble: {
        maxWidth: '75%',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 18,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    bubbleText: {
        fontFamily: 'Nunito-Bold',
        fontSize: 14,
        lineHeight: 20,
    },
    actionButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.04)', // subtle circle to define tap area
    },
});
