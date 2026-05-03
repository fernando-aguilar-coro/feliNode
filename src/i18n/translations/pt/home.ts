import { Translation } from '../types';

const home: Translation['home'] = {
  tabs: {
    learn: "Aprender",
    practice: "Praticar",
    settings: "Ajustes"
  },
  offline: "Conexão com a internet indisponível, algumas funções não estarão disponíveis",
  viewModes: {
    tree: "Mudar para Mapa de Nós",
    list: "Mudar para Vista de Lista"
  },
  modals: {
    kokoro: {
      title: "Melhorar Pronúncia",
      description: "nekoEnglish pode usar um modelo de voz avançado (Kokoro TTS) para oferecer uma pronúncia mais natural em inglês, sem necessidade de internet.",
      subtitle: "Requer o download de um modelo de voz (aprox. 300MB) apenas uma vez.",
      accept: "Baixar e melhorar áudio",
      decline: "Usar voz nativa (Não baixar)"
    },
    firstPractice: {
      title: "Teste sua primeira prática!",
      description: "Gostaria de testar um exercício rápido de combinar palavras em inglês com a tradução? É uma forma divertida de começar a praticar.",
      subtitle: "Conecte pares de palavras em inglês e português contra o relógio. 🎯",
      accept: "Vamos praticar!",
      decline: "Agora não, obrigado"
    }
  }
};

export default home;
