import { Translation } from '../types';

const settings: Translation['settings'] = {
  title: "设置",
  interface: {
    title: "界面与外观",
    darkMode: "深色模式",
    lightMode: "浅色模式",
    tapToChangeTheme: "点击更改主题",
    language: "语言",
    tapToChangeLanguage: "点击更改语言",
    nativeLanguage: "母语",
    tapToChangeNativeLanguage: "您目前讲的语言",
    appLanguage: "应用语言",
    appLangNative: "原生",
    appLangEn: "英语",
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
};

export default settings;
