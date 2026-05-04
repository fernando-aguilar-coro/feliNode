import { Translation } from '../types';

const nodes: Translation['nodes'] = {
  progress: {
    exam: "Examen",
    module: "Module {{index}} : {{title}}",
    completedPercentage: "{{percentage}}% Terminé",
    overallProgress: "Votre progression globale",
    lessonsCompleted: "{{completed}} sur {{total}} leçons terminées",
    streak: "Série",
    exp: "Exp",
    coins: "Pièces",
    ranking: "Rang",
    unit: "UNITÉ {{index}}"
  },
  tree: {
    errorTitle: "Erreur",
    moduleLessonsDescription: "Sélectionnez une leçon pour commencer à pratiquer cette unité."
  },
  training: {
    markCompletedConfirm: "Êtes-vous sûr de vouloir marquer cette leçon comme terminée ? Vous ne recevrez pas d'expérience (XP) pour cela."
  },
  continueWhereLeftOff: {
    title: "Continuer",
    allDone: "Tout est prêt ! 🎓",
    lesson: "Leçon",
    practiceInfinite: "Infini",
    practicePairs: "Paires",
    practiceVoice: "Voix",
    practiceSpeak: "Parler"
  }
};

export default nodes;
