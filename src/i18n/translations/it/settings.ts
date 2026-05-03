import { Translation } from '../types';

const settings: Translation['settings'] = {
  title: "Impostazioni",
  interface: {
    title: "Interfaccia e Aspetto",
    darkMode: "Modalità Scura",
    lightMode: "Modalità Chiara",
    tapToChangeTheme: "Tocca per cambiare il tema",
    language: "Lingua",
    tapToChangeLanguage: "Tocca per cambiare la lingua",
    nativeLanguage: "Lingua nativa",
    tapToChangeNativeLanguage: "La lingua che parli attualmente",
    appLanguage: "Lingua dell'app",
    appLangNative: "Nativo",
    appLangEn: "Inglese",
  },
  notifications: {
    title: "Notifiche",
    statusLabel: "Stato Avvisi",
    enabledDesc: "Le notifiche sono attivate.",
    disabledDesc: "Le notifiche sono disattivate."
  },
  account: {
    title: "Account",
    linkGoogle: "Collega Account con Google",
    logout: "Disconnetti",
    deleteAccount: "Elimina Account",
  },
  audio: {
    title: "Audio",
    spanishVoice: "Voce spagnola",
    englishVoice: "Voce inglese",
    defaultVoice: "Voce predefinita",
    configuredVoice: "Voce configurata",
    kokoroModel: "Modello vocale Kokoro (Inglese)",
    downloading: "Download in corso: ...",
    offlineVoiceDesc: "Richiede il download per la voce offline",
    download: "Scarica",
    installed: "Installato",
    update: "Aggiorna",
    sfx: "Effetti sonori",
    bgm: "Musica di sottofondo",
    selectSpanishVoice: "Seleziona voce spagnola",
    selectEnglishVoice: "Seleziona voce inglese",
    close: "Chiudi",
  },
  deleteAccount: {
    title: "Eliminare l'account?",
    description: "Questa azione è irreversibile. Tutti i tuoi progressi verranno eliminati permanentemente e non potrai recuperarli.",
    confirm: "Elimina permanentemente",
    cancel: "Annulla",
  }
};

export default settings;
