import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { useSettingsStore } from '../../../store/SettingsStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeNavigation';
import { Ionicons } from '@expo/vector-icons';
import { GenericModal } from '../../../components/GenericModal';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export const FirstPracticeModal = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigation = useNavigation<NavigationProp>();

    const hasDecidedKokoroDownload = useSettingsStore(state => state.hasDecidedKokoroDownload);
    const hasSeenFirstPracticeModal = useSettingsStore(state => state.hasSeenFirstPracticeModal);
    const setHasSeenFirstPracticeModal = useSettingsStore(state => state.setHasSeenFirstPracticeModal);

    // Show only after Kokoro modal has been decided AND this modal hasn't been seen yet
    const visible = hasDecidedKokoroDownload && !hasSeenFirstPracticeModal;

    const handleGoToPractice = () => {
        setHasSeenFirstPracticeModal(true);
        navigation.navigate('InfinitySelectPairs', { lessonId: '' });
    };

    const handleDismiss = () => {
        setHasSeenFirstPracticeModal(true);
    };

    return (
        <GenericModal
            visible={visible}
            title={t('home.modals.firstPractice.title')}
            description={t('home.modals.firstPractice.description')}
            subtitle={t('home.modals.firstPractice.subtitle')}
            icon={<Ionicons name="game-controller" size={56} color={theme.colors.primary} />}
            primaryButtonText={t('home.modals.firstPractice.accept')}
            primaryButtonIcon="play-circle"
            onPrimaryPress={handleGoToPractice}
            secondaryButtonText={t('home.modals.firstPractice.decline')}
            onSecondaryPress={handleDismiss}
        />
    );
};
