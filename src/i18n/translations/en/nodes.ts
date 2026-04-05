import { Translation } from '../types';

const nodes: Translation['nodes'] = {
  progress: {
    exam: "Exam",
    module: "Module {{index}}: {{title}}",
    completedPercentage: "{{percentage}}% Completed",
    overallProgress: "Your Overall Progress",
    lessonsCompleted: "{{completed}} of {{total}} lessons completed",
    streak: "Streak",
    exp: "Exp",
    coins: "Coins",
    ranking: "Top"
  },
  tree: {
    errorTitle: "Error"
  }
};

export default nodes;
