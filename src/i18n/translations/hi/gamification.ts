import { Translation } from '../types';

const gamification: Translation['gamification'] = {
  speak: {
    thinking: "सोच रहा है",
    placeholder: "एक संदेश लिखें...",
    error: "जवाब नहीं मिला। फिर से प्रयास करें।"
  },
  shop: {
    loading: "दुकान लोड हो रही है...",
    maxProtectors: "आपके पास पहले से ही स्ट्रीक प्रोटेक्टors की अधिकतम संख्या है।",
    notEnoughCoins: "इस आइटम को खरीदने के लिए आपको {{cost}} Michi-Coins चाहिए।",
    confirmPurchase: "खरीद की पुष्टि करें",
    buyProtectorConfirm: "60 Michi-Coins के लिए 1 स्ट्रीक प्रोटेCTOR खरीदें?",
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
      coinDoubler: {
        name: "सिक्का डब्लर",
        description: "अपने पाठों में अर्जित सिक्कों को स्थायी रूप से दोगुना करें।",
        equipped: "खरीदा गया"
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
};

export default gamification;
