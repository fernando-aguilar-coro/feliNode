import { Translation } from '../types';

const settings: Translation['settings'] = {
  title: "Ajustes",
  interface: {
    title: "Interface e Aparência",
    darkMode: "Modo Escuro",
    lightMode: "Modo Claro",
    tapToChangeTheme: "Toque para mudar o tema",
    language: "Idioma",
    tapToChangeLanguage: "Toque para mudar o idioma",
    nativeLanguage: "Idioma nativo",
    tapToChangeNativeLanguage: "O idioma que você fala atualmente",
    appLanguage: "Idioma do app",
    appLangNative: "Nativo",
    appLangEn: "Inglês",
  },
  notifications: {
    title: "Notificações",
    statusLabel: "Status de Alertas",
    enabledDesc: "As notificações estão ativadas.",
    disabledDesc: "As notificações estão desativadas."
  },
  account: {
    title: "Conta",
    linkGoogle: "Vincular Conta com Google",
    logout: "Sair",
    deleteAccount: "Excluir Conta",
  },
  audio: {
    title: "Áudio",
    spanishVoice: "Voz em espanhol",
    englishVoice: "Voz em inglês",
    defaultVoice: "Voz padrão",
    configuredVoice: "Voz configurada",
    kokoroModel: "Modelo de voz Kokoro (Inglês)",
    downloading: "Baixando: ...",
    offlineVoiceDesc: "Requer download para voz offline",
    download: "Baixar",
    installed: "Instalado",
    update: "Atualizar",
    sfx: "Efeitos sonoros",
    bgm: "Música de fundo",
    selectSpanishVoice: "Selecionar voz espanhola",
    selectEnglishVoice: "Selecionar voz inglesa",
    close: "Fechar",
  },
  deleteAccount: {
    title: "Excluir conta?",
    description: "Esta ação é irreversível. Todo o seu progresso será excluído permanentemente e você não poderá recuperá-lo.",
    confirm: "Excluir permanentemente",
    cancel: "Cancelar",
  }
};

export default settings;
