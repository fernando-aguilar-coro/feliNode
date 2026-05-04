import { Translation } from '../types';

const auth: Translation['auth'] = {
  login: {
    emailRequired: "कृपया अपना ईमेल दर्ज करें",
    sendCodeError: "कोड भेजने में त्रुटि",
    codeRequired: "कृपया 6-अंकीय कोड दर्ज करें",
    verifyCodeError: "कोड गलत है या समाप्त हो गया है",
    loginWithEmail: "ईमेल से लॉगिन करें",
    guestMode: "अतिथि मोड",
    titleInitial: "लॉग इन करें",
    titleEmail: "स्वागत है",
    titleVerify: "सत्यापन",
    subtitleInitial: "आसान और मज़ेदार तरीके से अंग्रेजी सीखें।",
    subtitleEmail: "अपने ईमेल से लॉग इन करें",
    subtitleVerify: "{{email}} पर भेजा गया कोड दर्ज करें",
    emailLabel: "ईमेल पता",
    emailPlaceholder: "example@email.com",
    codeLabel: "सत्यापन कोड",
    codePlaceholder: "123456",
    processing: "प्रसंस्करण...",
    continueWithEmail: "ईमेल के साथ जारी रखें",
    verifyAndLogin: "सत्यापित करें और लॉग इन करें",
    goBack: "वापस जाओ",
    changeEmail: "ईमेल बदलें",
    googleSignInError: "Google साइन इन में त्रुटि",
    continueWithGoogle: "Google के साथ जारी रखें"
  },
  nativeLanguage: "आपकी मातृभाषा",
  nativeLanguageHint: "वह भाषा जो आप अभी बोलते हैं",
  uiLanguage: "ऐप की भाषा",
  uiLangNative: "मातृभाषा",
  uiLangEn: "अंग्रेज़ी"
};

export default auth;
