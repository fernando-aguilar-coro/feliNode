export default {
  common: {
    loading: "लोड हो रहा है...",
    syncing: "सिंक हो रहा है...",
    lessons: "मॉड्यूल लोड हो रहा है...",
    progress: "प्रगति लोड हो रही है...",
    generating: "अभ्यास पैदा कर रहा है...",
    lesson: "सबक लोड हो रहा है...",
    placement: "मूल्यांकन लोड हो रहा है...",
    pairs: "जोड़े तैयार कर रहा है..."
  },
  gamification: {
    speak: {
      thinking: "सोच रहा है"
    },
    shop: {
      loading: "दुकान लोड हो रही है...",
      maxProtectors: "आपके पास पहले से ही स्ट्रीक प्रोटेक्टors की अधिकतम संख्या है।",
      notEnoughCoins: "इस आइटम को खरीदने के लिए आपको {{cost}} Michi-Coins चाहिए।",
      confirmPurchase: "खरीद की पुष्टि करें",
      buyProtectorConfirm: "70 Michi-Coins के लिए 1 स्ट्रीक प्रोटेक्टर खरीदें?",
      cancel: "रद्द करें",
      confirm: "पुष्टि करें",
      purchaseError: "खरीद पूरी नहीं हो सकी।",
      comingSoon: "जल्द ही आ रहा है",
      buyItemConfirm: "{{cost}} Michi-Coins में {{name}} खरीदें?\n(जल्द आ रहा है)",
      itemDisabled: "यह आइटम अभी सक्षम नहीं है।",
      successTitle: "खरीद सफल!",
      successDesc: "आपने प्राप्त किया है: {{name}}",
      great: "बहुत बढ़िया!",
      items: {
        protector: {
          name: "स्ट्रीक प्रोटेक्टर",
          description: "यदि आप एक दिन पढ़ना भूल जाते हैं तो आपकी स्ट्रीक सुरक्षित रखता है।",
          equipped: "लैस: {{count}} / 2"
        },
        doubleXp: {
          name: "डबल XP औषधि",
          description: "अपने अगले पाठ पर दोगुना अनुभव प्राप्त करें।"
        },
        goldAvatar: {
          name: "गोल्ड अवतार",
          description: "आपकी सामान्य प्रोफ़ाइल के लिए एक शानदार सुनहरा फ्रेम।"
        }
      }
    },
    streak: {
      loading: "लोड हो रहा है...",
      dayCount: "दिन की रक्षक",
      daysCount: "दिनों की रक्षक",
      record: "रिकॉर्ड: {{count}}",
      protectorsTitle: "स्ट्रीक प्रोटेक्टर्स",
      protectorsDesc: "यदि आप एक दिन अभ्यास करना भूल जाते हैं तो स्ट्रीक प्रोटेक्टर आपको बचाता है।",
      equipped: "{{count}} / 2 लैस"
    }
  },
  home: {
    tabs: {
      learn: "सीखें",
      practice: "अभ्यास करें",
      settings: "सेटिंग्स"
    },
    offline: "इंटरनेट कनेक्शन उपलब्ध नहीं है, कुछ सुविधाएँ उपलब्ध नहीं होंगी",
    viewModes: {
      tree: "नोड मैप पर स्विच करें",
      list: "सूची दृश्य पर स्विच करें"
    },
    modals: {
      kokoro: {
        title: "उच्चारण में सुधार करें",
        description: "nekoEnglish इंटरनेट कनेक्शन की आवश्यकता के बिना, अधिक स्वाभाविक अंग्रेजी उच्चारण देने के लिए एक उन्नत आवाज मॉडल (Kokoro TTS) का उपयोग कर सकता है।",
        subtitle: "एक बार वॉइस मॉडल (लगभग 300MB) डाउनलोड करने की आवश्यकता है।",
        accept: "ऑडियो डाउनलोड करें और सुधारें",
        decline: "देशी आवाज का उपयोग करें (डाउनलोड न करें)"
      },
      firstPractice: {
        title: "अपना पहला अभ्यास आज़माएं!",
        description: "क्या आप इसके अनुवाद के साथ अंग्रेजी में एक त्वरित शब्द मिलान अभ्यास आज़माना चाहेंगे? यह अभ्यास शुरू करने का एक मज़ेदार तरीका है।",
        subtitle: "घड़ी के विपरीत अंग्रेजी और स्पेनिश में शब्दों के जोड़े जोड़ें। 🎯",
        accept: "चलो अभ्यास करते हैं!",
        decline: "अभी नहीं, धन्यवाद"
      }
    }
  },
  auth: {
    login: {
      emailRequired: "कृपया अपना ईमेल दर्ज करें",
      sendCodeError: "कोड भेजने में त्रुटि",
      codeRequired: "कृपया 6-अंकीय कोड दर्ज करें",
      verifyCodeError: "कोड गलत है या समाप्त हो गया है",
      loginWithEmail: "ईमेल से लॉगिन करें",
      guestMode: "अतिथि मोड",
      // Header
      titleInitial: "लॉग इन करें",
      titleEmail: "स्वागत है",
      titleVerify: "सत्यापन",
      subtitleInitial: "आसान और मज़ेदार तरीके से अंग्रेजी सीखें।",
      subtitleEmail: "अपने ईमेल से लॉग इन करें",
      subtitleVerify: "{{email}} पर भेजा गया कोड दर्ज करें",
      // Form
      emailLabel: "ईमेल पता",
      emailPlaceholder: "example@email.com",
      codeLabel: "सत्यापन कोड",
      codePlaceholder: "123456",
      processing: "प्रसंस्करण...",
      continueWithEmail: "ईमेल के साथ जारी रखें",
      verifyAndLogin: "सत्यापित करें और लॉग इन करें",
      goBack: "वापस जाओ",
      changeEmail: "ईमेल बदलें",
      // Social
      googleSignInError: "Google साइन इन में त्रुटि",
      continueWithGoogle: "Google के साथ जारी रखें"
    }
  },
  nodes: {
    progress: {
      exam: "परीक्षा",
      module: "मॉड्यूल {{index}}: {{title}}",
      completedPercentage: "{{percentage}}% पूर्ण",
      overallProgress: "आपकी समग्र प्रगति",
      lessonsCompleted: "{{total}} में से {{completed}} पाठ पूर्ण",
      streak: "लगातार दिन",
      exp: "अनुभव",
      coins: "सिक्के"
    },
    tree: {
      errorTitle: "त्रुटि"
    }
  },
  settings: {
    title: "सेटिंग्स",
    interface: {
      title: "इंटरफ़ेस और प्रकटन",
      darkMode: "डार्क मोड",
      lightMode: "लाइट मोड",
      tapToChangeTheme: "थीम बदलने के लिए टैप करें",
      language: "भाषा",
      tapToChangeLanguage: "भाषा बदलने के लिए टैप करें"
    },
    notifications: {
      title: "सूचनाएं",
      statusLabel: "अलर्ट स्थिति",
      enabledDesc: "सूचनाएं सक्षम हैं।",
      disabledDesc: "सूचनाएं अक्षम हैं।"
    },
    account: {
      title: "खाता",
      linkGoogle: "Google खाता लिंक करें",
      logout: "लॉग आउट करें",
      deleteAccount: "खाता हटाएं",
    },
    audio: {
      title: "ऑडियो",
      spanishVoice: "स्पेनिश आवाज़",
      englishVoice: "अंग्रेजी आवाज़",
      defaultVoice: "डिफ़ॉल्ट आवाज़",
      configuredVoice: "कॉन्फ़िगर की गई आवाज़",
      kokoroModel: "Kokoro आवाज़ मॉडल (अंग्रेजी)",
      downloading: "डाउनलोड हो रहा है...",
      offlineVoiceDesc: "ऑफ़लाइन आवाज़ के लिए डाउनलोड की आवश्यकता है",
      download: "डाउनलोड",
      installed: "इंस्टॉल किया गया",
      update: "अपडेट करें",
      sfx: "ध्वनि प्रभाव",
      bgm: "पृष्ठभूमि संगीत",
      selectSpanishVoice: "स्पेनिश आवाज़ चुनें",
      selectEnglishVoice: "अंग्रेजी आवाज़ चुनें",
      close: "बंद करें",
    },
    deleteAccount: {
      title: "खाता हटाएं?",
      description: "यह क्रिया अपरिवर्तनीय है। आपकी सभी प्रगति स्थायी रूप से हटा दी जाएगी और इसे वापस नहीं पाया जा सकता है।",
      confirm: "स्थायी रूप से हटाएं",
      cancel: "रद्द करें",
    }
  },
  learning: {
    ai: {
      button: "AI के साथ रेट/व्याख्या करें!",
      correct: "AI के अनुसार सही!",
      incorrect: "AI के अनुसार गलत",
      errorTitle: "त्रुटि",
      errorDesc: "इस समय AI मूल्यांकन प्राप्त नहीं किया जा सका।",
      parseErrorSpecific: "विशिष्ट व्याख्या को संसाधित करने में त्रुटि।",
      parseErrorGeneral: "सामान्य व्याख्या प्राप्त नहीं की जा सकी।",
      successTitle: "शाबाश!",
      errorTitleCard: "सुधार",
      specificAnalysis: "विशिष्ट विश्लेषण",
      stepByStep: "सही उत्तर चरण-दर-चरण"
    },
    title: "सीखना",
    showStreak: "लगातार दिन दिखाएं",
    showStreakDesc: "लगातार दिनों का काउंटर देखें",
    choseInitialTest: {
      title: "अपना स्तर चुनें",
      subtitle: "वह परीक्षण चुनें जो आपके लिए सबसे उपयुक्त हो।",
      startFromZero: "शून्य से शुरू करें",
      orTakeLevelTest: "या स्तर परीक्षण लें:",
      basicLevel: "बुनियादी स्तर",
      intermediateLevel: "मध्यम स्तर",
      advancedLevel: "उन्नत स्तर",
    },
    infinity: {
      modeName: "इन्फिनिटी मोड",
      generating: "इन्फिनिटी अभ्यास उत्पन्न कर रहा है...",
      gameOver: "खेल खत्म",
      livesLost: "आपकी जान खत्म हो गई! आपने {{count}} अभ्यास सही ढंग से पूरे किए हैं।",
      tryAgain: "फिर से प्रयास करें",
      exit: "बाहर निकलें",
      lives: "❤️ x {{lives}}",
      loadingMore: "अधिक लोड हो रहा है...",
      errorGenerating: "अभ्यास उत्पन्न नहीं किया जा सका।",
      retry: "पुनः प्रयास करें",
      back: "वापस",
    },
    modeSelection: {
      loading: "लोड हो रहा है...",
      chooseMode: "अपना मोड चुनें",
      theory: "सिद्धांत",
      infinityExercises: "इन्फिनिटी अभ्यास",
      exam: "परीक्षा",
      back: "वापस",
    },
    practice: {
      infinityChallenge: "इन्फिनिटी चुनौती",
      infinityDesc: "अंतहीन शब्दावली और व्याकरण अभ्यास।",
      matching: "मिलान",
      matchingDesc: "शब्दों को उनके अर्थ या अनुवाद के साथ जोड़ें।",
      voiceAssessment: "आवाज मूल्यांकन",
      voiceDesc: "स्वतंत्र रूप से बोलें और अपने उच्चारण का मूल्यांकन करें।",
      freeConversation: "मुक्त बातचीत",
      freeConvDesc: "एआई के साथ स्वाभाविक रूप से बोलने का अभ्यास करें।",
      record: "रिकॉर्ड: {{score}}",
      chooseFocus: "अपने अभ्यास के लिए एक वैकल्पिक फोकस या विषय चुनें।",
      focusLabel: "फोकस (वैकल्पिक)",
      focusPlaceholder: "जैसे: अभिवादन, व्याकरण, जानवर...",
      cancel: "रद्द करें",
      start: "शुरू करें",
    },
    theory: {
      title: "सिद्धांत",
      skip: "छोड़ें",
      goToExam: "परीक्षा पर जाएँ",
    },
    pronunciation: {
      title: "आवाज मूल्यांकन",
      generalPractice: "सामान्य अभ्यास",
      leeFrase: "इस वाक्यांश को पढ़ें:",
      precision: "कुल सटीकता:",
      analizando: "विश्लेषण कर रहा है...",
      reintentar: "पुनः प्रयास करें",
      enviar: "भेजें",
      error: "त्रुटि",
      errorAssess: "उच्चारण का विश्लेषण नहीं किया जा सका।",
      question: "आप किस वाक्यांश का अभ्यास करना चाहते हैं?",
      description: "अपने उच्चारण का मूल्यांकन करने के लिए हिंदी या अंग्रेजी में एक वाक्य लिखें।",
      inputPlaceholder: "अपना वाक्यांश यहाँ लिखें...",
      startPractice: "अभ्यास शुरू करें",
      tryAnother: "दूसरा वाक्यांश आज़माएं",
      detailedAnalysis: "विस्तृत विश्लेषण",
      metrics: {
        precision: "सटीकता",
        fluency: "प्रवाह",
        completeness: "पूर्णता",
        pronunciation: "उच्चारण",
      },
      suggestions: "सुधार के लिए सुझाव",
    },
    exercises: {
      unknownType: "अज्ञात अभ्यास प्रकार",
      checkAnswer: "उत्तर जांचें",
      next: "अगला",
      skip: "छोड़ें",
      translatePhrase: "इस वाक्यांश का अनुवाद करें...",
      close: "बंद करें",
      wordSignifies: "\"{{word}}\" का अर्थ है:",
      suggestTopic: "विषय का सुझाव दें",
      suggestPhrase: "वाक्यांश का सुझाव दें",
      errorRecommend: "विषय अनुशंसा प्राप्त नहीं की जा सकी।",
      errorRecommendPhrase: "वाक्यांश अनुशंसा प्राप्त नहीं की जा सकी।",
      fillBlank: "छूटा हुआ शब्द लिखें...",
      listening: {
        normal: "सामान्य",
        slow: "धीमा",
        ultraSlow: "अति धीमा",
        instruction: "सुने गए शब्दों को क्रम में रखें:",
      },
      scrambled: "वाक्य बनाने के लिए शब्दों पर टैप करें:",
    },
  },
  notificationService: {
    channelName: "लगातार दिन अनुस्मारक",
    practice: [
      { title: "अभ्यास का समय! 📚", body: "आज के कुछ मिनट आपकी अंग्रेजी को बहुत सुधार सकते हैं।" },
      { title: "छोटे कदम, बड़ी प्रगति 🌟", body: "अभी थोड़ा अभ्यास करें और आगे बढ़ें।" },
      { title: "आज की अंग्रेजी के लिए तैयार हैं? 🤔", body: "कुछ नया सीखने में कभी देर नहीं होती। अभी शुरू करें!" },
      { title: "आपका लक्ष्य करीब है 🗣️", body: "हर अभ्यास आपको धाराप्रवाह के करीब लाता है।" },
      { title: "निरंतरता कुंजी है 🧠", body: "हर दिन थोड़ा सा बदलाव लाता है। चलिए!" },
      { title: "लगातार दिन न तोड़ें 🔥", body: "आप बहुत अच्छी प्रगति कर रहे हैं, इसे आज भी जारी रखें!" },
      { title: "हर मिनट मायने रखता है ⏱️", body: "एक छोटा अभ्यास भी जुड़ता है। इसे अभी आज़माएँ!" },
      { title: "इसे मज़ेदार बनाएँ 🎯", body: "अंग्रेजी सीखना भी मनोरंजक हो सकता है।" },
      { title: "आपकी अंग्रेजी बढ़ रही है 🌱", body: "इसे खिलते देखने के लिए अभ्यास करते रहें।" },
      { title: "दैनिक चुनौती ⚡", body: "加入並完成每日練習।" }
    ],
    risk: [
      { title: "अभ्यास का समय! 📚", body: "आपकी {{streak}} दिन की स्ट्रीक है। अभी एक पाठ करें ताकि आपके शील्ड प्रभावित न हों!" },
      { title: "आपकी स्ट्रीक खतरे में है! 🚨", body: "कुछ मिनटों के अंग्रेजी अभ्यास से अपनी {{streak}} दिन की स्ट्रीक सुरक्षित करें।" },
      { title: "समय उड़ता है ⏰", body: "अभी अभ्यास करके अपनी {{streak}} दिन की स्ट्रीक बनाए रखें।" },
      { title: "हार मत मानो! 💪", body: "एक छोटे पाठ के साथ अपनी {{streak}} दिन की स्ट्रीक सुरक्षित करें।" }
    ],
    danger: [
      { title: "अपनी स्ट्रीक न खोएं! 🔥", body: "आधी रात तक सिर्फ एक घंटा बचा है। अभी एक पाठ पूरा करें!" },
      { title: "आखिरी मौका ⏳", body: "आपकी स्ट्रीक रीसेट होने वाली है। अभी अभ्यास करें!" },
      { title: "जल्दी करें! ⚡", body: "दिन खत्म होने को है। अपनी स्ट्रीक बचाएं!" },
      { title: "अभी या कभी नहीं! 🏃", body: "आज अभ्यास किए बिना समय को जीतने न दें।" }
    ]
  }
};
