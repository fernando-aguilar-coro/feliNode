import { Translation } from '../types';

const nodes: Translation['nodes'] = {
  progress: {
    exam: "Exame",
    module: "Módulo {{index}}: {{title}}",
    completedPercentage: "{{percentage}}% Concluído",
    overallProgress: "Seu Progresso Global",
    lessonsCompleted: "{{completed}} de {{total}} lições concluídas",
    streak: "Ofensiva",
    exp: "Exp",
    coins: "Moedas",
    ranking: "Ranking",
    unit: "UNIDADE {{index}}"
  },
  tree: {
    errorTitle: "Erro",
    moduleLessonsDescription: "Selecione uma lição para começar a praticar esta unidade."
  },
  training: {
    markCompletedConfirm: "Tem certeza de que deseja marcar esta lição como concluída? Você não receberá experiência (XP) por isso."
  },
  continueWhereLeftOff: {
    title: "Continuar",
    allDone: "Tudo pronto! 🎓",
    lesson: "Lição",
    practiceInfinite: "Infinito",
    practicePairs: "Pares",
    practiceVoice: "Voz",
    practiceSpeak: "Falar"
  }
};

export default nodes;
