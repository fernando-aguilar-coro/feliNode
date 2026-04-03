import React from 'react';
import { useTranslation } from 'react-i18next';
import { TtsManager } from '../../learning/helpers/tts/ttsKokoro';
import { useSettingsStore } from '../../../store/SettingsStore';
import { useNetInfo } from '@react-native-community/netinfo';
import { GenericModal } from '../../../components/GenericModal';

export const KokoroDisclaimerModal = () => {
    const { t } = useTranslation();
    const netInfo = useNetInfo();

    const hasDecidedKokoroDownload = useSettingsStore(state => state.hasDecidedKokoroDownload);
    const setHasDecidedKokoroDownload = useSettingsStore(state => state.setHasDecidedKokoroDownload);
    const setWantsKokoro = useSettingsStore(state => state.setWantsKokoro);

    const handleAccept = () => {
        setHasDecidedKokoroDownload(true);
        setWantsKokoro(true);
        // Start background download automatically since state is now updated
        TtsManager.initialize().catch((error) => {
            console.error('Error in background download:', error);
        });
    };

    const handleDecline = () => {
        setHasDecidedKokoroDownload(true);
        setWantsKokoro(false);
    };

    return (
        <GenericModal
            visible={!hasDecidedKokoroDownload && netInfo.isConnected !== false}
            title={t('home.modals.kokoro.title')}
            description={t('home.modals.kokoro.description')}
            subtitle={t('home.modals.kokoro.subtitle')}
            primaryButtonText={t('home.modals.kokoro.accept')}
            onPrimaryPress={handleAccept}
            secondaryButtonText={t('home.modals.kokoro.decline')}
            onSecondaryPress={handleDecline}
        />
    );
};
