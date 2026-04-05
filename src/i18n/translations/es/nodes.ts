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
    ranking: "Ranking"
  },
  tree: {
    errorTitle: "Error"
  }
};

export default nodes;
