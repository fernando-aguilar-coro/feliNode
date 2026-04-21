import { Translation } from '../types';

const settings: Translation['settings'] = {
  title: "Paramètres",
  interface: {
    title: "Interface et Apparence",
    darkMode: "Mode Sombre",
    lightMode: "Mode Clair",
    tapToChangeTheme: "Appuyez pour changer le thème",
    language: "Langue",
    tapToChangeLanguage: "Appuyez pour changer la langue",
    nativeLanguage: "Langue maternelle",
    tapToChangeNativeLanguage: "La langue que vous parlez actuellement",
    appLanguage: "Langue de l'application",
    appLangNative: "Natif",
    appLangEn: "Anglais",
  },
  notifications: {
    title: "Notifications",
    statusLabel: "État des alertes",
    enabledDesc: "Les notifications sont activées.",
    disabledDesc: "Les notifications sont désactivées."
  },
  account: {
    title: "Compte",
    linkGoogle: "Lier le compte à Google",
    logout: "Se déconnecter",
    deleteAccount: "Supprimer le compte",
  },
  audio: {
    title: "Audio",
    spanishVoice: "Voix Espagnole",
    englishVoice: "Voix Anglaise",
    defaultVoice: "Voix par défaut",
    configuredVoice: "Voix configurée",
    kokoroModel: "Modèle Vocal Kokoro (Anglais)",
    downloading: "Téléchargement : ...",
    offlineVoiceDesc: "Nécessite un téléchargement pour la voix hors ligne",
    download: "Télécharger",
    installed: "Installé",
    update: "Mettre à jour",
    sfx: "Effets sonores",
    bgm: "Musique de fond",
    selectSpanishVoice: "Choisir la voix espagnole",
    selectEnglishVoice: "Choisir la voix anglaise",
    close: "Fermer",
  },
  deleteAccount: {
    title: "Supprimer le compte ?",
    description: "Cette action est irréversible. Toute votre progression sera définitivement supprimée et ne pourra pas être récupérée.",
    confirm: "Supprimer définitivement",
    cancel: "Annuler",
  }
};

export default settings;
