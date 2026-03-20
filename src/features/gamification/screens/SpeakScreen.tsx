import React, { useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Keyboard,
    Animated,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/ThemeContext';
import type { GamificationStackParamList } from '../navigation/GamificationNavigator';
import { useSpeakChat } from '../hooks/useSpeakChat';
import { SpeakCatCanvas } from '../components/SpeakCatCanvas';
import { SpeakInputBar } from '../components/SpeakInputBar';
import { SpeakChatBubble } from '../components/SpeakChatBubble';
import { audioService } from '../../settings/services/audio.service';


export const SpeakScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<NativeStackNavigationProp<GamificationStackParamList>>();
    const { messages, inputText, setInputText, isLoading, sendMessage, isCallActive, toggleCallMode, clearChat, error } = useSpeakChat();
    const scrollRef = useRef<ScrollView>(null);

    // ── BGM Control ──────────────────────────────────────────────────────────
    useFocusEffect(
        useCallback(() => {
            audioService.pauseBGM();
            return () => {
                audioService.playBGM();
            };
        }, [])
    );

    // ── Keyboard offset ──────────────────────────────────────────────────────
    const keyboardOffset = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', (e) => {
            const offset = Math.max(0, e.endCoordinates.height / 1.5);
            keyboardOffset.setValue(offset);
        });
        const hide = Keyboard.addListener('keyboardDidHide', () => {
            keyboardOffset.setValue(0);
        });
        return () => {
            show.remove();
            hide.remove();
        };
    }, [keyboardOffset]);

    // ── Breathing Animation for Call Mode ───────────────────────────────────
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isCallActive) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isCallActive, pulseAnim]);

    // ── Auto-scroll ──────────────────────────────────────────────────────────
    useEffect(() => {
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, [messages]);

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>

            {/* ── Main Canvas ── */}
            <View style={styles.canvasContainer}>
                {/* 3D layer */}
                <View style={[StyleSheet.absoluteFillObject]} pointerEvents="none">
                    <SpeakCatCanvas />
                </View>

                {/* UI Overlay */}
                <Animated.View style={[styles.overlayAnim, { paddingBottom: keyboardOffset }]}>
                    {/* Chat Bubble History */}
                    <View style={styles.chatOverlay}>
                        <ScrollView
                            ref={scrollRef}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.chatContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            {messages.map((m) => (
                                <SpeakChatBubble key={m.id} message={m} theme={theme} />
                            ))}


                            {isLoading && (
                                <View style={[styles.bubbleWrapper, styles.aiWrapper]}>
                                    <View style={[styles.bubble, { backgroundColor: theme.colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: theme.colors.border }]}>
                                        <Text style={[styles.bubbleText, { color: theme.colors.text, opacity: 0.6 }]}>
                                            Escribiendo<Animated.Text>…</Animated.Text>
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                        {error && (
                            <Text style={[styles.errorText, { color: theme.colors.error || '#FF6B6B' }]}>
                                {error}
                            </Text>
                        )}
                    </View>

                    {/* Glowing Mic Button for Call Mode */}
                    <View style={styles.micWrapper}>
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={clearChat}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="trash-outline" size={20} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                        <View style={styles.micButtonContainer}>
                            {isCallActive && (
                                <Animated.View
                                    style={[
                                        styles.micPulse,
                                        {
                                            transform: [{ scale: pulseAnim }],
                                            backgroundColor: theme.colors.primary
                                        }
                                    ]}
                                />
                            )}
                            <TouchableOpacity
                                style={[
                                    styles.micButton,
                                    { backgroundColor: isCallActive ? '#FF6B6B' : theme.colors.primary }
                                ]}
                                onPress={toggleCallMode}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name={isCallActive ? "mic" : "mic-outline"}
                                    size={30}
                                    color="#ffffff"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>


                    {/* Input bar */}
                    <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background }]}>
                        <SpeakInputBar
                            value={inputText}
                            onChangeText={setInputText}
                            onSend={sendMessage}
                            disabled={isLoading}
                        />
                    </View>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1 },

    canvasContainer: {
        flex: 1,
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 12,
        borderRadius: 24,
        overflow: 'hidden',
    },

    overlayAnim: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    chatOverlay: {
        maxHeight: 220, // slightly larger for visibility
        paddingHorizontal: 12,
        marginBottom: 8,
        opacity: 0.5,
    },
    chatContent: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        gap: 8,
    },

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
    errorText: {
        fontFamily: 'Nunito-Bold',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 4,
    },

    inputWrapper: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },

    micWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        marginTop: 4,
        gap: 12,
    },
    micButtonContainer: {
        width: 56,
        height: 56,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    micButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        zIndex: 2,
    },
    clearButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    micPulse: {
        position: 'absolute',
        width: 68,
        height: 68,
        borderRadius: 34,
        opacity: 0.35,
        top: -6,
        left: -6,
        zIndex: 1,
    },

    micText: {
        marginTop: 6,
        fontFamily: 'Nunito-Bold',
        fontSize: 11,
        opacity: 0.8,
    },
});