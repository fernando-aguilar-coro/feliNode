import { Translation } from '../types';

const nodes: Translation['nodes'] = {
  progress: {
    exam: "परीक्षा",
    module: "मॉड्यूल {{index}}: {{title}}",
    completedPercentage: "{{percentage}}% पूर्ण",
    overallProgress: "आपकी समग्र प्रगति",
    lessonsCompleted: "{{total}} में से {{completed}} पाठ पूर्ण",
    streak: "लगातार दिन",
    exp: "अनुभव",
    coins: "सिक्के",
    ranking: "रैंकिंग",
    unit: "इकाई {{index}}"
  },
  tree: {
    errorTitle: "त्रुटि",
    moduleLessonsDescription: "इस इकाई का अभ्यास शुरू करने के लिए एक पाठ चुनें।"
  },
  training: {
    markCompletedConfirm: "क्या आप वाकई इस पाठ को पूर्ण के रूप में चिह्नित करना चाहते हैं? आपको इसके लिए अनुभव (XP) नहीं मिलेगा।"
  },
  continueWhereLeftOff: {
    title: "जारी रखें",
    allDone: "सब तैयार है! 🎓",
    lesson: "पाठ",
    practiceInfinite: "अनंत",
    practicePairs: "जोड़े",
    practiceVoice: "आवाज़",
    practiceSpeak: "बोलें"
  }
};

export default nodes;
