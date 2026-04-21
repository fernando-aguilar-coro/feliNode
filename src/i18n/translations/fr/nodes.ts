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
    ranking: "Rang"
  },
  tree: {
    errorTitle: "Erreur",
    moduleLessonsDescription: "Sélectionnez une leçon pour commencer à pratiquer cette unité."
  },
  training: {
    markCompletedConfirm: "Êtes-vous sûr de vouloir marquer cette leçon comme terminée ? Vous ne recevrez pas d'expérience (XP) pour cela."
  }
};

export default nodes;
