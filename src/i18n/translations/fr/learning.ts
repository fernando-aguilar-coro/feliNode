import { Translation } from '../types';

const learning: Translation['learning'] = {
  ai: {
    button: "Évaluer/expliquer avec l'IA !",
    correct: "Correct selon l'IA !",
    incorrect: "Incorrect selon l'IA",
    errorTitle: "Erreur",
    errorDesc: "Impossible d'obtenir l'évaluation de l'IA pour le moment.",
    parseErrorSpecific: "Erreur lors du traitement de l'explication spécifique.",
    parseErrorGeneral: "Impossible d'obtenir une explication générale.",
    successTitle: "Bien joué !",
    errorTitleCard: "Correction",
    specificAnalysis: "Analyse spécifique",
    stepByStep: "Réponse correcte étape par étape"
  },
  title: "Apprentissage",
  showStreak: "Afficher la série",
  showStreakDesc: "Voir le compteur de jours consécutifs",
  choseInitialTest: {
    title: "Choisissez votre niveau",
    subtitle: "Sélectionnez le test qui vous convient le mieux.",
    startFromZero: "Partir de zéro",
    orTakeLevelTest: "Ou passez un test de niveau :",
    levelA1: "Niveau A1 (Débutant)",
    levelA2: "Niveau A2 (Élémentaire)",
    levelB1: "Niveau B1 (Intermédiaire)",
    levelB2: "Niveau B2 (Intermédiaire supérieur)",
    levelC1: "Niveau C1 (Avancé)"
  },
  infinity: {
    generating: "Génération d'exercices infinis...",
    gameOver: "Partie terminée",
    livesLost: "Vous n'avez plus de vies ! Vous avez terminé {{count}} exercices correctement.",
    tryAgain: "Réessayer",
    exit: "Quitter",
    errorGenerating: "Les exercices n'ont pas pu être générés.",
    retry: "Réessayer",
    back: "Retour",
    modeName: "Mode Infini",
    loadingMore: "Chargement de la suite...",
    lives: "❤️ x {{lives}}"
  },
  modeSelection: {
    chooseMode: "Choisissez votre mode",
    theory: "Théorie",
    infinityExercises: "Exercices Infinis",
    exam: "Examen",
    back: "Retour",
    loading: "Chargement..."
  },
  practice: {
    title: "Pratique",
    infinityChallenge: "Défi Infini",
    infinityDesc: "Exercices de vocabulaire et de grammaire sans fin.",
    record: "Record : {{score}}",
    matching: "Correspondance",
    matchingDesc: "Associez les mots à leur sens ou à leur traduction.",
    voiceAssessment: "Évaluation Vocale",
    voiceDesc: "Parlez librement et évaluez votre prononciation.",
    freeConversation: "Conversation Libre",
    freeConvDesc: "Pratiquez l'anglais avec l'IA naturellement.",
    chooseFocus: "Choisissez un thème ou un sujet optionnel pour votre pratique.",
    focusLabel: "Focus (Optionnel)",
    focusPlaceholder: "Ex. salutations, grammaire, animaux...",
    cancel: "Annuler",
    start: "Commencer"
  },
  theory: {
    title: "Théorie",
    skip: "Passer",
    goToExam: "Aller à l'examen"
  },
  pronunciation: {
    generalPractice: "Pratique générale",
    pronouncePhrase: "Prononcez la phrase suivante :",
    title: "Évaluation Vocale",
    question: "Quelle phrase voulez-vous pratiquer ?",
    description: "Écrivez une phrase en espagnol ou en anglais pour évaluer votre prononciation.",
    inputPlaceholder: "Écrivez votre phrase ici...",
    startPractice: "Commencer la pratique",
    tryAnother: "Essayer une autre phrase",
    leeFrase: "Lisez cette phrase :",
    precision: "Précision globale :",
    analizando: "Analyse en cours...",
    reintentar: "Réessayer",
    enviar: "Envoyer",
    error: "Erreur",
    errorAssess: "Impossible d'analyser la prononciation.",
    detailedAnalysis: "Analyse détaillée",
    metrics: {
      precision: "Précision",
      fluency: "Fluidité",
      completeness: "Complétude",
      pronunciation: "Prononciation"
    },
    suggestions: "Suggestions d'amélioration"
  },
  exercises: {
    unknownType: "Type d'exercice inconnu",
    skip: "Passer",
    checkAnswer: "Vérifier la réponse",
    next: "Suivant",
    translatePhrase: "Traduisez cette phrase...",
    close: "Fermer",
    wordSignifies: "\"{{word}}\" signifie : ",
    suggestTopic: "Suggérer un sujet",
    errorRecommend: "Impossible d'obtenir une recommandation de sujet.",
    suggestPhrase: "Suggérer une phrase",
    errorRecommendPhrase: "Impossible d'obtenir une recommandation de phrase.",
    fillBlank: "Écrivez le mot manquant...",
    listening: {
      normal: "Normal",
      slow: "Lent",
      ultraSlow: "Très lent",
      instruction: "Organisez les mots que vous entendez :"
    },
    scrambled: "Appuyez sur les mots pour former la phrase :"
  },
  quitLesson: {
    title: "Quitter la leçon ?",
    description: "Si vous partez maintenant, vous perdrez votre progression dans cette leçon.",
    confirm: "Oui, quitter",
    cancel: "Annuler"
  }
};

export default learning;
