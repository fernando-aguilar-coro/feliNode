import { Translation } from '../types';

const nodes: Translation['nodes'] = {
  progress: {
    exam: "Examen",
    module: "Módulo {{index}}: {{title}}",
    completedPercentage: "{{percentage}}% Completado",
    overallProgress: "Tu Progreso Global",
    lessonsCompleted: "{{completed}} de {{total}} lecciones completadas",
    streak: "Racha",
    exp: "Exp",
    coins: "Monedas",
    ranking: "Ranking",
    unit: "UNIDAD {{index}}"
  },
  tree: {
    errorTitle: "Error",
    moduleLessonsDescription: "Selecciona una lección para comenzar a practicar esta unidad."
  },
  training: {
    markCompletedConfirm: "¿Estás seguro de que deseas marcar esta lección como completada? No recibirás experiencia (XP) por esto."
  },
  continueWhereLeftOff: {
    title: "Continuar",
    allDone: "¡Todo listo! 🎓",
    lesson: "Lección",
    practiceInfinite: "Infinito",
    practicePairs: "Pares",
    practiceVoice: "Voz",
    practiceSpeak: "Hablar"
  }
};

export default nodes;
