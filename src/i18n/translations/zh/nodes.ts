import { Translation } from '../types';

const nodes: Translation['nodes'] = {
  progress: {
    exam: "考试",
    module: "模块 {{index}}: {{title}}",
    completedPercentage: "已完成 {{percentage}}%",
    overallProgress: "您的总体进度",
    lessonsCompleted: "已完成 {{total}} 节课中的 {{completed}} 节",
    streak: "连续记录",
    exp: "经验星",
    coins: "金币",
    ranking: "排行榜",
    unit: "第 {{index}} 单元"
  },
  tree: {
    errorTitle: "错误",
    moduleLessonsDescription: "选择一节课开始练习本单元。"
  },
  training: {
    markCompletedConfirm: "您确定要将本课标记为已完成吗？您将不会获得经验值（XP）。"
  },
  continueWhereLeftOff: {
    title: "继续",
    allDone: "大功告成！🎓",
    lesson: "课程",
    practiceInfinite: "无限",
    practicePairs: "配对",
    practiceVoice: "语音",
    practiceSpeak: "口语"
  }
};

export default nodes;
