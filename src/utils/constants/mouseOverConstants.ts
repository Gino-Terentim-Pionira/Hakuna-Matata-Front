// Mouseover Texts

import colorPalette from "../../styles/colorPalette";

export const LOGIN = 'Fazer Login';

export const REGISTER = 'Fazer Cadastro';

export const USER_PROFILE = 'Perfil de Usuário';

export const STORE = 'Acessar Loja';

export const INVENTORY = 'Acessar Inventário';

export const TUTORIAL = 'Acessar Tutorial';

export const LOG_OUT = 'Encerrar Sessão';

export const MAP = 'Voltar para seleção de trilhas';

export const CHEETAH_TRAIL = 'Trilha do Cheetah';

export const BLOCKED_TRAIL = 'Trilha Bloqueada';

export const WISDOM = 'Seu progresso na luta contra a Ignorância';

export const COINS = 'Quantidade atual de Joias';

export const MODULE_INFO = (type: 'blocked' | 'incomplete' | 'complete', totalAnsweredQuestions: number | null, totalQuestions: number | null) => {
    const module_info = {
        'blocked' : {
            description: "Resolva o módulo anterior para acessar!",
            availabilityInfo: "Módulo bloqueado",
            availabilityColor: colorPalette.closeButton
        },
        'incomplete' : {
            description: `${totalAnsweredQuestions}/${totalQuestions} questões acertadas!`,
            availabilityInfo: "Acesso liberado",
            availabilityColor: colorPalette.inactiveButton
        },
        'complete' : {
            description: `${totalAnsweredQuestions}/${totalQuestions} questões acertadas!`,
            availabilityInfo: "100% concluído",
            availabilityColor: colorPalette.correctAnswer
        }
    }

    return module_info[type];
}

export const SURPRISE_CHEST = 'Abrir baú surpresa';

export const CHEETAH_FINAL = 'Desafio Final do Cheetah';

export const BACK_BUTTON = 'Voltar';

export const RELIC_DESCRIPTION = 'Visualizar descrição da relíquia';

export const LOCKED_BADGE = 'Domine um desafio para merecer esta insígnia';

export const IGNORANCE_GLASS = "Óculos da ignorância";

export const STATUS = 'Seu progresso na trilha';

export const CHAT = "Sabedoria do Babuíno";

export const DAILY_QUIZ = "Desafio diário";

export const ORACLE = "Consultar o Oráculo";

export const BLOCKED_ORACLE = "Complete o primeiro módulo para desbloquear o Oráculo!";

export const NOT_ENOUGH_STATUS = (statusName: string) => `Seu nivel de ${statusName} não é o suficiente para comprar esse item!`

export const  NOT_ENOUGHT_COINS = 'Você não tem moedas suficientes!';

export const NOT_ENOUGH_MESSAGES = 'É necessário comprar um pacote de perguntas na loja para falar com o Oráculo';

export const ORACLE_INPUT_BLOCK = 'É necessário finalizar o Desafio Final da trilha para poder conversar livremente com o Oráculo';
