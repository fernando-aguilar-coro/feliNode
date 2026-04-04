import React from 'react';
import { useTranslation } from 'react-i18next';
import { GenericModal } from '../../../components/GenericModal';

interface QuitLessonModalProps {
    visible: boolean;
    onDismiss: () => void;
    onConfirm: () => void;
}

export const QuitLessonModal: React.FC<QuitLessonModalProps> = ({
    visible,
    onDismiss,
    onConfirm
}) => {
    const { t } = useTranslation();

    return (
        <GenericModal
            visible={visible}
            title={t('learning.quitLesson.title')}
            description={t('learning.quitLesson.description')}
            primaryButtonText={t('learning.quitLesson.cancel')}
            onPrimaryPress={onDismiss}
            secondaryButtonText={t('learning.quitLesson.confirm')}
            onSecondaryPress={onConfirm}
            dismissable={true}
        />
    );
};
