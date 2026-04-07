import { Translation } from '../types';

const gamification: Translation['gamification'] = {
  speak: {
    thinking: "正在思考",
    placeholder: "输入消息...",
    error: "无法获取回复。请重试。"
  },
  shop: {
    loading: "商店加载中...",
    maxProtectors: "您已拥有最大数量的连续记录保护器。",
    notEnoughCoins: "您需要 {{cost}} 颗猫咪币来购买此物品。",
    confirmPurchase: "确认购买",
    buyProtectorConfirm: "花费 60 颗猫咪币购买 1 个连续记录保护器？",
    cancel: "取消",
    confirm: "确认",
    purchaseError: "无法完成购买。",
    errorConnection: "连接错误",
    comingSoon: "敬请期待",
    buyItemConfirm: "花费 {{cost}} 颗猫咪币购买 {{name}}？\n（即将推出）",
    itemDisabled: "该物品尚未启用。",
    successTitle: "购买成功！",
    successDesc: "您已获得：{{name}}",
    great: "太棒了！",
    items: {
      protector: {
        name: "连续记录保护器",
        description: "如果您忘记学习一天，它可以保持您的连续记录完整。",
        equipped: "已装备：{{count}} / 2"
      },
      doubleXp: {
        name: "双倍经验药水",
        description: "在下一节课中获得双倍经验。"
      },
      coinDoubler: {
        name: "金币翻倍器",
        description: "永久翻倍在课程中获得的金币。",
        equipped: "已购买"
      },
      removeAds: {
        name: "移除高级广告",
        description: "永久移除广告并获赠 1500 颗猫咪币。",
        purchased: "已购买"
      },
      sardineForNeko: {
        name: "给 Neko 的沙丁鱼",
        description: "为 Neko 买一条美味的沙丁鱼。他会送你 1000 颗猫咪币作为感谢！"
      }
    }
  },
  streak: {
    loading: "加载中...",
    dayCount: "天连续记录",
    daysCount: "天连续记录",
    record: "最高纪录: {{count}}",
    protectorsTitle: "连续记录保护器",
    protectorsDesc: "如果您忘记练习一天，连续记录保护器可以救你一命。",
    equipped: "已装备 {{count}} / 2"
  },
  ranking: {
    title: "排行榜",
    subtitle: "全球排名 • 英语精通",
    emptyTitle: "排行榜是空的",
    emptySubtitle: "成为第一个获得 XP 并居排行榜首位的人吧!",
    connectionError: "无法连接到排行榜。请检查您的互联网连接。",
    connectionErrorTitle: "连接问题",
    tryAgain: "再试一次",
    loading: "正在加载排行榜...",
    yourRank: "您的排名",
    keepItUp: "保持下去！",
    greatJob: "你在学习方面做得很好。",
    notInRanking: "您还没有进入排行榜！",
    loginToParticipate: "登录参与",
    earnXpToSeeRank: "通过完成课程赚取 XP 来查看您的排名。",
    createAccountToSave: "创建一个账户来保存您的进度并参与竞争。",
    anon: "无名",
    xp: "XP"
  }
};

export default gamification;
