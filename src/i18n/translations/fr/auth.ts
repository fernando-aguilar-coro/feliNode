import { Translation } from '../types';

const auth: Translation['auth'] = {
  login: {
    emailRequired: "Veuillez entrer votre email",
    sendCodeError: "Erreur lors de l'envoi du code",
    codeRequired: "Veuillez entrer le code à 6 chiffres",
    verifyCodeError: "Le code est incorrect ou a expiré",
    loginWithEmail: "Se connecter avec un email",
    guestMode: "Mode Invité",
    titleInitial: "Se connecter",
    titleEmail: "Bienvenue",
    titleVerify: "Vérification",
    subtitleInitial: "Apprenez l'anglais de manière simple et amusante.",
    subtitleEmail: "Connectez-vous avec votre email",
    subtitleVerify: "Entrez le code envoyé à {{email}}",
    emailLabel: "Adresse email",
    emailPlaceholder: "exemple@email.com",
    codeLabel: "Code de vérification",
    codePlaceholder: "123456",
    processing: "Traitement en cours...",
    continueWithEmail: "Continuer avec l'email",
    verifyAndLogin: "Vérifier et se connecter",
    goBack: "Retour",
    changeEmail: "Changer d'email",
    googleSignInError: "Erreur lors de la connexion avec Google",
    continueWithGoogle: "Continuer avec Google"
  }
};

export default auth;
