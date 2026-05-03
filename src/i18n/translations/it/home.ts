import { Translation } from '../types';

const home: Translation['home'] = {
  tabs: {
    learn: "Impara",
    practice: "Pratica",
    settings: "Impostazioni"
  },
  offline: "Connessione internet non disponibile, alcune funzioni non saranno disponibili",
  viewModes: {
    tree: "Passa alla Mappa dei Nodi",
    list: "Passa alla Vista Elenco"
  },
  modals: {
    kokoro: {
      title: "Migliora la Pronuncia",
      description: "nekoEnglish può usare un modello vocale avanzato (Kokoro TTS) per offrire una pronuncia più naturale in inglese, senza necessità di internet.",
      subtitle: "Richiede il download di un modello vocale (circa 300MB) una sola volta.",
      accept: "Scarica e migliora l'audio",
      decline: "Usa voce nativa (Non scaricare)"
    },
    firstPractice: {
      title: "Prova la tua prima pratica!",
      description: "Ti piacerebbe provare un esercizio veloce di abbinamento parole in inglese con la loro traduzione? È un modo divertente per iniziare a fare pratica.",
      subtitle: "Collega coppie di parole in inglese e italiano contro il tempo. 🎯",
      accept: "Andiamo a fare pratica!",
      decline: "Non ora, grazie"
    }
  }
};

export default home;
