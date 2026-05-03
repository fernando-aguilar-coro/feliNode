import { Translation } from '../types';

const learning: Translation['learning'] = {
  ai: {
    button: "Avaliar/explicar com IA!",
    correct: "Correto segundo a IA!",
    incorrect: "Incorreto segundo a IA",
    errorTitle: "Erro",
    errorDesc: "Não foi possível obter a avaliação da IA neste momento.",
    parseErrorSpecific: "Erro ao processar a explicação específica.",
    parseErrorGeneral: "Não foi possível obter a explicação geral.",
    successTitle: "Bem feito!",
    errorTitleCard: "Correção",
    specificAnalysis: "Análise Específica",
    stepByStep: "Resposta correta passo a passo"
  },
  title: "Aprendizado",
  showStreak: "Mostrar Ofensiva",
  showStreakDesc: "Ver contador de dias seguidos",
  choseInitialTest: {
    title: "Escolha seu nível",
    subtitle: "Selecione o teste que melhor se adapta a você.",
    startFromZero: "Começar do 0",
    orTakeLevelTest: "Ou faça um teste de nível:",
    levelA1: "Nível A1 (Iniciante)",
    levelA2: "Nível A2 (Básico)",
    levelB1: "Nível B1 (Intermediário)",
    levelB2: "Nível B2 (Intermediário Alto)",
    levelC1: "Nível C1 (Avançado)"
  },
  infinity: {
    generating: "Gerando exercícios infinitos...",
    gameOver: "Jogo Terminado",
    livesLost: "Você ficou sem vidas! Você completou {{count}} exercícios corretamente.",
    tryAgain: "Tentar novamente",
    exit: "Sair",
    errorGenerating: "Não foi possível gerar exercícios.",
    retry: "Tentar novamente",
    back: "Voltar",
    modeName: "Modo Infinito",
    loadingMore: "Carregando mais...",
    lives: "❤️ x {{lives}}"
  },
  modeSelection: {
    chooseMode: "Escolha seu modo",
    theory: "Teoria",
    infinityExercises: "Exercícios Infinitos",
    exam: "Exame",
    back: "Voltar",
    loading: "Carregando..."
  },
  practice: {
    title: "Prática",
    infinityChallenge: "Desafio Infinito",
    infinityDesc: "Exercícios de vocabulário e gramática sem fim.",
    record: "Recorde: {{score}}",
    matching: "Combinar",
    matchingDesc: "Una palavras com seu significado ou tradução.",
    voiceAssessment: "Avaliação de Voz",
    voiceDesc: "Fale livremente e avalie sua pronúncia.",
    freeConversation: "Conversa Livre",
    freeConvDesc: "Pratique falar com IA de forma natural.",
    chooseFocus: "Escolha um foco ou tema opcional para sua prática.",
    focusLabel: "Foco (Opcional)",
    focusPlaceholder: "Ex. saudações, gramática, animais...",
    cancel: "Cancelar",
    start: "Começar"
  },

  theory: {
    title: "Teoria",
    skip: "Pular",
    goToExam: "Ir para o exame"
  },
  pronunciation: {
    generalPractice: "Prática Geral",
    pronouncePhrase: "Pronuncie a seguinte frase:",
    title: "Avaliação de Voz",
    question: "Qual frase você quer praticar?",
    description: "Escreva uma frase em português ou inglês para avaliar sua pronúncia.",
    inputPlaceholder: "Escreva aqui sua frase...",
    startPractice: "Começar Prática",
    tryAnother: "Tentar outra frase",
    leeFrase: "Leia esta frase:",
    precision: "Precisão Geral:",
    analizando: "Analisando...",
    reintentar: "Tentar novamente",
    enviar: "Enviar",
    error: "Erro",
    errorAssess: "Não foi possível analisar a pronúncia.",
    detailedAnalysis: "Análise Detalhada",
    metrics: {
      precision: "Precisão",
      fluency: "Fluidez",
      completeness: "Completitude",
      pronunciation: "Pronúncia"
    },
    suggestions: "Sugestões de Melhoria"
  },
  exercises: {
    unknownType: "Tipo de exercício desconhecido",
    skip: "Pular",
    checkAnswer: "Verificar Resposta",
    next: "Próximo",
    translatePhrase: "Traduza esta frase...",
    close: "Fechar",
    wordSignifies: "\"{{word}}\" significa: ",
    suggestTopic: "Sugerir tema",
    errorRecommend: "Não foi possível obter uma recomendação de tema.",
    suggestPhrase: "Sugerir frase",
    errorRecommendPhrase: "Não foi possível obter uma recomendação de frase.",
    fillBlank: "Escreva a palavra que falta...",
    listening: {
      normal: "Normal",
      slow: "Lento",
      ultraSlow: "Muito Lento",
      instruction: "Ordene as palavras que você ouve:"
    },
    scrambled: "Toque nas palavras para formar a frase:"
  },
  quitLesson: {
    title: "Sair da lição?",
    description: "Se sair agora, você perderá o progresso desta lição.",
    confirm: "Sim, sair",
    cancel: "Cancelar"
  }
};

export default learning;
