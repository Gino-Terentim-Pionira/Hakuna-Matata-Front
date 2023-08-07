import cheetah from "../../../assets/sprites/cheetah/cheetah.png";


const cheetahFreeLunch = (userName: string) => {

    const script = [
        {
            name: "Cheetah",
            image: cheetah,
            texts: [
                `Prazer ${userName}, eu sou Cheetah, o treinador mais rápido destas bandas. Somente os mais velozes conseguem me derrotar. Será que um filhote como você vai conseguir se equiparar a mim? Então filhote, já que é a sua primeira vez tentando encarar este desafio eu vou te explicar sobre as “Habilidades”.`,
                'Para conseguir derrotar de vez a “Ignorância” é preciso se desenvolver em algumas áreas da “Sabedoria”. Eu sou responsável pela área da Agilidade e vou te ensinar a não ficar para trás com a “Ignorância”. Ao longo do seu treinamento, você receberá pontos de habilidade em cada uma dessas áreas e poderá checá-los no seu passaporte',
                'Para provar a mim que você é veloz, terá que me enfrentar e passar pelo meu desafio. Assim, os desafios sempre vão estar disponíveis, maaaaas se você não estiver bem treinado sempre vai comer poeira, então se esforce, treine, trabalhe duro e quem sabe um dia se torne digno(a) de combater a “Ignorância”',
                'Então, filhote, você deve estar ansioso(a) para começar os desafios. Mas, cuidado: sempre que você tropeçar nesta corrida contra a “Ignorância”, ela vai conseguir ficar ainda mais à nossa frente. Então, antes de responder, pense bem e não corra. Os filhotes devem avaliar bem cada passo que forem dar, para, um dia, aprenderem a correr.',
                'E o contrário acontecerá também: a cada sucesso, a “Ignorância” fica cada vez mais para trás. Para facilitar sua jornada, vou te dar umas “rodinhas”. Vai com tudo, filhote!!'
            ]
        }
    ];

    return script;
}

export default cheetahFreeLunch;
