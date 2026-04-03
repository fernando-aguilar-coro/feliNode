export default {
  common: {
    loading: "加载中...",
    syncing: "同步中...",
    lessons: "正在加载模块...",
    progress: "正在加载进度...",
    generating: "正在生成练习...",
    lesson: "正在加载课程...",
    placement: "正在加载评估...",
    pairs: "正在准备配对..."
  },
  gamification: {
    speak: {
      thinking: "正在思考"
    },
    shop: {
      loading: "商店加载中...",
      maxProtectors: "您已拥有最大数量的连续记录保护器。",
      notEnoughCoins: "您需要 {{cost}} 颗猫咪币来购买此物品。",
      confirmPurchase: "确认购买",
      buyProtectorConfirm: "花费 70 颗猫咪币购买 1 个连续记录保护器？",
      cancel: "取消",
      confirm: "确认",
      purchaseError: "无法完成购买。",
      comingSoon: "敬请期待",
      buyItemConfirm: "花费 {{cost}} 颗猫咪币购买 {{name}}？\n（即将推出）",
      itemDisabled: "该物品尚未启用。",
      successTitle: "购买成功！",
      successDesc: "您已获得：{{name}}",
      great: "太棒了！",
      items: {
        protector: {
          name: "连续记录保护器",
          description: "如果您忘记学习一天，它可以保持您的连续记录完整。",
          equipped: "已装备：{{count}} / 2"
        },
        doubleXp: {
          name: "双倍经验药水",
          description: "在下一节课中获得双倍经验。"
        },
        goldAvatar: {
          name: "黄金头像",
          description: "为您的个人资料提供一个奢华的金色边框。"
        }
      }
    },
    streak: {
      loading: "加载中...",
      dayCount: "天连续记录",
      daysCount: "天连续记录",
      record: "最高纪录: {{count}}",
      protectorsTitle: "连续记录保护器",
      protectorsDesc: "如果您忘记练习一天，连续记录保护器可以救你一命。",
      equipped: "已装备 {{count}} / 2"
    }
  },
  home: {
    tabs: {
      learn: "学习",
      practice: "练习",
      settings: "设置"
    },
    offline: "网络连接不可用，某些功能将无法使用",
    viewModes: {
      tree: "切换到节点地图",
      list: "切换到列表视图"
    },
    modals: {
      kokoro: {
        title: "改善发音",
        description: "nekoEnglish 可以使用先进的语音模型 (Kokoro TTS) 来提供更自然的英语发音，无需联网。",
        subtitle: "仅需下载一次语音模型（约 300MB）。",
        accept: "下载并改善音频",
        decline: "使用原生语音（不下载）"
      },
      firstPractice: {
        title: "试试你的第一次练习！",
        description: "你想尝试一个快速的英语单词及其翻译的匹配练习吗？这是开始练习的一种有趣方式。",
        subtitle: "在规定时间内连接英语和西班牙语单词对。🎯",
        accept: "开始练习！",
        decline: "现在不，谢谢"
      }
    }
  },
  auth: {
    login: {
      emailRequired: "请输入您的电子邮箱",
      sendCodeError: "发送验证码失败",
      codeRequired: "请输入6位验证码",
      verifyCodeError: "验证码错误或已过期",
      loginWithEmail: "使用邮箱登录",
      guestMode: "游客模式",
      // Header
      titleInitial: "登录",
      titleEmail: "欢迎",
      titleVerify: "验证",
      subtitleInitial: "以简单有趣的方式学习英语。",
      subtitleEmail: "使用您的电子邮件登录",
      subtitleVerify: "输入发送至 {{email}} 的验证码",
      // Form
      emailLabel: "电子邮件地址",
      emailPlaceholder: "example@email.com",
      codeLabel: "验证码",
      codePlaceholder: "123456",
      processing: "处理中...",
      continueWithEmail: "继续使用邮箱",
      verifyAndLogin: "验证并登录",
      goBack: "返回",
      changeEmail: "更改邮箱",
      // Social
      googleSignInError: "谷歌登录出错",
      continueWithGoogle: "继续使用 Google"
    }
  },
  nodes: {
    progress: {
      exam: "考试",
      module: "模块 {{index}}: {{title}}",
      completedPercentage: "已完成 {{percentage}}%",
      overallProgress: "您的总体进度",
      lessonsCompleted: "已完成 {{total}} 节课中的 {{completed}} 节",
      streak: "连续记录",
      exp: "经验星",
      coins: "金币"
    },
    tree: {
      errorTitle: "错误"
    }
  },
  settings: {
    title: "设置",
    interface: {
      title: "界面与外观",
      darkMode: "深色模式",
      lightMode: "浅色模式",
      tapToChangeTheme: "点击更改主题",
      language: "语言",
      tapToChangeLanguage: "点击更改语言"
    },
    notifications: {
      title: "通知",
      statusLabel: "警报状态",
      enabledDesc: "通知已启用。",
      disabledDesc: "通知已禁用。"
    },
    account: {
      title: "账户",
      linkGoogle: "绑定谷歌账户",
      logout: "退出登录",
      deleteAccount: "注销账户",
    },
    audio: {
      title: "音频",
      spanishVoice: "西班牙语语音",
      englishVoice: "英语语音",
      defaultVoice: "默认语音",
      configuredVoice: "已配置语音",
      kokoroModel: "Kokoro 语音模型 (英语)",
      downloading: "正在下载...",
      offlineVoiceDesc: "离线语音需要下载",
      download: "下载",
      installed: "已安装",
      update: "更新",
      sfx: "音效",
      bgm: "背景音乐",
      selectSpanishVoice: "选择西班牙语语音",
      selectEnglishVoice: "选择英语语音",
      close: "关闭",
    },
    deleteAccount: {
      title: "确定注销账户？",
      description: "此操作不可逆。您的所有进度将被永久删除且无法恢复。",
      confirm: "永久删除",
      cancel: "取消",
    }
  },
  learning: {
    ai: {
      button: "使用 AI 评分/解释！",
      correct: "AI 评价为正确！",
      incorrect: "AI 评价为不正确",
      errorTitle: "错误",
      errorDesc: "此时无法获取 AI 评估。",
      parseErrorSpecific: "处理具体解释时出错。",
      parseErrorGeneral: "无法获取一般解释。",
      successTitle: "做得好！",
      errorTitleCard: "更正",
      specificAnalysis: "具体分析",
      stepByStep: "正确答案逐步解析"
    },
    title: "學習",
    showStreak: "显示连续记录",
    showStreakDesc: "查看连续天数计数器",
    choseInitialTest: {
      title: "選擇你的等級",
      subtitle: "選擇最適合您的測試。",
      startFromZero: "從零開始",
      orTakeLevelTest: "或參加分級測試：",
      basicLevel: "初級",
      intermediateLevel: "中級",
      advancedLevel: "高級",
    },
    infinity: {
      modeName: "無限模式",
      generating: "正在生成無限練習...",
      gameOver: "遊戲結束",
      livesLost: "您用完了生命！您正確完成了 {{count}} 個練習。",
      tryAgain: "再試一次",
      exit: "退出",
      lives: "❤️ x {{lives}}",
      loadingMore: "正在加載更多...",
      errorGenerating: "無法生成練習。",
      retry: "重試",
      back: "返回",
    },
    modeSelection: {
      loading: "正在加載...",
      chooseMode: "選擇你的模式",
      theory: "理論",
      infinityExercises: "無限練習",
      exam: "考試",
      back: "返回",
    },
    practice: {
      infinityChallenge: "無限挑戰",
      infinityDesc: "無盡的詞彙和語法練習。",
      matching: "匹配",
      matchingDesc: "將單詞與其含義或翻譯配對。",
      voiceAssessment: "語音評估",
      voiceDesc: "自由交談並評估您的發音。",
      freeConversation: "自由對話",
      freeConvDesc: "練習與 AI 自然對話。",
      record: "最高紀錄: {{score}}",
      chooseFocus: "為您的練習選擇可選的焦點或主題。",
      focusLabel: "焦點 (可選)",
      focusPlaceholder: "例如：問候、語法、動物...",
      cancel: "取消",
      start: "開始",
    },
    theory: {
      title: "理論",
      skip: "跳過",
      goToExam: "參加考試",
    },
    pronunciation: {
      title: "語音評估",
      generalPractice: "一般練習",
      leeFrase: "朗讀這句話：",
      precision: "整體精確度：",
      analizando: "分析中...",
      reintentar: "重試",
      enviar: "發送",
      error: "錯誤",
      errorAssess: "無法分析發音。",
      question: "你想練習哪句話？",
      description: "用中文或英文寫一個句子來評估你的發音。",
      inputPlaceholder: "在這裡輸入你的句子...",
      startPractice: "開始練習",
      tryAnother: "嘗試另一句話",
      detailedAnalysis: "詳細分析",
      metrics: {
        precision: "精確度",
        fluency: "流利度",
        completeness: "完整度",
        pronunciation: "發音",
      },
      suggestions: "改進建議",
    },
    exercises: {
      unknownType: "未知練習類型",
      checkAnswer: "檢查答案",
      next: "下一個",
      skip: "跳過",
      translatePhrase: "翻譯這句話...",
      close: "關閉",
      wordSignifies: "\"{{word}}\" 的意思是：",
      suggestTopic: "建議主題",
      suggestPhrase: "建議句子",
      errorRecommend: "無法獲得主題建議。",
      errorRecommendPhrase: "無法獲得句子建議。",
      fillBlank: "輸入缺失的單詞...",
      listening: {
        normal: "正常",
        slow: "緩慢",
        ultraSlow: "極慢",
        instruction: "排列你聽到的單詞：",
      },
      scrambled: "點擊單詞組成句子：",
    },
  },
  notificationService: {
    channelName: "连续记录提醒",
    practice: [
      { title: "练习时间到了！📚", body: "今天只需几分钟就能大大提高你的英语水平。" },
      { title: "小步走，大进步 🌟", body: "现在练习一会儿，继续前进。" },
      { title: "准备好今天的英语了吗？🤔", body: "学习新知识永远不嫌晚。现在开始吧！" },
      { title: "目标就在眼前 🗣️", body: "每一次练习都让你离流利更近。" },
      { title: "坚持是关键 🧠", body: "每天一点点，效果看得见。我们走！" },
      { title: "不要中断连续记录 🔥", body: "你取得了很好的进展，今天继续！" },
      { title: "每一分钟都很重要 ⏱️", body: "即使是短暂的练习也能积少成多。现在就试试！" },
      { title: "让学习变得有趣 🎯", body: "学英语也可以很有趣。" },
      { title: "你的英语正在进步 🌱", body: "继续练习，看它开花结果。" },
      { title: "每日挑战 ⚡", body: "加入并完成每日练习。" }
    ],
    risk: [
      { title: "练习时间到了！📚", body: "你有 {{streak}} 天的连续记录。现在做一课，不要影响你的保护盾！" },
      { title: "你的连续记录处于危险之中！🚨", body: "花几分钟学英语，以保护你的 {{streak}} 天连续记录。" },
      { title: "时光飞逝 ⏰", body: "现在练习，保持你的 {{streak}} 天连续记录。" },
      { title: "不要放弃！💪", body: "通过一节短课来保住你 {{streak}} 天的连续记录。" }
    ],
    danger: [
      { title: "不要失去你的连续记录！🔥", body: "离午夜只有一小时了。立刻完成一课吧！" },
      { title: "最后机会 ⏳", body: "你的连续记录即将重置。现在就练习！" },
      { title: "行动要快！⚡", body: "今天的时间所剩无几。保住你的连续记录吧！" },
      { title: "机不可失！🏃", body: "不要让时间白白流逝，今天赶快练习。" }
    ]
  }
};
