import { Translation } from '../types';

const notificationService: Translation['notificationService'] = {
  channelName: "连续记录提醒",
  practice: [
    { title: "练习时间到了！📚", body: "今天只需几分钟就能大大提高你的英语水平。" },
    { title: "小步走，大进步 🌟", body: "现在练习一会儿，继续前进。" },
    { title: "准备好今天的英语了吗？🤔", body: "学习新知识永远不兼晚。现在开始吧！" },
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
};

export default notificationService;
