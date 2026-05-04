import { Translation } from '../types';

const home: Translation['home'] = {
  tabs: {
    learn: "Learn",
    practice: "Practice",
    settings: "Settings"
  },
  offline: "Internet connection unavailable, some features may not work",
  viewModes: {
    node: "Switch to Tree Map",
    list: "Switch to List View"
  },
  modals: {
    kokoro: {
      title: "Improve Pronunciation",
      description: "neko can use an advanced voice model (Kokoro TTS) to offer a more natural English pronunciation, without the need for an internet connection.",
      subtitle: "Requires downloading a voice model (approx. 300MB) only once.",
      accept: "Download and improve audio",
      decline: "Use Native voice (No download)"
    },
    firstPractice: {
      title: "Try Your First Practice!",
      description: "Would you like to try a quick word matching exercise in English with its translation? It's a fun way to start practicing.",
      subtitle: "Connect pairs of words in English and Spanish against the clock. 🎯",
      accept: "Let's practice!",
      decline: "Not now, thanks"
    }
  }
};

export default home;
