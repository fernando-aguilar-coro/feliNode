import { Translation } from '../types';

const learning: Translation['learning'] = {
  ai: {
    button: "¡Calificar/explicar con IA!",
    correct: "¡Correcto según la IA!",
    incorrect: "Incorrecto según la IA",
    errorTitle: "Error",
    errorDesc: "No se pudo obtener la evaluación de la IA en este momento.",
    parseErrorSpecific: "Error al procesar la explicación específica.",
    parseErrorGeneral: "No se pudo obtener la explicación general.",
    successTitle: "¡Bien hecho!",
    errorTitleCard: "Corrección",
    specificAnalysis: "Análisis Específico",
    stepByStep: "Respuesta correcta paso a paso"
  },
  title: "Aprendizaje",
  showStreak: "Mostrar Racha",
  showStreakDesc: "Ver contador de días seguidos",
  choseInitialTest: {
    title: "Elige tu nivel",
    subtitle: "Selecciona la prueba que mejor se adapte a ti.",
    startFromZero: "Empezar de 0",
    orTakeLevelTest: "O toma una prueba de nivel:",
    basicLevel: "Nivel Básico",
    intermediateLevel: "Nivel Intermedio",
    advancedLevel: "Nivel Avanzado"
  },
  infinity: {
    generating: "Generando ejercicios infinitos...",
    gameOver: "Juego Terminado",
    livesLost: "¡Te has quedado sin vidas! Has completado {{count}} ejercicios correctamente.",
    tryAgain: "Intentar de nuevo",
    exit: "Salir",
    errorGenerating: "No se pudieron generar ejercicios.",
    retry: "Reintentar",
    back: "Volver",
    modeName: "Modo Infinito",
    loadingMore: "Cargando más...",
    lives: "❤️ x {{lives}}"
  },
  modeSelection: {
    chooseMode: "Elige tu modo",
    theory: "Teoría",
    infinityExercises: "Ejercicios Infinitos",
    exam: "Examen",
    back: "Volver",
    loading: "Cargando..."
  },
  practice: {
    title: "Práctica",
    infinityChallenge: "Desafío Infinito",
    infinityDesc: "Ejercicios de vocabulario y gramática sin fin.",
    record: "Récord: {{score}}",
    matching: "Emparejar",
    matchingDesc: "Une palabras con su significado o traducción.",
    voiceAssessment: "Evaluación de Voz",
    voiceDesc: "Habla libremente y evalúa tu pronunciación.",
    freeConversation: "Conversación Libre",
    freeConvDesc: "Práctica hablar con IA de forma natural.",
    chooseFocus: "Elige un enfoque o tema opcional para tu práctica.",
    focusLabel: "Enfoque (Opcional)",
    focusPlaceholder: "Ej. saludos, gramática, animales...",
    cancel: "Cancelar",
    start: "Empezar"
  },
  theory: {
    title: "Teoría",
    skip: "Saltar",
    goToExam: "Ir al examen"
  },
  pronunciation: {
    generalPractice: "Práctica General",
    pronouncePhrase: "Pronuncia la siguiente frase:",
    title: "Evaluación de Voz",
    question: "¿Qué frase quieres practicar?",
    description: "Escribe una frase en español o inglés para evaluar tu pronunciación.",
    inputPlaceholder: "Escribe aquí tu frase...",
    startPractice: "Comenzar Práctica",
    tryAnother: "Probar otra frase",
    leeFrase: "Lee esta frase:",
    precision: "Precisión General:",
    analizando: "Analizando...",
    reintentar: "Reintentar",
    enviar: "Enviar",
    error: "Error",
    errorAssess: "No se pudo analizar la pronunciación.",
    detailedAnalysis: "Análisis Detallado",
    metrics: {
      precision: "Precisión",
      fluency: "Fluidez",
      completeness: "Completitud",
      pronunciation: "Pronunciación"
    },
    suggestions: "Sugerencias de Mejora"
  },
  exercises: {
    unknownType: "Tipo de ejercicio desconocido",
    skip: "Saltar",
    checkAnswer: "Comprobar Respuesta",
    next: "Siguiente",
    translatePhrase: "Traduce esta frase...",
    close: "Cerrar",
    wordSignifies: "\"{{word}}\" significa: ",
    suggestTopic: "Sugerir tema",
    errorRecommend: "No se pudo obtener una recomendación de tema.",
    suggestPhrase: "Sugerir frase",
    errorRecommendPhrase: "No se pudo obtener una recomendación de frase.",
    fillBlank: "Escribe la palabra que falta...",
    listening: {
      normal: "Normal",
      slow: "Lento",
      ultraSlow: "Ultra Lento",
      instruction: "Ordena las palabras que escuchas:"
    },
    scrambled: "Toca las palabras para formar la oración:"
  },
  quitLesson: {
    title: "¿Salir de la lección?",
    description: "Si sales ahora, perderás el progreso de esta lección.",
    confirm: "Sí, salir",
    cancel: "Cancelar"
  }
};

export default learning;
