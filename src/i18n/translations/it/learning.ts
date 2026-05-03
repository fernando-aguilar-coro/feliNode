import { Translation } from '../types';

const learning: Translation['learning'] = {
  ai: {
    button: "Valuta/spiega con l'IA!",
    correct: "Corretto secondo l'IA!",
    incorrect: "Errato secondo l'IA",
    errorTitle: "Errore",
    errorDesc: "Impossibile ottenere la valutazione dell'IA in questo momento.",
    parseErrorSpecific: "Errore nell'elaborazione della spiegazione specifica.",
    parseErrorGeneral: "Impossibile ottenere la spiegazione generale.",
    successTitle: "Ben fatto!",
    errorTitleCard: "Correzione",
    specificAnalysis: "Analisi Specifica",
    stepByStep: "Risposta corretta passo dopo passo"
  },
  title: "Apprendimento",
  showStreak: "Mostra Serie",
  showStreakDesc: "Vedi il contatore dei giorni consecutivi",
  choseInitialTest: {
    title: "Scegli il tuo livello",
    subtitle: "Seleziona il test che meglio si adatta a te.",
    startFromZero: "Inizia da 0",
    orTakeLevelTest: "Oppure fai un test di livello:",
    levelA1: "Livello A1 (Principiante)",
    levelA2: "Livello A2 (Base)",
    levelB1: "Livello B1 (Intermedio)",
    levelB2: "Livello B2 (Intermedio Superiore)",
    levelC1: "Livello C1 (Avanzato)"
  },
  infinity: {
    generating: "Generazione esercizi infiniti...",
    gameOver: "Partita Terminata",
    livesLost: "Hai esaurito le vite! Hai completato {{count}} esercizi correttamente.",
    tryAgain: "Riprova",
    exit: "Esci",
    errorGenerating: "Impossibile generare esercizi.",
    retry: "Riprova",
    back: "Indietro",
    modeName: "Modalità Infinito",
    loadingMore: "Caricamento altri...",
    lives: "❤️ x {{lives}}"
  },
  modeSelection: {
    chooseMode: "Scegli la tua modalità",
    theory: "Teoria",
    infinityExercises: "Esercizi Infiniti",
    exam: "Esame",
    back: "Indietro",
    loading: "Caricamento..."
  },
  practice: {
    title: "Pratica",
    infinityChallenge: "Sfida Infinita",
    infinityDesc: "Esercizi di vocabolario e grammatica senza fine.",
    record: "Record: {{score}}",
    matching: "Abbinamento",
    matchingDesc: "Unisci le parole al loro significato o traduzione.",
    voiceAssessment: "Valutazione Vocale",
    voiceDesc: "Parla liberamente e valuta la tua pronuncia.",
    freeConversation: "Conversazione Libera",
    freeConvDesc: "Esercitati a parlare con l'IA in modo naturale.",
    chooseFocus: "Scegli un obiettivo o un argomento opzionale per la tua pratica.",
    focusLabel: "Obiettivo (Opzionale)",
    focusPlaceholder: "Es. saluti, grammatica, animali...",
    cancel: "Annulla",
    start: "Inizia"
  },

  theory: {
    title: "Teoria",
    skip: "Salta",
    goToExam: "Vai all'esame"
  },
  pronunciation: {
    generalPractice: "Pratica Generale",
    pronouncePhrase: "Pronuncia la seguente frase:",
    title: "Valutazione Vocale",
    question: "Quale frase vuoi praticare?",
    description: "Scrivi una frase in italiano o inglese per valutare la tua pronuncia.",
    inputPlaceholder: "Scrivi qui la tua frase...",
    startPractice: "Inizia Pratica",
    tryAnother: "Prova un'altra frase",
    leeFrase: "Leggi questa frase:",
    precision: "Precisione Generale:",
    analizando: "Analisi in corso...",
    reintentar: "Riprova",
    enviar: "Invia",
    error: "Errore",
    errorAssess: "Impossibile analizzare la pronuncia.",
    detailedAnalysis: "Analisi Dettagliata",
    metrics: {
      precision: "Precisione",
      fluency: "Fluidezza",
      completeness: "Completezza",
      pronunciation: "Pronuncia"
    },
    suggestions: "Suggerimenti di Miglioramento"
  },
  exercises: {
    unknownType: "Tipo di esercizio sconosciuto",
    skip: "Salta",
    checkAnswer: "Controlla Risposta",
    next: "Avanti",
    translatePhrase: "Traduci questa frase...",
    close: "Chiudi",
    wordSignifies: "\"{{word}}\" significa: ",
    suggestTopic: "Suggerisci argomento",
    errorRecommend: "Impossibile ottenere un suggerimento per l'argomento.",
    suggestPhrase: "Suggerisci frase",
    errorRecommendPhrase: "Impossibile ottenere un suggerimento per la frase.",
    fillBlank: "Scrivi la parola mancante...",
    listening: {
      normal: "Normale",
      slow: "Lento",
      ultraSlow: "Ultra Lento",
      instruction: "Ordina le parole che ascolti:"
    },
    scrambled: "Tocca le parole per formare la frase:"
  },
  quitLesson: {
    title: "Uscire dalla lezione?",
    description: "Se esci ora, perderai i progressi di questa lezione.",
    confirm: "Sì, esci",
    cancel: "Annulla"
  }
};

export default learning;
