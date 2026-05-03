import { Translation } from '../types';

const auth: Translation['auth'] = {
  login: {
    emailRequired: "Per favore inserisci la tua email",
    sendCodeError: "Errore durante l'invio del codice",
    codeRequired: "Per favore inserisci il codice di 6 cifre",
    verifyCodeError: "Il codice è errato o è scaduto",
    loginWithEmail: "Accedi con Email",
    guestMode: "Modalità Ospite",
    titleInitial: "Accedi",
    titleEmail: "Benvenuto",
    titleVerify: "Verifica",
    subtitleInitial: "Impara l'inglese in modo facile e divertente.",
    subtitleEmail: "Accedi con il tuo indirizzo email",
    subtitleVerify: "Inserisci il codice inviato a {{email}}",
    emailLabel: "Indirizzo email",
    emailPlaceholder: "esempio@email.com",
    codeLabel: "Codice di verifica",
    codePlaceholder: "123456",
    processing: "Elaborazione...",
    continueWithEmail: "Continua con Email",
    verifyAndLogin: "Verifica e Accedi",
    goBack: "Indietro",
    changeEmail: "Cambia email",
    googleSignInError: "Errore con Google Sign In",
    continueWithGoogle: "Continua con Google"
  }
};

export default auth;
