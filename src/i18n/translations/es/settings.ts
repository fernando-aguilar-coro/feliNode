import { Translation } from '../types';

const settings: Translation['settings'] = {
  title: "Ajustes",
  interface: {
    title: "Interfaz y Apariencia",
    darkMode: "Modo Oscuro",
    lightMode: "Modo Claro",
    tapToChangeTheme: "Toca para cambiar el tema",
    language: "Idioma",
    tapToChangeLanguage: "Toca para cambiar el idioma"
  },
  notifications: {
    title: "Notificaciones",
    statusLabel: "Estado de Alertas",
    enabledDesc: "Las notificaciones están activadas.",
    disabledDesc: "Las notificaciones están desactivadas."
  },
  account: {
    title: "Cuenta",
    linkGoogle: "Vincular Cuenta con Google",
    logout: "Cerrar Sesión",
    deleteAccount: "Eliminar Cuenta",
  },
  audio: {
    title: "Audio",
    spanishVoice: "Voz en español",
    englishVoice: "Voz en inglés",
    defaultVoice: "Voz por defecto",
    configuredVoice: "Voz configurada",
    kokoroModel: "Modelo de voz Kokoro (Inglés)",
    downloading: "Descargando: ...",
    offlineVoiceDesc: "Requiere descarga para voz offline",
    download: "Descargar",
    installed: "Instalado",
    update: "Actualizar",
    sfx: "Efectos de sonido",
    bgm: "Música de fondo",
    selectSpanishVoice: "Seleccionar voz española",
    selectEnglishVoice: "Seleccionar voz inglesa",
    close: "Cerrar",
  },
  deleteAccount: {
    title: "¿Eliminar cuenta?",
    description: "Esta acción es irreversible. Se borrará todo tu progreso de forma permanente y no podrás recuperarlo.",
    confirm: "Eliminar permanentemente",
    cancel: "Cancelar",
  }
};

export default settings;
