import { Translation } from '../types';

const notificationService: Translation['notificationService'] = {
  channelName: "Lembretes de Ofensiva",
  practice: [
    { title: "Hora de praticar! 📚", body: "Apenas alguns minutos hoje podem melhorar muito seu inglês." },
    { title: "Pequenos passos, grande progresso 🌟", body: "Pratique um pouco agora e continue avançando." },
    { title: "Pronto para seu inglês de hoje? 🤔", body: "Nunca é tarde para aprender algo novo. Comece!" },
    { title: "Sua meta está próxima 🗣️", body: "Cada prática te aproxima de falar com fluidez." },
    { title: "Constância é a chave 🧠", body: "Um pouco a cada dia faz a diferença. Vamos!" },
    { title: "Não quebre a ofensiva 🔥", body: "Você está com um bom progresso, continue hoje!" },
    { title: "Um minuto conta ⏱️", body: "Mesmo uma prática curta ajuda. Tente agora!" },
    { title: "Torne divertido 🎯", body: "Aprender inglês também pode ser divertido." },
    { title: "Seu inglês está crescendo 🌱", body: "Continue praticando para vê-lo florescer." },
    { title: "Desafio do dia ⚡", body: "Entre e complete sua prática diária." }
  ],
  risk: [
    { title: "É hora de praticar! 📚", body: "Você tem uma ofensiva de {{streak}} dias. Faça uma lição agora para não afetar seus protetores!" },
    { title: "Sua ofensiva está em risco! 🚨", body: "Proteja sua ofensiva de {{streak}} dias dedicando alguns minutos ao inglês." },
    { title: "O tempo voa ⏰", body: "Conserve sua ofensiva de {{streak}} dias praticando agora." },
    { title: "Não desista! 💪", body: "Garanta sua ofensiva de {{streak}} dias com uma lição curta." }
  ],
  danger: [
    { title: "Não perca sua ofensiva! 🔥", body: "Falta apenas uma hora para a meia-noite. Complete uma lição agora mesmo!" },
    { title: "Última oportunidade ⏳", body: "Sua ofensiva está prestes a ser reiniciada. Pratique já!" },
    { title: "Aja rápido! ⚡", body: "Falta muito pouco para o dia terminar. Salve sua ofensiva!" },
    { title: "É agora ou nunca! 🏃", body: "Não deixe o relógio vencer sem praticar hoje." }
  ]
};

export default notificationService;
