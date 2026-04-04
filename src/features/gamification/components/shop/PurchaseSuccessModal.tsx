import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../../theme/ThemeContext';
import Animated, { BounceIn } from 'react-native-reanimated';

interface PurchaseSuccessModalProps {
    visible: boolean;
    itemName: string;
    onClose: () => void;
}

export const PurchaseSuccessModal: React.FC<PurchaseSuccessModalProps> = ({
    visible,
    itemName,
    onClose
}) => {
    const { t } = useTranslation();
    const theme = useAppTheme();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Animated.View entering={BounceIn} style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                    <FontAwesome5 name="check-circle" size={60} color="#32CD32" style={{ marginBottom: 16 }} />
                    <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{t('gamification.shop.successTitle')}</Text>
                    <Text style={[styles.modalDesc, { color: theme.colors.text }]}>{t('gamification.shop.successDesc', { name: itemName })}</Text>

                    <Pressable
                        style={styles.modalButton}
                        onPress={onClose}
                    >
                        <Text style={styles.modalButtonText}>{t('gamification.shop.great')}</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: 'Nunito-Bold',
        marginBottom: 8,
    },
    modalDesc: {
        fontSize: 16,
        fontFamily: 'Nunito-Regular',
        textAlign: 'center',
        marginBottom: 24,
    },
    modalButton: {
        backgroundColor: '#32CD32',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    modalButtonText: {
        color: '#FFF',
        fontFamily: 'Nunito-Bold',
        fontSize: 16,
    }
});
