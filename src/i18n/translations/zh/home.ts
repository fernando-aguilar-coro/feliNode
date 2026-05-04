import { Translation } from '../types';

const home: Translation['home'] = {
  tabs: {
    learn: "学习",
    practice: "练习",
    settings: "设置"
  },
  offline: "网络连接不可用，某些功能将无法使用",
  viewModes: {
    node: "切换到节点地图",
    list: "切换到列表视图"
  },
  modals: {
    kokoro: {
      title: "改善发音",
      description: "neko 可以使用先进的语音模型 (Kokoro TTS) 来提供更自然的英语发音，无需联网。",
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
};

export default home;
