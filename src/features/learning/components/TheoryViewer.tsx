import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import Tts from 'react-native-tts';
import { useTranslation } from 'react-i18next';
import { AppText, AppButton, Spacer } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { TtsService } from '../services/Tts.service';
import { getMarkdownStyles } from '../styles/md.style';
import { TranslationFab } from './TranslationFab';
import { useSettingsStore } from '../../../store/SettingsStore';
import { franc } from 'franc';

const renderRules = {
    table: (node: any, children: any, styles: any) => (
        <ScrollView
            key={node.key}
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{ marginVertical: 10 }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.table}>{children}</View>
        </ScrollView>
    ),
};

interface TheoryViewerProps {
    content: string;
    onContinue: () => void;
}

export const TheoryViewer: React.FC<TheoryViewerProps> = ({ content, onContinue }) => {
    const theme = useAppTheme();
    const { t, i18n } = useTranslation();
    const { language: nativeLanguage } = useSettingsStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [displayContent, setDisplayContent] = useState(content);
    const [isTranslated, setIsTranslated] = useState(false);

    const mdStyles = useMemo(() => getMarkdownStyles(theme), [theme]);

    useEffect(() => {
        setDisplayContent(content);
        setIsTranslated(false);
    }, [content]);

    useEffect(() => {
        const startListener = Tts.addListener('tts-start', () => {
            setIsPlaying(true);
            setIsPaused(false);
        });

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

    const handlePlay = () => {
        setIsPlaying(true);
        setIsPaused(false);

        // Usamos franc para detectar el idioma del texto exacto que se está mostrando.
        const detected = franc(displayContent);

        let voiceLang = 'en-US';
        if (detected === 'spa') {
            voiceLang = 'es-ES';
        } else if (detected === 'cmn' || detected === 'zho') {
            // TODO: Soporte para voces nativas de Chino
            voiceLang = 'en-US';
        } else if (detected === 'hin') {
            // TODO: Soporte para voces nativas de Hindi
            voiceLang = 'en-US';
        } else if (detected === 'eng') {
            voiceLang = 'en-US';
        } else {
            // Fallback en caso de que el texto sea muy corto para franc
            // Usamos la lógica basada en isTranslated como respaldo seguro
            if (nativeLanguage === 'en') {
                // Para ingleses: si traducen, es a español. Si no, su original ya era español.
                voiceLang = 'es-ES';
            } else {
                // Para hispanos/otros: si traducen, es a inglés. Si no, su original era español u otro.
                voiceLang = isTranslated ? 'en-US' : 'es-ES';
            }
        }

        TtsService.speakLongText(displayContent, voiceLang);
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
            justifyContent: 'flex-end',
            width: '100%',
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
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
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
                    </View>
                    <AppButton
                        title={t('learning.theory.goToExam')}
                        onPress={onContinue}
                        variant="ghost"
                        style={styles.skipButton}
                        textColor={theme.colors.primary}
                    />
                </View>
                <Spacer height={theme.spacing.lg} />

                <Markdown style={mdStyles} rules={renderRules}>
                    {displayContent}
                </Markdown>

                <Spacer height={theme.spacing.xl} />
                <AppButton
                    title={t('learning.theory.goToExam')}
                    onPress={onContinue}
                    variant="primary"
                />
                <Spacer height={theme.spacing.xxl} />
            </ScrollView>

            <TranslationFab
                originalText={content}
                onTranslatedText={(text, translated) => {
                    setDisplayContent(text);
                    setIsTranslated(translated);
                }}
            />
        </View>
    );
};
