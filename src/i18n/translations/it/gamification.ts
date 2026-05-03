import { Translation } from '../types';

const gamification: Translation['gamification'] = {
  speak: {
    thinking: "Pensando",
    placeholder: "Scrivi un messaggio...",
    error: "Impossibile ottenere una risposta. Riprova."
  },
  shop: {
    loading: "Caricamento negozio...",
    maxProtectors: "Hai già il numero massimo di protezioni per la serie.",
    notEnoughCoins: "Ti servono {{cost}} Michi-Coins per acquistare questo articolo.",
    confirmPurchase: "Conferma Acquisto",
    buyProtectorConfirm: "Acquistare 1 Protezione Serie per 60 Michi-Coins?",
    cancel: "Annulla",
    confirm: "Conferma",
    purchaseError: "Impossibile completare l'acquisto.",
    errorConnection: "Errore di connessione",
    comingSoon: "Prossimamente",
    buyItemConfirm: "Acquistare {{name}} per {{cost}} Michi-Coins?\n(Prossimamente)",
    itemDisabled: "Questo articolo non è ancora abilitato.",
    successTitle: "Acquisto Riuscito!",
    successDesc: "Hai acquistato: {{name}}",
    great: "Ottimo!",
    items: {
      protector: {
        name: "Protezione Serie",
        description: "Permette di mantenere intatta la tua serie se dimentichi di studiare per un giorno.",
        equipped: "Equipaggiati: {{count}} / 2"
      },
      doubleXp: {
        name: "Pozione Doppio XP",
        description: "Ottieni il doppio dell'esperienza nella tua prossima lezione."
      },
      coinDoubler: {
        name: "Raddoppia Monete",
        description: "Raddoppia permanentemente le monete ottenute nelle tue lezioni.",
        equipped: "Acquistato"
      },
      removeAds: {
        name: "Rimuovi Annunci Premium",
        description: "Elimina gli annunci PER SEMPRE e ricevi 1500 MichiCoins in regalo.",
        purchased: "Acquistato"
      },
      sardineForNeko: {
        name: "Sardina per Neko",
        description: "Compra una deliziosa sardina per Neko. Ti ringrazierà con 1000 MichiCoins!"
      }
    }
  },
  streak: {
    loading: "Caricamento...",
    dayCount: "giorno di serie",
    daysCount: "giorni di serie",
    record: "Record: {{count}}",
    protectorsTitle: "Protezioni Serie",
    protectorsDesc: "La protezione serie ti salva se dimentichi di esercitarti per un giorno.",
    equipped: "{{count}} / 2 Equipaggiati"
  },
  ranking: {
    title: "Classifica",
    subtitle: "Classifica Globale • Padronanza dell'Inglese",
    emptyTitle: "Classifica Vuota",
    emptySubtitle: "Sii il primo a guadagnare XP e scalare la classifica!",
    connectionError: "Impossibile connettersi alla classifica. Per favore, controlla la tua connessione internet.",
    connectionErrorTitle: "Problema di Connessione",
    tryAgain: "Riprova",
    loading: "Caricamento Classifica...",
    yourRank: "Il Tuo Grado",
    keepItUp: "Continua così!",
    greatJob: "Stai facendo un ottimo lavoro nel tuo apprendimento.",
    notInRanking: "Non sei ancora in classifica!",
    loginToParticipate: "Accedi per partecipare",
    earnXpToSeeRank: "Guadagna XP completando le lezioni per vedere la tua posizione.",
    createAccountToSave: "Crea un account per salvare i tuoi progressi e competere.",
    anon: "Anon",
    xp: "XP"
  }
};

export default gamification;
