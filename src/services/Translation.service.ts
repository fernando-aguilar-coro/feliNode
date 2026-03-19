import TranslateText, { TranslateLanguage } from '@react-native-ml-kit/translate-text';

export interface TranslationConfig {
  sourceLanguage?: TranslateLanguage;
  targetLanguage?: TranslateLanguage;
  downloadModelIfNeeded?: boolean;
}

/**
 * Translates text using Google ML Kit On-Device Translation.
 * Handles automatic model download if `downloadModelIfNeeded` is true (default).
 * 
 * @param text The text to translate
 * @param targetLanguage The target language (defaults to Spanish)
 * @param sourceLanguage The source language (defaults to English)
 * @returns The translated text string
 */
export const translateText = async (
  text: string,
  targetLanguage: TranslateLanguage = TranslateLanguage.SPANISH,
  sourceLanguage: TranslateLanguage = TranslateLanguage.ENGLISH
): Promise<string> => {
  try {
    const options = {
      text,
      sourceLanguage,
      targetLanguage,
      downloadModelIfNeeded: true, // Always verify and download if needed as per requirement
    };

    const result = await TranslateText.translate(options);
    
    // The native module resolve returns a string, even if TypeScript types say otherwise
    return result as unknown as string;
  } catch (error) {
    console.error('[TranslationService] Error during translation:', error);
    throw error;
  }
};
