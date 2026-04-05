import { Translation } from '../types';

const gamification: Translation['gamification'] = {
  speak: {
    thinking: "Thinking",
    placeholder: "Type a message...",
    error: "Could not get a response. Try again."
  },
  shop: {
    loading: "Loading shop...",
    maxProtectors: "You already have the maximum number of streak protectors.",
    notEnoughCoins: "You need {{cost}} Michi-Coins to buy this item.",
    confirmPurchase: "Confirm Purchase",
    buyProtectorConfirm: "Buy 1 Streak Protector for 60 Michi-Coins?",
    cancel: "Cancel",
    confirm: "Confirm",
    purchaseError: "Could not complete the purchase.",
    comingSoon: "Coming Soon",
    buyItemConfirm: "Buy {{name}} for {{cost}} Michi-Coins?\n(Coming Soon)",
    itemDisabled: "This item is not yet enabled.",
    successTitle: "Purchase Successful!",
    successDesc: "You have acquired: {{name}}",
    great: "Great!",
    items: {
      protector: {
        name: "Streak Protector",
        description: "Keeps your streak intact if you forget to study for a day.",
        equipped: "Equipped: {{count}} / 2"
      },
      doubleXp: {
        name: "Double XP Potion",
        description: "Get double experience on your next lesson."
      },
      coinDoubler: {
        name: "Coin Doubler",
        description: "Permanently double the coins earned in your lessons.",
        equipped: "Purchased"
      }
    }
  },
  streak: {
    loading: "Loading...",
    dayCount: "day streak",
    daysCount: "days streak",
    record: "Record: {{count}}",
    protectorsTitle: "Streak Protectors",
    protectorsDesc: "The streak protector saves you if you forget to practice for a day.",
    equipped: "{{count}} / 2 Equipped"
  },
  ranking: {
    title: "Leaderboard",
    subtitle: "Global Rankings • English Mastery",
    emptyTitle: "Leaderboard Empty",
    emptySubtitle: "Be the first to score XP and top the ranking!",
    connectionError: "Could not connect to the leaderboard. Please check your internet connection.",
    connectionErrorTitle: "Connection Issue",
    tryAgain: "Try Again",
    loading: "Loading Leaderboard...",
    yourRank: "Your Rank",
    keepItUp: "Keep it up!",
    greatJob: "You are doing a great job in your learning.",
    notInRanking: "You are not in the ranking yet!",
    loginToParticipate: "Log in to participate",
    earnXpToSeeRank: "Earn XP by completing lessons to see your position.",
    createAccountToSave: "Create an account to save your progress and compete.",
    anon: "Anon",
    xp: "XP"
  }
};

export default gamification;
