import { Translation } from '../types';

const nodes: Translation['nodes'] = {
  progress: {
    exam: "Esame",
    module: "Modulo {{index}}: {{title}}",
    completedPercentage: "{{percentage}}% Completato",
    overallProgress: "Il Tuo Progresso Globale",
    lessonsCompleted: "{{completed}} di {{total}} lezioni completate",
    streak: "Serie",
    exp: "Exp",
    coins: "Monete",
    ranking: "Classifica"
  },
  tree: {
    errorTitle: "Errore",
    moduleLessonsDescription: "Seleziona una lezione per iniziare a fare pratica con questa unità."
  },
  training: {
    markCompletedConfirm: "Sei sicuro di voler segnare questa lezione come completata? Non riceverai esperienza (XP) per questo."
  },
  continueWhereLeftOff: {
    title: "Continua",
    allDone: "Tutto pronto! 🎓",
    lesson: "Lezione",
    practiceInfinite: "Infinito",
    practicePairs: "Coppie",
    practiceVoice: "Voce",
    practiceSpeak: "Parlare"
  }
};

export default nodes;
