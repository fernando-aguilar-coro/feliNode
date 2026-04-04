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
    coins: "金币"
  },
  tree: {
    errorTitle: "错误"
  }
};

export default nodes;
