import { Translation } from '../types';

const notificationService: Translation['notificationService'] = {
  channelName: "Rappels de série",
  practice: [
    { title: "C'est l'heure de pratiquer ! 📚", body: "Quelques minutes par jour peuvent grandement améliorer votre anglais." },
    { title: "Petits pas, grands progrès 🌟", body: "Pratiquez un peu maintenant et continuez d'avancer." },
    { title: "Prêt pour l'anglais aujourd'hui ? 🤔", body: "Il n'est jamais trop tard pour apprendre. Commencez maintenant !" },
    { title: "Votre objectif est proche 🗣️", body: "Chaque séance vous rapproche de la fluidité." },
    { title: "La régularité est la clé 🧠", body: "Un peu chaque jour fait la différence. C'est parti !" },
    { title: "Ne brisez pas la série 🔥", body: "Vous faites de super progrès, continuez ainsi aujourd'hui !" },
    { title: "Chaque minute compte ⏱️", body: "Même une courte séance compte. Essayez maintenant !" },
    { title: "Amusez-vous 🎯", body: "Apprendre l'anglais peut aussi être divertissant." },
    { title: "Votre anglais s'épanouit 🌱", body: "Continuez à pratiquer pour le voir fleurir." },
    { title: "Défi quotidien ⚡", body: "Lancez-vous et terminez votre pratique quotidienne." }
  ],
  risk: [
    { title: "C'est l'heure de pratiquer ! 📚", body: "Vous avez une série de {{streak}} jours. Faites une leçon maintenant pour protéger vos boucliers !" },
    { title: "Votre série est en danger ! 🚨", body: "Protégez votre série de {{streak}} jours en dédiant quelques minutes à l'anglais." },
    { title: "Le temps file ⏰", body: "Gardez votre série de {{streak}} jours en pratiquant maintenant." },
    { title: "N'abandonnez pas ! 💪", body: "Sécurisez votre série de {{streak}} jours avec une courte leçon." }
  ],
  danger: [
    { title: "Ne perdez pas votre série ! 🔥", body: "Il ne reste qu'une heure avant minuit. Terminez une leçon tout de suite !" },
    { title: "Dernière chance ⏳", body: "Votre série est sur le point d'être réinitialisée. Pratiquez maintenant !" },
    { title: "Agissez vite ! ⚡", body: "Il reste très peu de temps pour terminer la journée. Sauvez votre série !" },
    { title: "C'est maintenant ou jamais ! 🏃", body: "Don't let the clock beat you without practicing today." }
  ]
};

export default notificationService;
