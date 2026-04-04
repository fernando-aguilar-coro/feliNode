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
  }
};

export default gamification;
