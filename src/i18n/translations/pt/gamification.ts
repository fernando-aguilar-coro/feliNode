import { Translation } from '../types';

const gamification: Translation['gamification'] = {
  speak: {
    thinking: "Pensando",
    placeholder: "Escreva uma mensagem...",
    error: "Não foi possível obter resposta. Tente novamente."
  },
  shop: {
    loading: "Carregando loja...",
    maxProtectors: "Você já tem o máximo de protetores de ofensiva.",
    notEnoughCoins: "Você precisa de {{cost}} Michi-Coins para comprar este item.",
    confirmPurchase: "Confirmar Compra",
    buyProtectorConfirm: "Comprar 1 Protetor de Ofensiva por 60 Michi-Coins?",
    cancel: "Cancelar",
    confirm: "Confirmar",
    purchaseError: "Não foi possível concluir a compra.",
    errorConnection: "Erro de conexão",
    comingSoon: "Em breve",
    buyItemConfirm: "Comprar {{name}} por {{cost}} Michi-Coins?\n(Em breve)",
    itemDisabled: "Este item ainda não está habilitado.",
    successTitle: "Compra com Sucesso!",
    successDesc: "Você adquiriu: {{name}}",
    great: "Ótimo!",
    items: {
      protector: {
        name: "Protetor de Ofensiva",
        description: "Permite manter sua ofensiva intacta se você esquecer de estudar por um dia.",
        equipped: "Equipados: {{count}} / 2"
      },
      doubleXp: {
        name: "Poção de Dobro XP",
        description: "Obtenha o dobro de experiência na sua próxima lição."
      },
      coinDoubler: {
        name: "Duplicador de Moedas",
        description: "Duplica permanentemente as moedas obtidas nas suas lições.",
        equipped: "Comprado"
      },
      removeAds: {
        name: "Remover Anúncios Premium",
        description: "Elimine anúncios PARA SEMPRE e receba 1500 MichiCoins de presente.",
        purchased: "Comprado"
      },
      sardineForNeko: {
        name: "Sardinha para Neko",
        description: "Compre uma deliciosa sardinha para Neko. Ele agradecerá com 1000 MichiCoins!"
      }
    }
  },
  streak: {
    loading: "Carregando...",
    dayCount: "dia de ofensiva",
    daysCount: "dias de ofensiva",
    record: "Recorde: {{count}}",
    protectorsTitle: "Protetores de Ofensiva",
    protectorsDesc: "O protetor de ofensiva salva você se esquecer de praticar por um dia.",
    equipped: "{{count}} / 2 Equipados"
  },
  ranking: {
    title: "Ranking",
    subtitle: "Classificação Global • Domínio do Inglês",
    emptyTitle: "Ranking Vazio",
    emptySubtitle: "Seja o primeiro a ganhar XP e liderar o ranking!",
    connectionError: "Não foi possível conectar ao ranking. Por favor, verifique sua conexão com a internet.",
    connectionErrorTitle: "Problema de Conexão",
    tryAgain: "Tentar novamente",
    loading: "Carregando Ranking...",
    yourRank: "Seu Rank",
    keepItUp: "Continue assim!",
    greatJob: "Você está fazendo um ótimo trabalho no seu aprendizado.",
    notInRanking: "Você ainda não está no ranking!",
    loginToParticipate: "Faça login para participar",
    earnXpToSeeRank: "Ganhe XP completando lições para ver sua posição.",
    createAccountToSave: "Crie uma conta para salvar seu progresso e competir.",
    anon: "Anon",
    xp: "XP"
  }
};

export default gamification;
