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
  }
};

export default gamification;
