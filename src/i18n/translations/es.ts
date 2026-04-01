export default {
  auth: {
    login: {
      emailRequired: "Por favor ingresa tu correo",
      sendCodeError: "Error al enviar el código",
      codeRequired: "Por favor ingresa el código de 6 dígitos",
      verifyCodeError: "El código es incorrecto o ha expirado",
      loginWithEmail: "Iniciar sesión con Email",
      guestMode: "Modo Invitado",
      // Header
      titleInitial: "Inicia sesión",
      titleEmail: "Bienvenido",
      titleVerify: "Verificación",
      subtitleInitial: "Aprende inglés de forma fácil y divertida.",
      subtitleEmail: "Inicia sesión con tu correo electrónico",
      subtitleVerify: "Ingresa el código enviado a {{email}}",
      // Form
      emailLabel: "Correo electrónico",
      emailPlaceholder: "ejemplo@correo.com",
      codeLabel: "Código de verificación",
      codePlaceholder: "123456",
      processing: "Procesando...",
      continueWithEmail: "Continuar con Email",
      verifyAndLogin: "Verificar e Ingresar",
      goBack: "Volver",
      changeEmail: "Cambiar correo",
      // Social
      googleSignInError: "Error con Google Sign In",
      continueWithGoogle: "Continuar con Google"
    }
  },
  nodes: {
    progress: {
      exam: "Examen",
      module: "Módulo {{index}}: {{title}}",
      completedPercentage: "{{percentage}}% Completado",
      overallProgress: "Tu Progreso Global",
      lessonsCompleted: "{{completed}} de {{total}} lecciones completadas",
      streak: "Racha",
      exp: "Exp",
      coins: "Monedas"
    },
    tree: {
      errorTitle: "Error"
    }
  },
  settings: {
    title: "Ajustes",
    interface: {
      title: "Interfaz y Apariencia",
      darkMode: "Modo Oscuro",
      lightMode: "Modo Claro",
      tapToChangeTheme: "Toca para cambiar el tema",
      language: "Idioma",
      tapToChangeLanguage: "Toca para cambiar el idioma"
    },
    notifications: {
      title: "Notificaciones",
      showStreak: "Mostrar Racha",
      showStreakDesc: "Ver contador de días seguidos",
      statusLabel: "Estado de Alertas",
      enabledDesc: "Las notificaciones están activadas.",
      disabledDesc: "Las notificaciones están desactivadas."
    },
    account: {
      title: "Cuenta",
      linkGoogle: "Vincular Cuenta con Google",
      logout: "Cerrar Sesión",
      deleteAccount: "Eliminar Cuenta",
    },
    audio: {
      title: "Audio",
      spanishVoice: "Voz en español",
      englishVoice: "Voz en inglés",
      defaultVoice: "Voz por defecto",
      configuredVoice: "Voz configurada",
      kokoroModel: "Modelo de voz Kokoro (Inglés)",
      downloading: "Descargando: ...",
      offlineVoiceDesc: "Requiere descarga para voz offline",
      download: "Descargar",
      installed: "Instalado",
      update: "Actualizar",
      sfx: "Efectos de sonido",
      bgm: "Música de fondo",
      selectSpanishVoice: "Seleccionar voz española",
      selectEnglishVoice: "Seleccionar voz inglesa",
      close: "Cerrar",
    },
    learning: {
      title: "Aprendizaje",
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
        errorAssess: "No se pudo analizar la pronunciación."
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
        recommendPhrase: "Recomendar frase",
        errorRecommendPhrase: "No se pudo obtener una recomendación de frase."
      }
    },
    deleteAccount: {
      title: "¿Eliminar cuenta?",
      description: "Esta acción es irreversible. Se borrará todo tu progreso de forma permanente y no podrás recuperarlo.",
      confirm: "Eliminar permanentemente",
      cancel: "Cancelar",
    }
  },
  notificationService: {
    channelName: "Recordatorios de Racha",
    practice: [
        { title: "¡Momento de practicar! 📚", body: "Solo unos minutos hoy pueden mejorar mucho tu inglés." },
        { title: "Pequeños pasos, gran progreso 🌟", body: "Practica un poco ahora y sigue avanzando." },
        { title: "¿Listo para tu inglés de hoy? 🤔", body: "Nunca es tarde para aprender algo nuevo. ¡Empieza!" },
        { title: "Tu meta está cerca 🗣️", body: "Cada práctica te acerca a hablar con fluidez." },
        { title: "Constancia es la clave 🧠", body: "Un poco cada día hace la diferencia. ¡Vamos!" },
        { title: "No rompas la racha 🔥", body: "Llevas buen progreso, ¡continúa hoy!" },
        { title: "Un minuto cuenta ⏱️", body: "Incluso una práctica corta suma. ¡Inténtalo ahora!" },
        { title: "Hazlo divertido 🎯", body: "Aprender inglés también puede ser entretenido." },
        { title: "Tu inglés está creciendo 🌱", body: "Sigue practicando para verlo florecer." },
        { title: "Desafío del día ⚡", body: "Entra y completa tu práctica diaria." }
    ],
    risk: [
        { title: "¡Es hora de practicar! 📚", body: "Tienes una racha de {{streak}} días. ¡Haz una lección ahora para que no afecte a tus protectores!" },
        { title: "¡Tu racha está en riesgo! 🚨", body: "Protege tu racha de {{streak}} días dedicando unos minutos al inglés." },
        { title: "El tiempo vuela ⏰", body: "Conserva tu racha de {{streak}} días practicando ahora." },
        { title: "¡No te rindas! 💪", body: "Asegura tu racha de {{streak}} días con una lección corta." }
    ],
    danger: [
        { title: "¡No pierdas tu racha! 🔥", body: "Solo queda una hora para medianoche. ¡Completa una lección ahora mismo!" },
        { title: "Última oportunidad ⏳", body: "Tu racha está a punto de reiniciarse. ¡Practica ya!" },
        { title: "¡Actúa rápido! ⚡", body: "Queda muy poco para que termine el día. ¡Salva tu racha!" },
        { title: "¡Es ahora o nunca! 🏃", body: "No dejes que el reloj te gane sin practicar hoy." }
    ]
  }
};
