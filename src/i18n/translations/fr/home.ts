import { Translation } from '../types';

const home: Translation['home'] = {
  tabs: {
    learn: "Apprendre",
    practice: "Pratiquer",
    settings: "Paramètres"
  },
  offline: "Connexion internet indisponible, certaines fonctionnalités peuvent ne pas fonctionner",
  viewModes: {
    tree: "Passer à la carte arborescente",
    list: "Passer à la vue en liste"
  },
  modals: {
    kokoro: {
      title: "Améliorer la prononciation",
      description: "neko peut utiliser un modèle vocal avancé (Kokoro TTS) pour offrir une prononciation anglaise plus naturelle, sans avoir besoin d'une connexion internet.",
      subtitle: "Nécessite le téléchargement d'un modèle vocal (environ 300 Mo) une seule fois.",
      accept: "Télécharger et améliorer l'audio",
      decline: "Utiliser la voix native (sans téléchargement)"
    },
    firstPractice: {
      title: "Essayez votre première pratique !",
      description: "Souhaitez-vous essayer un exercice rapide de correspondance de mots en anglais avec leur traduction ? C'est une façon amusante de commencer à pratiquer.",
      subtitle: "Reliez des paires de mots en anglais et en espagnol contre la montre. 🎯",
      accept: "Pratiquons !",
      decline: "Pas maintenant, merci"
    }
  }
};

export default home;
