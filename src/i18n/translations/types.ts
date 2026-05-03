export interface Translation {
  common: {
    loading: string;
    syncing: string;
    lessons: string;
    progress: string;
    generating: string;
    lesson: string;
    placement: string;
    pairs: string;
    tips: string[];
    close: string;
    cancel: string;
    accept: string;
    confirm: string;
  };
  gamification: {
    speak: {
      thinking: string;
      placeholder: string;
      error: string;
    };
    shop: {
      loading: string;
      maxProtectors: string;
      notEnoughCoins: string;
      confirmPurchase: string;
      buyProtectorConfirm: string;
      cancel: string;
      confirm: string;
      purchaseError: string;
      errorConnection: string;
      comingSoon: string;
      buyItemConfirm: string;
      itemDisabled: string;
      successTitle: string;
      successDesc: string;
      great: string;
      items: {
        protector: {
          name: string;
          description: string;
          equipped: string;
        };
        doubleXp: {
          name: string;
          description: string;
        };
        coinDoubler: {
          name: string;
          description: string;
          equipped: string;
        };
        removeAds: {
          name: string;
          description: string;
          purchased: string;
        };
        sardineForNeko: {
          name: string;
          description: string;
        };
      };
    };
    streak: {
      loading: string;
      dayCount: string;
      daysCount: string;
      record: string;
      protectorsTitle: string;
      protectorsDesc: string;
      equipped: string;
    };
    ranking: {
      title: string;
      subtitle: string;
      emptyTitle: string;
      emptySubtitle: string;
      connectionError: string;
      connectionErrorTitle: string;
      tryAgain: string;
      loading: string;
      yourRank: string;
      keepItUp: string;
      greatJob: string;
      notInRanking: string;
      loginToParticipate: string;
      earnXpToSeeRank: string;
      createAccountToSave: string;
      anon: string;
      xp: string;
    };
  };
  home: {
    tabs: {
      learn: string;
      practice: string;
      settings: string;
    };
    offline: string;
    viewModes: {
      tree: string;
      list: string;
    };
    modals: {
      kokoro: {
        title: string;
        description: string;
        subtitle: string;
        accept: string;
        decline: string;
      };
      firstPractice: {
        title: string;
        description: string;
        subtitle: string;
        accept: string;
        decline: string;
      };
    };
  };
  auth: {
    login: {
      emailRequired: string;
      sendCodeError: string;
      codeRequired: string;
      verifyCodeError: string;
      loginWithEmail: string;
      guestMode: string;
      titleInitial: string;
      titleEmail: string;
      titleVerify: string;
      subtitleInitial: string;
      subtitleEmail: string;
      subtitleVerify: string;
      emailLabel: string;
      emailPlaceholder: string;
      codeLabel: string;
      codePlaceholder: string;
      processing: string;
      continueWithEmail: string;
      verifyAndLogin: string;
      goBack: string;
      changeEmail: string;
      googleSignInError: string;
      continueWithGoogle: string;
    };
  };
  nodes: {
    progress: {
      exam: string;
      module: string;
      completedPercentage: string;
      overallProgress: string;
      lessonsCompleted: string;
      streak: string;
      exp: string;
      coins: string;
      ranking: string;
    };
    tree: {
      errorTitle: string;
      moduleLessonsDescription: string;
    };
    training: {
      markCompletedConfirm: string;
    };
    continueWhereLeftOff: {
      title: string;
      allDone: string;
      lesson: string;
      practiceInfinite: string;
      practicePairs: string;
      practiceVoice: string;
      practiceSpeak: string;
    };
  };
  settings: {
    title: string;
    interface: {
      title: string;
      darkMode: string;
      lightMode: string;
      tapToChangeTheme: string;
      language: string;
      tapToChangeLanguage: string;
      nativeLanguage: string;
      tapToChangeNativeLanguage: string;
      appLanguage: string;
      appLangNative: string;
      appLangEn: string;
    };
    notifications: {
      title: string;
      statusLabel: string;
      enabledDesc: string;
      disabledDesc: string;
    };
    account: {
      title: string;
      linkGoogle: string;
      logout: string;
      deleteAccount: string;
    };
    audio: {
      title: string;
      spanishVoice: string;
      englishVoice: string;
      defaultVoice: string;
      configuredVoice: string;
      kokoroModel: string;
      downloading: string;
      offlineVoiceDesc: string;
      download: string;
      installed: string;
      update: string;
      sfx: string;
      bgm: string;
      selectSpanishVoice: string;
      selectEnglishVoice: string;
      close: string;
    };
    deleteAccount: {
      title: string;
      description: string;
      confirm: string;
      cancel: string;
    };
  };
  learning: {
    ai: {
      button: string;
      correct: string;
      incorrect: string;
      errorTitle: string;
      errorDesc: string;
      parseErrorSpecific: string;
      parseErrorGeneral: string;
      successTitle: string;
      errorTitleCard: string;
      specificAnalysis: string;
      stepByStep: string;
    };
    title: string;
    showStreak: string;
    showStreakDesc: string;
    choseInitialTest: {
      title: string;
      subtitle: string;
      startFromZero: string;
      orTakeLevelTest: string;
      basicLevel?: string;
      intermediateLevel?: string;
      advancedLevel?: string;
      levelA1: string;
      levelA2: string;
      levelB1: string;
      levelB2: string;
      levelC1: string;
    };
    infinity: {
      generating: string;
      gameOver: string;
      livesLost: string;
      tryAgain: string;
      exit: string;
      errorGenerating: string;
      retry: string;
      back: string;
      modeName: string;
      loadingMore: string;
      lives: string;
    };
    modeSelection: {
      chooseMode: string;
      theory: string;
      infinityExercises: string;
      exam: string;
      back: string;
      loading: string;
    };
    practice: {
      title: string;
      infinityChallenge: string;
      infinityDesc: string;
      record: string;
      matching: string;
      matchingDesc: string;
      voiceAssessment: string;
      voiceDesc: string;
      freeConversation: string;
      freeConvDesc: string;
      chooseFocus: string;
      focusLabel: string;
      focusPlaceholder: string;
      cancel: string;
      start: string;
    };

    theory: {
      title: string;
      skip: string;
      goToExam: string;
    };
    pronunciation: {
      generalPractice: string;
      pronouncePhrase: string;
      title: string;
      question: string;
      description: string;
      inputPlaceholder: string;
      startPractice: string;
      tryAnother: string;
      leeFrase: string;
      precision: string;
      analizando: string;
      reintentar: string;
      enviar: string;
      error: string;
      errorAssess: string;
      detailedAnalysis: string;
      metrics: {
        precision: string;
        fluency: string;
        completeness: string;
        pronunciation: string;
      };
      suggestions: string;
    };
    exercises: {
      unknownType: string;
      skip: string;
      checkAnswer: string;
      next: string;
      translatePhrase: string;
      close: string;
      wordSignifies: string;
      suggestTopic: string;
      errorRecommend: string;
      suggestPhrase: string;
      errorRecommendPhrase: string;
      fillBlank: string;
      listening: {
        normal: string;
        slow: string;
        ultraSlow: string;
        instruction: string;
      };
      scrambled: string;
    };
    quitLesson: {
      title: string;
      description: string;
      confirm: string;
      cancel: string;
    };
  };
  notificationService: {
    channelName: string;
    practice: Array<{ title: string; body: string }>;
    risk: Array<{ title: string; body: string }>;
    danger: Array<{ title: string; body: string }>;
  };
}
