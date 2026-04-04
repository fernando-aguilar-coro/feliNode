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
  }
};

export default gamification;
