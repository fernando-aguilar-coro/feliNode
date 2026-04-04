import { Translation } from '../types';

const notificationService: Translation['notificationService'] = {
  channelName: "Recordatorios de Racha",
  practice: [
    { title: "¡Momento de practicar! 📚", body: "Solo unos minutos hoy pueden mejorar mucho tu inglés." },
    { title: "Pequeños pasos, gran progreso 🌟", body: "Practica un poco ahora y sigue avanzando." },
    { title: "¿Listo para tu inglés de hoy? 🤔", body: "Nunca es tarde para aprender algo nuevo. ¡Empieza!" },
    { title: "Tu meta está cerca 🗣️", body: "Cada práctica te acerca a hablar con fluidez." },
    { title: "Constancia es la clave 🧠", body: "Un poco cada día hace la diferencia. ¡Vamos!" },
    { title: "No rompas la racha 🔥", body: "Llevas buen progreso, ¡continúa hoy!" },
    { title: "Un minuto cuenta ⏱️", body: "Incluso una práctica corta suma. ¡Inténtalo ahora!" },
    { title: "Hazlo divertido 🎯", body: "Aprender inglés también puede ser entretenido." },
    { title: "Tu inglés está creciendo 🌱", body: "Sigue practicando para verlo florecer." },
    { title: "Desafío del día ⚡", body: "Entra y completa tu práctica diaria." }
  ],
  risk: [
    { title: "¡Es hora de practicar! 📚", body: "Tienes una racha de {{streak}} días. ¡Haz una lección ahora para que no afecte a tus protectores!" },
    { title: "¡Tu racha está en riesgo! 🚨", body: "Protege tu racha de {{streak}} días dedicando unos minutos al inglés." },
    { title: "El tiempo vuela ⏰", body: "Conserva tu racha de {{streak}} días practicando ahora." },
    { title: "¡No te rindas! 💪", body: "Asegura tu racha de {{streak}} días con una lección corta." }
  ],
  danger: [
    { title: "¡No pierdas tu racha! 🔥", body: "Solo queda una hora para medianoche. ¡Completa una lección ahora mismo!" },
    { title: "Última oportunidad ⏳", body: "Tu racha está a punto de reiniciarse. ¡Practica ya!" },
    { title: "¡Actúa rápido! ⚡", body: "Queda muy poco para que termine el día. ¡Salva tu racha!" },
    { title: "¡Es ahora o nunca! 🏃", body: "No dejes que el reloj te gane sin practicar hoy." }
  ]
};

export default notificationService;
