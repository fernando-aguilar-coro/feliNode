import { Translation } from '../types';

const settings: Translation['settings'] = {
  title: "सेटिंग्स",
  interface: {
    title: "इंटरफ़ेस और प्रकटन",
    darkMode: "डार्क मोड",
    lightMode: "लाइट मोड",
    tapToChangeTheme: "थीम बदलने के लिए टैप करें",
    language: "भाषा",
    tapToChangeLanguage: "भाषा बदलने के लिए टैप करें"
  },
  notifications: {
    title: "सूचनाएं",
    statusLabel: "अलर्ट स्थिति",
    enabledDesc: "सूचनाएं सक्षम हैं।",
    disabledDesc: "सूचनाएं अक्षम हैं।"
  },
  account: {
    title: "खाता",
    linkGoogle: "Google खाता लिंक करें",
    logout: "लॉग आउट करें",
    deleteAccount: "खाता हटाएं",
  },
  audio: {
    title: "ऑडियो",
    spanishVoice: "स्पेनिश आवाज़",
    englishVoice: "अंग्रेजी आवाज़",
    defaultVoice: "डिफ़ॉल्ट आवाज़",
    configuredVoice: "कॉन्फ़िगर की गई आवाज़",
    kokoroModel: "Kokoro आवाज़ मॉडल (अंग्रेजी)",
    downloading: "डाउनलोड हो रहा है...",
    offlineVoiceDesc: "ऑफ़लाइन आवाज़ के लिए डाउनलोड की आवश्यकता है",
    download: "डाउनलोड",
    installed: "इंस्टॉल किया गया",
    update: "अपडेट करें",
    sfx: "ध्वनि प्रभाव",
    bgm: "पृष्ठभूमि संगीत",
    selectSpanishVoice: "स्पेनिश आवाज़ चुनें",
    selectEnglishVoice: "अंग्रेजी आवाज़ चुनें",
    close: "बंद करें",
  },
  deleteAccount: {
    title: "खाता हटाएं?",
    description: "यह क्रिया अपरिवर्तनीय है। आपकी सभी प्रगति स्थायी रूप से हटा दी जाएगी और इसे वापस नहीं पाया जा सकता है।",
    confirm: "स्थायी रूप से हटाएं",
    cancel: "रद्द करें",
  }
};

export default settings;
