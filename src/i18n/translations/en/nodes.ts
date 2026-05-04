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
    ranking: "Top",
    unit: "UNIT {{index}}"
  },
  tree: {
    errorTitle: "Error",
    moduleLessonsDescription: "Select a lesson to start practicing this unit."
  },
  training: {
    markCompletedConfirm: "Are you sure you want to mark this lesson as completed? You won't receive experience (XP) for this."
  },
  continueWhereLeftOff: {
    title: "Continue",
    allDone: "All set! 🎓",
    lesson: "Lesson",
    practiceInfinite: "Infinite",
    practicePairs: "Pairs",
    practiceVoice: "Voice",
    practiceSpeak: "Speak"
  }
};

export default nodes;
