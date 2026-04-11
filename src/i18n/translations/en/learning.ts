import { Translation } from '../types';

const learning: Translation['learning'] = {
  ai: {
    button: "Rate/explain with AI!",
    correct: "Correct according to AI!",
    incorrect: "Incorrect according to AI",
    errorTitle: "Error",
    errorDesc: "Could not get AI evaluation at this time.",
    parseErrorSpecific: "Error processing specific explanation.",
    parseErrorGeneral: "Could not obtain general explanation.",
    successTitle: "Well done!",
    errorTitleCard: "Correction",
    specificAnalysis: "Specific Analysis",
    stepByStep: "Correct answer step by step"
  },
  title: "Learning",
  showStreak: "Show Streak",
  showStreakDesc: "View consecutive days counter",
  choseInitialTest: {
    title: "Choose your level",
    subtitle: "Select the test that best fits you.",
    startFromZero: "Start from 0",
    orTakeLevelTest: "Or take a level test:",
    levelA1: "Level A1 (Beginner)",
    levelA2: "Level A2 (Basic)",
    levelB1: "Level B1 (Intermediate)",
    levelB2: "Level B2 (Upper Intermediate)",
    levelC1: "Level C1 (Advanced)"
  },
  infinity: {
    generating: "Generating infinite exercises...",
    gameOver: "Game Over",
    livesLost: "You've run out of lives! You have completed {{count}} exercises correctly.",
    tryAgain: "Try again",
    exit: "Exit",
    errorGenerating: "Exercises could not be generated.",
    retry: "Retry",
    back: "Back",
    modeName: "Infinite Mode",
    loadingMore: "Loading more...",
    lives: "❤️ x {{lives}}"
  },
  modeSelection: {
    chooseMode: "Choose your mode",
    theory: "Theory",
    infinityExercises: "Infinite Exercises",
    exam: "Exam",
    back: "Back",
    loading: "Loading..."
  },
  practice: {
    title: "Practice",
    infinityChallenge: "Infinity Challenge",
    infinityDesc: "Endless vocabulary and grammar exercises.",
    record: "Record: {{score}}",
    matching: "Matching",
    matchingDesc: "Match words with their meaning or translation.",
    voiceAssessment: "Voice Assessment",
    voiceDesc: "Speak freely and evaluate your pronunciation.",
    freeConversation: "Free Conversation",
    freeConvDesc: "Practice speaking with AI naturally.",
    chooseFocus: "Choose an optional focus or topic for your practice.",
    focusLabel: "Focus (Optional)",
    focusPlaceholder: "Ex. greetings, grammar, animals...",
    cancel: "Cancel",
    start: "Start"
  },

  theory: {
    title: "Theory",
    skip: "Skip",
    goToExam: "Go to exam"
  },
  pronunciation: {
    generalPractice: "General Practice",
    pronouncePhrase: "Pronounce the following phrase:",
    title: "Voice Assessment",
    question: "What phrase do you want to practice?",
    description: "Write a phrase in Spanish or English to evaluate your pronunciation.",
    inputPlaceholder: "Write your phrase here...",
    startPractice: "Start Practice",
    tryAnother: "Try another phrase",
    leeFrase: "Read this phrase:",
    precision: "Overall Precision:",
    analizando: "Analyzing...",
    reintentar: "Retry",
    enviar: "Send",
    error: "Error",
    errorAssess: "Could not analyze pronunciation.",
    detailedAnalysis: "Detailed Analysis",
    metrics: {
      precision: "Precision",
      fluency: "Fluency",
      completeness: "Completeness",
      pronunciation: "Pronunciation"
    },
    suggestions: "Suggestions for Improvement"
  },
  exercises: {
    unknownType: "Unknown exercise type",
    skip: "Skip",
    checkAnswer: "Check Answer",
    next: "Next",
    translatePhrase: "Translate this phrase...",
    close: "Close",
    wordSignifies: "\"{{word}}\" means: ",
    suggestTopic: "Suggest topic",
    errorRecommend: "Could not get a topic recommendation.",
    suggestPhrase: "Suggest phrase",
    errorRecommendPhrase: "Could not get a phrase recommendation.",
    fillBlank: "Write the missing word...",
    listening: {
      normal: "Normal",
      slow: "Slow",
      ultraSlow: "Ultra Slow",
      instruction: "Arrange the words you hear:"
    },
    scrambled: "Tap the words to form the sentence:"
  },
  quitLesson: {
    title: "Quit lesson?",
    description: "If you leave now, you will lose your progress in this lesson.",
    confirm: "Yes, quit",
    cancel: "Cancel"
  }
};

export default learning;
