import { Translation } from '../types';

const home: Translation['home'] = {
  tabs: {
    learn: "Aprende",
    practice: "Practica",
    settings: "Ajustes"
  },
  offline: "Conexión a internet no disponible, algunas funciones no estarán disponibles",
  viewModes: {
    tree: "Cambiar a Mapa de Nodos",
    list: "Cambiar a Vista de Lista"
  },
  modals: {
    kokoro: {
      title: "Mejorar Pronunciación",
      description: "nekoEnglish puede usar un modelo de voz avanzado (Kokoro TTS) para ofrecer una pronunciación más natural en inglés, sin necesidad de internet.",
      subtitle: "Requiere descargar un modelo de voz (aprox. 300MB) por única vez.",
      accept: "Descargar y mejorar audio",
      decline: "Usar voz Nativa (No descargar)"
    },
    firstPractice: {
      title: "¡Prueba tu Primera Práctica!",
      description: "¿Te gustaría probar un ejercicio rápido de emparejar palabras en inglés con su traducción? Es una forma divertida de empezar a practicar.",
      subtitle: "Conecta pares de palabras en inglés y español contrarreloj. 🎯",
      accept: "¡Vamos a practicar!",
      decline: "Ahora no, gracias"
    }
  }
};

export default home;
