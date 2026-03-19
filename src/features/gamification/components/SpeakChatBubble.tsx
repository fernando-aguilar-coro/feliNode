import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChatMessage } from '../services/SpeakChat.service';
import { TtsService } from '../../learning/services/Tts.service';

interface SpeakChatBubbleProps {
    message: ChatMessage;
    theme: any; // theme from useAppTheme()
}

export const SpeakChatBubble = ({ message, theme }: SpeakChatBubbleProps) => {
    const isUser = message.role === 'user';

    const handlePress = () => {
        if (!isUser) {
            TtsService.speak(message.text, { language: 'en-US' });
        }
    };

    return (
        <View style={[styles.bubbleWrapper, isUser ? styles.userWrapper : styles.aiWrapper]}>
            <TouchableOpacity
                style={[
                    styles.bubble,
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
                    {message.text}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bubbleWrapper: {
        flexDirection: 'row',
        width: '100%',
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
});
