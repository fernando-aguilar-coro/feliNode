import React, { useState } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { FAB } from 'react-native-paper';
import { useAppTheme } from '../../../theme/ThemeContext';
import { translateMd, mapI18nToTranslateLanguage } from '../../../services/Translation.service';
import { TranslateLanguage } from '@react-native-ml-kit/translate-text';
import { useSettingsStore } from '../../../store/SettingsStore';

interface TranslationFabProps {
  /**
   * Texto original en español (usualmente markdown) a traducir.
   */
  originalText: string;

  /**
   * Callback invocado cuando ocurre la traducción o se restaura el texto.
   */
  onTranslatedText: (text: string, isTranslated: boolean) => void;

  /**
   * Estilo adicional para colocar el FAB (por defecto abajo a la derecha).
   */
  style?: ViewStyle;
}

export const TranslationFab: React.FC<TranslationFabProps> = ({ originalText, onTranslatedText, style }) => {
  const theme = useAppTheme();
  const { language: nativeLanguage } = useSettingsStore();

  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const [translatedTextCache, setTranslatedTextCache] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleToggle = async () => {
    // Si ya está traducido a inglés, volvemos a mostrar español
    if (isTranslated) {
      setIsTranslated(false);
      onTranslatedText(originalText, false);
      return;
    }

    // Si ya tenemos en caché la traducción en inglés, la usamos
    if (translatedTextCache) {
      setIsTranslated(true);
      onTranslatedText(translatedTextCache, true);
      return;
    }

    setLoading(true);
    try {
      // El idioma original según los ajustes del usuario
      const sourceLang = mapI18nToTranslateLanguage(nativeLanguage);
      
      // Siempre traducimos a inglés para practicar.
      const targetLang = TranslateLanguage.ENGLISH;

      const result = await translateMd(originalText, targetLang, sourceLang);
      setTranslatedTextCache(result);
      setIsTranslated(true);
      onTranslatedText(result, true);
    } catch (error) {
      console.error('[TranslationFab] Error durante la traducción:', error);
      // Opcional: mostrar un Toast o Snackbar en caso de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <FAB
      style={[
        styles.fab,
        { backgroundColor: isTranslated ? theme.colors.secondary : theme.colors.primary },
        style
      ]}
      // Usamos "translate" cuando está en español, y cambiamos el icono u opacidad para indicar inglés
      icon={isTranslated ? "undo-variant" : "translate"}
      color={theme.colors.white}
      loading={loading}
      disabled={loading}
      onPress={handleToggle}
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
