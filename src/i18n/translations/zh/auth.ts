import { Translation } from '../types';

const auth: Translation['auth'] = {
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
};

export default auth;
