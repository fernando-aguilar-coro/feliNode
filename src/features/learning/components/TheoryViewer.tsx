import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import Tts from 'react-native-tts';
import { AppText, AppButton, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { TtsService } from '../services/Tts.service';
import { getMarkdownStyles } from '../styles/md.style';

const renderRules = {
    table: (node: any, children: any, styles: any) => (
        // contentContainerStyle es clave para que el padding no corte el contenido
        <ScrollView
            key={node.key}
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{ marginVertical: 10 }}
            contentContainerStyle={{ flexGrow: 1 }} // Permite que crezca si el contenido es poco
        >
            {/* Pasamos los estilos de la tabla aquí */}
            <View style={styles.table}>{children}</View>
        </ScrollView>
    ),
};

interface TheoryViewerProps {
    content: string;
    onContinue: () => void;
    buttonText?: string;
}

export const TheoryViewer: React.FC<TheoryViewerProps> = ({ content, onContinue, buttonText }) => {
    const theme = useAppTheme();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const mdStyles = useMemo(() => getMarkdownStyles(theme), [theme]);

    useEffect(() => {
        // Listeners for TTS state
        const startListener = Tts.addListener('tts-start', () => {
            setIsPlaying(true);
            setIsPaused(false);
        });

        // Listen for custom event from TtsService for when queue is actually done/stopped
        const queueFinishListener = DeviceEventEmitter.addListener('tts-queue-finish', () => {
            setIsPlaying(false);
            setIsPaused(false);
        });

        return () => {
            startListener.remove();
            queueFinishListener.remove();
            TtsService.stop();
        };
    }, []);

    // ... (handlers skipped for brevity if identical, but I must rewrite entire block or use chunks. Let's rewrite handlers to be safe or just the full component)
    const handlePlay = () => {
        setIsPlaying(true);
        setIsPaused(false);
        TtsService.speakLongText(content, 'es-ES');
    };

    const handleStop = () => {
        TtsService.stop();
        setIsPlaying(false);
        setIsPaused(false);
    };

    const handleTogglePause = () => {
        if (isPaused) {
            TtsService.resume();
            setIsPaused(false);
        } else {
            TtsService.pause();
            setIsPaused(true);
        }
    };

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        contentContainer: {
            padding: theme.spacing.lg,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.sm,
        },
        controls: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        controlButton: {
            marginLeft: theme.spacing.sm,
        },
        title: {
            color: theme.colors.text,
            flex: 1,
        },
        skipButton: {
            height: 40,
            paddingHorizontal: theme.spacing.sm,
            marginLeft: theme.spacing.sm,
        },
    }), [theme]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <AppText variant="xxl" weight="bold" style={styles.title}>
                    Teoría
                </AppText>
                <View style={styles.controls}>
                    <TouchableOpacity onPress={handlePlay} style={styles.controlButton}>
                        <MaterialCommunityIcons name="volume-high" size={38} color={theme.colors.primary} />
                    </TouchableOpacity>

                    {isPlaying && (
                        <>
                            <TouchableOpacity onPress={handleTogglePause} style={styles.controlButton}>
                                <MaterialCommunityIcons
                                    name={isPaused ? "play-circle-outline" : "pause-circle-outline"}
                                    size={38}
                                    color={isPaused ? theme.colors.success : theme.colors.warning}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleStop} style={styles.controlButton}>
                                <MaterialCommunityIcons name="stop-circle" size={38} color={theme.colors.error} />
                            </TouchableOpacity>
                        </>
                    )}
                    <AppButton
                        title="Saltar"
                        onPress={onContinue}
                        variant="ghost"
                        style={styles.skipButton}
                        textColor={theme.colors.primary}
                    />
                </View>
            </View>
            <Spacer height={theme.spacing.lg} />

            <Markdown style={mdStyles} rules={renderRules}>
                {content}
            </Markdown>

            <Spacer height={theme.spacing.xl} />
            <AppButton
                title={buttonText || "Comenzar Ejercicios"}
                onPress={onContinue}
                variant="primary"
            />
            <Spacer height={theme.spacing.xxl} />
        </ScrollView>
    );
};
