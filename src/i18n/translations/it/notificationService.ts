import { Translation } from '../types';

const notificationService: Translation['notificationService'] = {
  channelName: "Promemoria Serie",
  practice: [
    { title: "È ora di praticare! 📚", body: "Solo pochi minuti oggi possono migliorare molto il tuo inglese." },
    { title: "Piccoli passi, grandi progressi 🌟", body: "Esercitati un po' ora e continua ad avanzare." },
    { title: "Pronto per l'inglese di oggi? 🤔", body: "Non è mai troppo tardi per imparare qualcosa di nuovo. Inizia!" },
    { title: "Il tuo obiettivo è vicino 🗣️", body: "Ogni pratica ti avvicina alla fluidità." },
    { title: "La costanza è la chiave 🧠", body: "Un po' ogni giorno fa la differenza. Forza!" },
    { title: "Non interrompere la serie 🔥", body: "Stai facendo buoni progressi, continua oggi!" },
    { title: "Un minuto conta ⏱️", body: "Anche una breve pratica conta. Provaci ora!" },
    { title: "Rendilo divertente 🎯", body: "Imparare l'inglese può anche essere piacevole." },
    { title: "Il tuo inglese sta crescendo 🌱", body: "Continua a praticare per vederlo fiorire." },
    { title: "Sfida del giorno ⚡", body: "Entra e completa la tua pratica quotidiana." }
  ],
  risk: [
    { title: "È ora di fare pratica! 📚", body: "Hai una serie di {{streak}} giorni. Fai una lezione ora per non consumare le tue protezioni!" },
    { title: "La tua serie è a rischio! 🚨", body: "Proteggi la tua serie di {{streak}} giorni dedicando qualche minuto all'inglese." },
    { title: "Il tempo vola ⏰", body: "Conserva la tua serie di {{streak}} giorni facendo pratica ora." },
    { title: "Non arrenderti! 💪", body: "Assicura la tua serie di {{streak}} giorni con una breve lezione." }
  ],
  danger: [
    { title: "Non perdere la tua serie! 🔥", body: "Manca solo un'ora a mezzanotte. Completa una lezione subito!" },
    { title: "Ultima opportunità ⏳", body: "La tua serie sta per azzerarsi. Fai pratica ora!" },
    { title: "Agisci in fretta! ⚡", body: "Manca pochissimo alla fine della giornata. Salva la tua serie!" },
    { title: "Ora o mai più! 🏃", body: "Non lasciare che l'orologio vinca senza aver fatto pratica oggi." }
  ]
};

export default notificationService;
