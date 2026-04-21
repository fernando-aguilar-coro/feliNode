import { Translation } from '../types';

const gamification: Translation['gamification'] = {
  speak: {
    thinking: "Réflexion en cours",
    placeholder: "Tapez un message...",
    error: "Impossible d'obtenir une réponse. Réessayez."
  },
  shop: {
    loading: "Chargement de la boutique...",
    maxProtectors: "Vous avez déjà le nombre maximum de protecteurs de série.",
    notEnoughCoins: "Il vous faut {{cost}} Michi-Coins pour acheter cet objet.",
    confirmPurchase: "Confirmer l'achat",
    buyProtectorConfirm: "Acheter 1 Protecteur de Série pour 60 Michi-Coins ?",
    cancel: "Annuler",
    confirm: "Confirmer",
    purchaseError: "Impossible de terminer l'achat.",
    errorConnection: "Erreur de connexion",
    comingSoon: "Bientôt disponible",
    buyItemConfirm: "Acheter {{name}} pour {{cost}} Michi-Coins ?\n(Bientôt disponible)",
    itemDisabled: "Cet objet n'est pas encore activé.",
    successTitle: "Achat réussi !",
    successDesc: "Vous avez acquis : {{name}}",
    great: "Génial !",
    items: {
      protector: {
        name: "Protecteur de Série",
        description: "Garde votre série intacte si vous oubliez d'étudier pendant une journée.",
        equipped: "Équipé : {{count}} / 2"
      },
      doubleXp: {
        name: "Potion Double XP",
        description: "Obtenez le double d'expérience lors de votre prochaine leçon."
      },
      coinDoubler: {
        name: "Doubleur de Pièces",
        description: "Doublez de façon permanente les pièces gagnées lors de vos leçons.",
        equipped: "Acheté"
      },
      removeAds: {
        name: "Premium sans publicités",
        description: "Supprimez les publicités POUR TOUJOURS et recevez 1500 MichiCoins en cadeau.",
        purchased: "Acheté"
      },
      sardineForNeko: {
        name: "Sardine pour Neko",
        description: "Achetez une délicieuse sardine pour Neko. Il vous remerciera avec 1000 MichiCoins !"
      }
    }
  },
  streak: {
    loading: "Chargement...",
    dayCount: "jour de série",
    daysCount: "jours de série",
    record: "Record : {{count}}",
    protectorsTitle: "Protecteurs de Série",
    protectorsDesc: "Le protecteur de série vous sauve si vous oubliez de pratiquer pendant une journée.",
    equipped: "{{count}} / 2 Équipés"
  },
  ranking: {
    title: "Classement",
    subtitle: "Classement Mondial • Maîtrise de l'anglais",
    emptyTitle: "Classement Vide",
    emptySubtitle: "Soyez le premier à marquer des points XP et à dominer le classement !",
    connectionError: "Impossible de se connecter au classement. Veuillez vérifier votre connexion internet.",
    connectionErrorTitle: "Problème de connexion",
    tryAgain: "Réessayer",
    loading: "Chargement du classement...",
    yourRank: "Votre rang",
    keepItUp: "Continuez comme ça !",
    greatJob: "Vous faites un excellent travail dans votre apprentissage.",
    notInRanking: "Vous n'êtes pas encore dans le classement !",
    loginToParticipate: "Connectez-vous pour participer",
    earnXpToSeeRank: "Gagnez des XP en terminant des leçons pour voir votre position.",
    createAccountToSave: "Créez un compte pour sauvegarder votre progression et participer à la compétition.",
    anon: "Anonyme",
    xp: "XP"
  }
};

export default gamification;
