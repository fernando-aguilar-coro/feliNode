import { Translation } from '../types';

const gamification: Translation['gamification'] = {
  speak: {
    thinking: "Pensando",
    placeholder: "Escribe un mensaje...",
    error: "No se pudo obtener respuesta. Inténtalo de nuevo."
  },
  shop: {
    loading: "Cargando tienda...",
    maxProtectors: "Ya tienes el máximo de protectores de racha.",
    notEnoughCoins: "Necesitas {{cost}} Michi-Coins para comprar este artículo.",
    confirmPurchase: "Confirmar Compra",
    buyProtectorConfirm: "¿Comprar 1 Protector de Racha por 60 Michi-Coins?",
    cancel: "Cancelar",
    confirm: "Confirmar",
    purchaseError: "No se pudo completar la compra.",
    errorConnection: "Error de conexión",
    comingSoon: "Próximamente",
    buyItemConfirm: "¿Comprar {{name}} por {{cost}} Michi-Coins?\n(Próximamente)",
    itemDisabled: "Este artículo aún no está habilitado.",
    successTitle: "¡Compra Exitosa!",
    successDesc: "Has adquirido: {{name}}",
    great: "¡Genial!",
    items: {
      protector: {
        name: "Protector de Racha",
        description: "Permite mantener tu racha intacta si olvidas estudiar un día.",
        equipped: "Equipados: {{count}} / 2"
      },
      doubleXp: {
        name: "Poción de Doble XP",
        description: "Obtén el doble de experiencia en tu próxima lección."
      },
      coinDoubler: {
        name: "Duplicador de Monedas",
        description: "Duplica permanentemente las monedas obtenidas en tus lecciones.",
        equipped: "Comprado"
      },
      removeAds: {
        name: "Quitar Anuncios Premium",
        description: "Elimina anuncios PARA SIEMPRE y recibe 1500 MichiCoins de regalo.",
        purchased: "Comprado"
      },
      sardineForNeko: {
        name: "Sardina para Neko",
        description: "Compra una deliciosa sardina para Neko. ¡Él te lo agradecerá con 1000 MichiCoins!"
      }
    }
  },
  streak: {
    loading: "Cargando...",
    dayCount: "día de racha",
    daysCount: "días de racha",
    record: "Récord: {{count}}",
    protectorsTitle: "Protectores de Racha",
    protectorsDesc: "El protector de racha te salva si olvidas practicar por un día.",
    equipped: "{{count}} / 2 Equipados"
  },
  ranking: {
    title: "Ranking",
    subtitle: "Clasificación Global • Dominio del Inglés",
    emptyTitle: "Ranking Vacío",
    emptySubtitle: "¡Sé el primero en ganar XP y encabezar el ranking!",
    connectionError: "No se pudo conectar con el ranking. Por favor, revisa tu conexión a internet.",
    connectionErrorTitle: "Problema de Conexión",
    tryAgain: "Reintentar",
    loading: "Cargando Ranking...",
    yourRank: "Tu Rango",
    keepItUp: "¡Sigue así!",
    greatJob: "Estás haciendo un gran trabajo en tu aprendizaje.",
    notInRanking: "¡Aún no estás en el ranking!",
    loginToParticipate: "Inicia sesión para participar",
    earnXpToSeeRank: "Gana XP completando lecciones para ver tu posición.",
    createAccountToSave: "Crea una cuenta para guardar tu progreso y competir.",
    anon: "Anon",
    xp: "XP"
  }
};

export default gamification;
