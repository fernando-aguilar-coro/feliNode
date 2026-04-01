export default {
  auth: {
    login: {
      emailRequired: "Please enter your email",
      sendCodeError: "Error sending code",
      codeRequired: "Please enter the 6-digit code",
      verifyCodeError: "The code is incorrect or expired",
      loginWithEmail: "Login with Email",
      guestMode: "Guest Mode",
      // Header
      titleInitial: "Log in",
      titleEmail: "Welcome",
      titleVerify: "Verification",
      subtitleInitial: "Learn English in an easy and fun way.",
      subtitleEmail: "Log in with your email",
      subtitleVerify: "Enter the code sent to {{email}}",
      // Form
      emailLabel: "Email address",
      emailPlaceholder: "example@email.com",
      codeLabel: "Verification code",
      codePlaceholder: "123456",
      processing: "Processing...",
      continueWithEmail: "Continue with Email",
      verifyAndLogin: "Verify and Log In",
      goBack: "Go back",
      changeEmail: "Change email",
      // Social
      googleSignInError: "Error with Google Sign In",
      continueWithGoogle: "Continue with Google"
    }
  },
  nodes: {
    progress: {
      exam: "Exam",
      module: "Module {{index}}: {{title}}",
      completedPercentage: "{{percentage}}% Completed",
      overallProgress: "Your Overall Progress",
      lessonsCompleted: "{{completed}} of {{total}} lessons completed",
      streak: "Streak",
      exp: "Exp",
      coins: "Coins"
    },
    tree: {
      errorTitle: "Error"
    }
  },
  settings: {
    title: "Settings",
    interface: {
      title: "Interface and Appearance",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      tapToChangeTheme: "Tap to change theme",
      language: "Language",
      tapToChangeLanguage: "Tap to change language"
    },
    notifications: {
      title: "Notifications",
      showStreak: "Show Streak",
      showStreakDesc: "View consecutive days counter",
      statusLabel: "Alert Status",
      enabledDesc: "Notifications are enabled.",
      disabledDesc: "Notifications are disabled."
    },
    account: {
      title: "Account",
      linkGoogle: "Link Account with Google",
      logout: "Log Out",
      deleteAccount: "Delete Account",
    },
    audio: {
      title: "Audio",
      spanishVoice: "Spanish Voice",
      englishVoice: "English Voice",
      defaultVoice: "Default Voice",
      configuredVoice: "Configured Voice",
      kokoroModel: "Kokoro Voice Model (English)",
      downloading: "Downloading: ...",
      offlineVoiceDesc: "Requires download for offline voice",
      download: "Download",
      installed: "Installed",
      update: "Update",
      sfx: "Sound Effects",
      bgm: "Background Music",
      selectSpanishVoice: "Select Spanish Voice",
      selectEnglishVoice: "Select English Voice",
      close: "Close",
    },
    learning: {
      title: "Learning",
      choseInitialTest: {
        title: "Choose your level",
        subtitle: "Select the test that best fits you.",
        startFromZero: "Start from 0",
        orTakeLevelTest: "Or take a level test:",
        basicLevel: "Basic Level",
        intermediateLevel: "Intermediate Level",
        advancedLevel: "Advanced Level"
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
        errorAssess: "Could not analyze pronunciation."
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
        recommendPhrase: "Recommend phrase",
        errorRecommendPhrase: "Could not get a phrase recommendation."
      }
    },
    deleteAccount: {
      title: "Delete Account?",
      description: "This action is irreversible. All your progress will be permanently deleted and cannot be recovered.",
      confirm: "Permanently Delete",
      cancel: "Cancel",
    }
  },
  notificationService: {
    channelName: "Streak Reminders",
    practice: [
        { title: "Time to practice! 📚", body: "Just a few minutes today can greatly improve your English." },
        { title: "Small steps, big progress 🌟", body: "Practice a bit now and keep moving forward." },
        { title: "Ready for English today? 🤔", body: "Never too late to learn something new. Start now!" },
        { title: "Your goal is near 🗣️", body: "Every practice brings you closer to fluency." },
        { title: "Consistency is key 🧠", body: "A little every day makes a difference. Let's go!" },
        { title: "Don't break the streak 🔥", body: "You are making great progress, keep it up today!" },
        { title: "Every minute counts ⏱️", body: "Even a short practice adds up. Try it now!" },
        { title: "Make it fun 🎯", body: "Learning English can be entertaining too." },
        { title: "Your English is growing 🌱", body: "Keep practicing to see it flourish." },
        { title: "Daily challenge ⚡", body: "Jump in and complete your daily practice." }
    ],
    risk: [
        { title: "Time to practice! 📚", body: "You have a {{streak}} day streak. Do a lesson now so your shields aren't affected!" },
        { title: "Your streak is at risk! 🚨", body: "Protect your {{streak}} day streak by dedicating a few minutes to English." },
        { title: "Time flies ⏰", body: "Keep your {{streak}} day streak by practicing now." },
        { title: "Don't give up! 💪", body: "Secure your {{streak}} day streak with a short lesson." }
    ],
    danger: [
        { title: "Don't lose your streak! 🔥", body: "Only an hour left until midnight. Complete a lesson right now!" },
        { title: "Last chance ⏳", body: "Your streak is about to reset. Practice now!" },
        { title: "Act fast! ⚡", body: "Very little time left to finish the day. Save your streak!" },
        { title: "Now or never! 🏃", body: "Don't let the clock beat you without practicing today." }
    ]
  }
};
