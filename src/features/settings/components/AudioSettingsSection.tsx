import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { List, Switch, Portal, Dialog, RadioButton, Button } from 'react-native-paper';
import { useAppTheme } from '../../../theme/ThemeContext';
import { useSettingsStore } from '../../../store/SettingsStore';
import { ReactNativeTts } from '../../learning/helpers/tts/reactNativeTTS';
import { audioService } from '../services/audio.service';
import {
    KOKORO_VOICE_AF_HEART, KOKORO_VOICE_AF_RIVER, KOKORO_VOICE_AF_SARAH,
    KOKORO_VOICE_AM_ADAM, KOKORO_VOICE_AM_MICHAEL, KOKORO_VOICE_AM_SANTA,
    KOKORO_VOICE_BF_EMMA, KOKORO_VOICE_BM_DANIEL
} from 'react-native-executorch';

const kokoroVoices = [
    { label: 'Heart (US, Female)', value: KOKORO_VOICE_AF_HEART },
    { label: 'River (US, Female)', value: KOKORO_VOICE_AF_RIVER },
    { label: 'Sarah (US, Female)', value: KOKORO_VOICE_AF_SARAH },
    { label: 'Adam (US, Male)', value: KOKORO_VOICE_AM_ADAM },
    { label: 'Michael (US, Male)', value: KOKORO_VOICE_AM_MICHAEL },
    { label: 'Santa (US, Male)', value: KOKORO_VOICE_AM_SANTA },
    { label: 'Emma (GB, Female)', value: KOKORO_VOICE_BF_EMMA },
    { label: 'Daniel (GB, Male)', value: KOKORO_VOICE_BM_DANIEL },
];

export const AudioSettingsSection = () => {
    const theme = useAppTheme();
    const {
        sfxEnabled, setSfxEnabled,
        bgmEnabled, setBgmEnabled,
        englishVoice, setEnglishVoice,
        spanishVoiceId, setSpanishVoiceId
    } = useSettingsStore();

    const [esVoices, setEsVoices] = useState<{ id: string, name: string, language: string }[]>([]);

    const [esModalVisible, setEsModalVisible] = useState(false);
    const [enModalVisible, setEnModalVisible] = useState(false);

    useEffect(() => {
        const loadVoices = async () => {
            const voices = await ReactNativeTts.getAvailableVoices();
            setEsVoices(voices);
        };
        loadVoices();
    }, []);

    const getEnglishVoiceLabel = () => {
        const voice = kokoroVoices.find(v => v.value === englishVoice);
        return voice ? voice.label : 'Heart (US, Female)';
    };

    const getSpanishVoiceLabel = () => {
        if (!spanishVoiceId) return 'Voz por defecto';
        const voice = esVoices.find(v => v.id === spanishVoiceId);
        return voice ? voice.name : 'Voz configurada';
    };

    return (
        <List.Section>
            <List.Subheader style={{ color: theme.colors.textSecondary }}>Audio</List.Subheader>

            <List.Item
                title="Voz en español"
                titleStyle={{ color: theme.colors.text }}
                description={getSpanishVoiceLabel()}
                descriptionStyle={{ color: theme.colors.textSecondary }}
                left={props => <List.Icon {...props} icon="account-voice" color={theme.colors.text} />}
                onPress={() => setEsModalVisible(true)}
            />

            <List.Item
                title="Voz en ingles"
                titleStyle={{ color: theme.colors.text }}
                description={getEnglishVoiceLabel()}
                descriptionStyle={{ color: theme.colors.textSecondary }}
                left={props => <List.Icon {...props} icon="account-voice" color={theme.colors.text} />}
                onPress={() => setEnModalVisible(true)}
            />

            <List.Item
                title="Efectos de sonido"
                titleStyle={{ color: theme.colors.text }}
                left={props => <List.Icon {...props} icon="volume-high" color={theme.colors.text} />}
                right={() => <Switch value={sfxEnabled} onValueChange={setSfxEnabled} />}
            />

            <List.Item
                title="Música de fondo"
                titleStyle={{ color: theme.colors.text }}
                left={props => <List.Icon {...props} icon="music-note" color={theme.colors.text} />}
                right={() => <Switch value={bgmEnabled} onValueChange={(val) => {
                    setBgmEnabled(val);
                    if (val) {
                        useSettingsStore.setState({ bgmEnabled: val }); // immediately update just in case
                        audioService.playBGM();
                    } else {
                        audioService.stopBGM();
                    }
                }} />}
            />

            {/* Spanish Voice Dialog */}
            <Portal>
                <Dialog visible={esModalVisible} onDismiss={() => setEsModalVisible(false)} style={{ backgroundColor: theme.colors.surface }}>
                    <Dialog.Title style={{ color: theme.colors.text }}>Seleccionar voz española</Dialog.Title>
                    <Dialog.ScrollArea>
                        <ScrollView style={{ maxHeight: 300 }}>
                            <RadioButton.Group value={spanishVoiceId || ''} onValueChange={val => setSpanishVoiceId(val)}>
                                {esVoices.map((voice) => (
                                    <RadioButton.Item
                                        key={voice.id}
                                        label={`${voice.name} (${voice.language})`}
                                        value={voice.id}
                                        labelStyle={{ color: theme.colors.text }}
                                    />
                                ))}
                            </RadioButton.Group>
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={() => setEsModalVisible(false)} textColor={theme.colors.primary}>Cerrar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* English Voice Dialog */}
            <Portal>
                <Dialog visible={enModalVisible} onDismiss={() => setEnModalVisible(false)} style={{ backgroundColor: theme.colors.surface }}>
                    <Dialog.Title style={{ color: theme.colors.text }}>Seleccionar voz inglesa</Dialog.Title>
                    <Dialog.ScrollArea>
                        <ScrollView style={{ maxHeight: 300 }}>
                            {kokoroVoices.map((v) => (
                                <RadioButton.Item
                                    key={v.label}
                                    label={v.label}
                                    value={v.label}
                                    status={englishVoice.voiceSource === v.value.voiceSource ? 'checked' : 'unchecked'}
                                    onPress={() => setEnglishVoice(v.value)}
                                    labelStyle={{ color: theme.colors.text }}
                                />
                            ))}
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={() => setEnModalVisible(false)} textColor={theme.colors.primary}>Cerrar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </List.Section>
    );
};
