import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { IconButton, Portal, Modal, Text, Button, ActivityIndicator } from 'react-native-paper';
import { useAppTheme } from '../theme/ThemeContext';
import { translateText } from '../services/Translation.service';
import { TranslateLanguage } from '@react-native-ml-kit/translate-text';

export interface TranslateButtonProps {
  /**
   * El texto que se debe traducir.
   */
  textToTranslate: string;
  
  /**
   * El idioma de destino. Por defecto es TranslateLanguage.SPANISH ('es').
   */
  targetLanguage?: TranslateLanguage;
  
  /**
   * El idioma de origen. Por defecto es TranslateLanguage.ENGLISH ('en').
   */
  sourceLanguage?: TranslateLanguage;
  
  /**
   * Nombre del icono de react-native-vector-icons (MaterialCommunityIcons).
   * Por defecto es 'translate'.
   */
  icon?: string;
  
  /**
   * Tamaño del icono. Por defecto es 24.
   */
  size?: number;
}

export const TranslateButton: React.FC<TranslateButtonProps> = ({
  textToTranslate,
  targetLanguage = TranslateLanguage.SPANISH,
  sourceLanguage = TranslateLanguage.ENGLISH,
  icon = 'translate',
  size = 24,
}) => {
  const theme = useAppTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const handleTranslate = async () => {
    if (translatedText) {
      setVisible(true);
      return;
    }

    setLoading(true);
    try {
      const result = await translateText(textToTranslate, targetLanguage, sourceLanguage);
      setTranslatedText(result);
      setVisible(true);
    } catch (error) {
      console.error('[TranslateButton] Error en traducción:', error);
    } finally {
      setLoading(false);
    }
  };

  const mapLanguageToLabel = (lang: TranslateLanguage): string => {
    switch (lang) {
      case TranslateLanguage.SPANISH: return 'Español';
      case TranslateLanguage.ENGLISH: return 'Inglés';
      default: return String(lang).toUpperCase();
    }
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator size={size} color={theme.colors.primary} style={styles.loader} />
      ) : (
        <IconButton
          icon={icon}
          iconColor={theme.colors.primary}
          size={size}
          onPress={handleTranslate}
          style={styles.button}
        />
      )}

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={[
            styles.modalContent,
            { backgroundColor: theme.colors.surface }
          ]}
        >
          <Text variant="titleMedium" style={[styles.title, { color: theme.colors.primary }]}>
            Traducción al {mapLanguageToLabel(targetLanguage)}
          </Text>
          
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <Text variant="bodyMedium" style={[styles.originalText, { color: theme.colors.textSecondary }]}>
              "{textToTranslate}"
            </Text>
            
            <Text variant="bodyLarge" style={[styles.translatedText, { color: theme.colors.text }]}>
              {translatedText}
            </Text>
          </ScrollView>
          
          <Button
            mode="contained"
            onPress={() => setVisible(false)}
            style={styles.closeButton}
            buttonColor={theme.colors.primary}
          >
            Entendido
          </Button>
        </Modal>
      </Portal>
    </>
  );
};


const styles = StyleSheet.create({
  button: {
    margin: 0,
  },
  loader: {
    padding: 8,
  },
  modalContent: {
    padding: 24,
    margin: 20,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollContainer: {
    maxHeight: 300,
    marginBottom: 16,
  },
  title: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  originalText: {
    fontStyle: 'italic',
    marginBottom: 12,
  },
  translatedText: {
    fontWeight: '500',
  },
  closeButton: {
    alignSelf: 'flex-end',
    borderRadius: 8,
  },
});
