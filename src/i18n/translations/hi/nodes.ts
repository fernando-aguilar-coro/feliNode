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
    ranking: "रैंकिंग"
  },
  tree: {
    errorTitle: "त्रुटि",
    moduleLessonsDescription: "इस इकाई का अभ्यास शुरू करने के लिए एक पाठ चुनें।"
  }
};

export default nodes;
