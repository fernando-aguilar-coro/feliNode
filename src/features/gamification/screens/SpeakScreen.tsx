import React, { useRef, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/ThemeContext';
import type { GamificationStackParamList } from '../navigation/GamificationNavigator';
import { useSpeakChat } from '../hooks/useSpeakChat';
import { SpeakCatCanvas } from '../components/SpeakCatCanvas';
import { SpeakInputBar } from '../components/SpeakInputBar';

export const SpeakScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<NativeStackNavigationProp<GamificationStackParamList>>();
    const { messages, inputText, setInputText, isLoading, sendMessage } = useSpeakChat();
    const scrollRef = useRef<ScrollView>(null);

    // ── Keyboard offset (Android only) ───────────────────────────────────────
    // e.endCoordinates.height includes the system nav bar which SafeAreaView
    // already handles, so we subtract the bottom inset to avoid over-pushing.
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

    // ── Auto-scroll on new messages ──────────────────────────────────────────
    useEffect(() => {
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    }, [messages]);

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
            {/* ── Top banner ── */}
            <TouchableOpacity
                style={[styles.banner, { backgroundColor: theme.colors.primary, borderColor: theme.colors.border }]}
                onPress={() => navigation.navigate('Shop')}
                activeOpacity={0.8}
            >
                <FontAwesome5 name="store" size={15} color="#FFBA08" />
                <Text style={[styles.bannerText]}>Visita la Tienda</Text>
                <Ionicons name="chevron-forward" size={15} color={theme.colors.text} />
            </TouchableOpacity>

            {/* ── Main area: canvas + overlay ── */}
            <View style={styles.canvasContainer}>
                {/* 3D layer */}
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.colors.background }]} pointerEvents="none">
                    <SpeakCatCanvas />
                </View>

                {/* UI overlay: lifts with the keyboard */}
                <Animated.View style={[styles.overlayAnim, { paddingBottom: keyboardOffset }]}>
                    {/* Chat history */}
                    <View style={styles.chatOverlay}>
                        <ScrollView
                            ref={scrollRef}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.chatContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            {messages.map((m) => (
                                <Text key={m.id} style={styles.line}>
                                    <Text style={m.role === 'ai' ? styles.labelAI : styles.labelUser}>
                                        {m.role === 'ai' ? 'Feli: ' : 'Yo: '}
                                    </Text>
                                    {m.text}
                                </Text>
                            ))}
                            {isLoading && (
                                <Text style={styles.line}>
                                    <Text style={styles.labelAI}>Feli: </Text>…
                                </Text>
                            )}
                        </ScrollView>
                    </View>

                    {/* Input bar */}
                    <View style={styles.inputWrapper}>
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
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
        marginHorizontal: 10,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 14,
    },
    bannerText: {
        fontFamily: 'Nunito-Bold',
        fontSize: 16,
        color: '#ffffffff',
        flex: 1,
        textAlign: 'center',
    },

    canvasContainer: {
        flex: 1,
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 12,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },

    /** Overlay sits over the canvas; paddingBottom is driven by keyboard */
    overlayAnim: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    chatOverlay: {
        maxHeight: 160,
        backgroundColor: 'rgba(5, 5, 15, 0.65)',
        paddingHorizontal: 10,
        paddingTop: 6,
        paddingBottom: 4,
    },
    chatContent: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        gap: 4,
    },
    line: {
        fontFamily: 'Nunito-Regular',
        fontSize: 13,
        color: '#eee',
        lineHeight: 19,
    },
    labelAI: { fontFamily: 'Nunito-Bold', color: '#FFBA08' },
    labelUser: { fontFamily: 'Nunito-Bold', color: '#93c5fd' },

    inputWrapper: {
        backgroundColor: 'rgba(5, 5, 15, 0.55)',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
});
