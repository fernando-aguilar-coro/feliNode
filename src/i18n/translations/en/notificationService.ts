import { Translation } from '../types';

const notificationService: Translation['notificationService'] = {
  channelName: "Streak Reminders",
  practice: [
    { title: "Time to practice! 📚", body: "Just a few minutes today can greatly improve your English." },
    { title: "Small steps, big progress 🌟", body: "Practice a bit now and keep moving forward." },
    { title: "Ready for English today? 🤔", body: "Never too late to learn something new. Start now!" },
    { title: "Your goal is near 🗣️", body: "Every practice brings you closer to fluency." },
    { title: "Consistency is key 🧠", body: "A little every day makes a difference. Let's go!" },
    { title: "Don't break the streak 🔥", body: "You are making great progress, keep it up today!" },
    { title: "Every minute counts ⏱️", body: "Even a short practice adds up. Try it now!" },
    { title: "Make it fun 🎯", body: "Learning English can be entertaining too." },
    { title: "Your English is growing 🌱", body: "Keep practicing to see it flourish." },
    { title: "Daily challenge ⚡", body: "Jump in and complete your daily practice." }
  ],
  risk: [
    { title: "Time to practice! 📚", body: "You have a {{streak}} day streak. Do a lesson now so your shields aren't affected!" },
    { title: "Your streak is at risk! 🚨", body: "Protect your {{streak}} day streak by dedicating a few minutes to English." },
    { title: "Time flies ⏰", body: "Keep your {{streak}} day streak by practicing now." },
    { title: "Don't give up! 💪", body: "Secure your {{streak}} day streak with a short lesson." }
  ],
  danger: [
    { title: "Don't lose your streak! 🔥", body: "Only an hour left until midnight. Complete a lesson right now!" },
    { title: "Last chance ⏳", body: "Your streak is about to reset. Practice now!" },
    { title: "Act fast! ⚡", body: "Very little time left to finish the day. Save your streak!" },
    { title: "Now or never! 🏃", body: "Don't let the clock beat you without practicing today." }
  ]
};

export default notificationService;
