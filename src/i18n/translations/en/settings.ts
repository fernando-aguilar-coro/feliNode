import { Translation } from '../types';

const settings: Translation['settings'] = {
  title: "Settings",
  interface: {
    title: "Interface and Appearance",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    tapToChangeTheme: "Tap to change theme",
    language: "Language",
    tapToChangeLanguage: "Tap to change language"
  },
  notifications: {
    title: "Notifications",
    statusLabel: "Alert Status",
    enabledDesc: "Notifications are enabled.",
    disabledDesc: "Notifications are disabled."
  },
  account: {
    title: "Account",
    linkGoogle: "Link Account with Google",
    logout: "Log Out",
    deleteAccount: "Delete Account",
  },
  audio: {
    title: "Audio",
    spanishVoice: "Spanish Voice",
    englishVoice: "English Voice",
    defaultVoice: "Default Voice",
    configuredVoice: "Configured Voice",
    kokoroModel: "Kokoro Voice Model (English)",
    downloading: "Downloading: ...",
    offlineVoiceDesc: "Requires download for offline voice",
    download: "Download",
    installed: "Installed",
    update: "Update",
    sfx: "Sound Effects",
    bgm: "Background Music",
    selectSpanishVoice: "Select Spanish Voice",
    selectEnglishVoice: "Select English Voice",
    close: "Close",
  },
  deleteAccount: {
    title: "Delete Account?",
    description: "This action is irreversible. All your progress will be permanently deleted and cannot be recovered.",
    confirm: "Permanently Delete",
    cancel: "Cancel",
  }
};

export default settings;
