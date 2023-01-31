import cheetah from "../../../assets/sprites/cheetah/cheetah.png";
import api from '../../../services/api';

const getUser = async () => {
    const _userId = sessionStorage.getItem('@pionira/userId');
    const res = await api.get(`/user/${_userId}`);

    return res.data.userName;

}


const trail1FreeLunch = async () => {

    const userName = await getUser();
    const script = [
        {
            name: "Cheetah",
            image: cheetah,
            texts: [
                `Prazer ${userName}, eu sou eu sou Cheetah, o treinador mais rápido dessas bandas`, 
                'Somente os mais velozes conseguem me derrotar. Será que um filhote como você vai conseguir se equiparar a mim?',
                'Então filhote, já que é a sua primeira vez tentando encarar esse desafio eu vou te explicar sobre as “Habilidades”. Para conseguir derrotar de vez a “Ignorância” é preciso se desenvolver em algumas áreas da “Sabedoria”',
                'Eu sou responsável pela área da Agilidade e vou te ensinar a não ficar para trás com a “Ignorância”. Ao longo do seu treinamento, você receberá pontos de habilidade em cada uma dessas áreas e poderá checar eles no seu passaporte',
                'Para provar a mim que você é veloz, terá que me enfrentar e passar pelo meu desafio. Assim, os desafios sempre vão estar disponíveis, maaaaas se você não estiver bem treinado sempre vai comer poeira, então se esforce, treine,trabalhe duro e quem sabe um dia se torne digno(a) de combater a “Ignorância”',
                'Então filhote, você deve estar ansioso para começar os desafios, mas sempre que você tropeçar nessa corrida contra a “Ignorância” ela vai conseguir ficar ainda mais na nossa frente. Então antes de responder pense bem, não corra sem pensar, os filhotes devem pensar bem cada passo que forem dar, para um dia aprenderem a correr',
                'E o contrário acontecerá também: a cada sucesso a “Ignorância” fica cada vez mais para trás. Pra já facilitar na sua jornada eu vou te dar umas "rodinhas" pra dar uma ajudinha na sua jornada, vai com tudo filhote'
            ]
        }
    ];

    return script;
}

export default trail1FreeLunch;
