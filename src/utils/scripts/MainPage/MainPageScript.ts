import monkey from "../../../assets/sprites/monkey/monkey.png";
import monkeyHappy from "../../../assets/sprites/monkey/monkeyHappy.png";
import mamba from "../../../assets/sprites/blackMamba/mamba_negra.png";
import api from '../../../services/api';



const getUser = async () => {
    const _userId = sessionStorage.getItem('@pionira/userId');
    const res = await api.get(`/user/${_userId}`);

    return res.data.userName;

}


const mainPageScript = async () => {

    const userName = await getUser();
    const script = [
        {
            name: "Babuíno",
            image: monkey,
            texts: [`Olá, jovem viajante. Seu nome é ${userName}, certo?`, 
            "Bem vindo à Savana! Eu sou o Babuíno, recrutador dos “Pioneiros” e nós precisamos urgentemente da sua ajuda",
            "A Savana está sendo corrompida pela “Ignorância”, alienando todos os animais que moram aqui",
            "Eu e mais alguns outros animais conseguimos escapar da alienação e fundamos os “Pioneiros”, um grupo com o objetivo de acabar com a “Ignorância” de uma vez por todas",
            "Mas não estamos conseguindo fazer isso sozinhos e por isso eu sou responsável por recrutar e guiar viajantes capazes como você para nos ajudar na nossa batalha",
            "A “Ignorância” é uma energia corruptiva que prejudica a nossa mente e a nossa visão. Quanto mais alienados estamos, mais Ignorantes ficamos ao mundo e tudo começa a ficar preto e branco",
            "Vejo que você possui um potencial gigantesco e, se treinado corretamente, pode nos ajudar a virar o jogo. Para isso, você deve passar por todas as trilhas e completar o treinamento de todos os “Treinadores”. Eles são os responsáveis por oferecer conteúdos que irão te ajudar nos desafios de cada trilha",
            "Só um aviso sobre os “Treinadores”, eles não serão tão gentis como eu estou sendo, eles irão te testar ao limite para terem certeza de que seu potencial foi desenvolvido e que estará pronto para enfrentar a “Ignorância”",
            "Cada ação sua dentro dos treinamentos irá impactar na nossa situação: ao provar que aprendeu os conteúdos, a Ignorância irá diminuir e se ocorrer o contrário, ela irá aumentar",
            "Depois de passar pelas trilhas, você estará pronto para desafiar a Mamba Negra!"]
        },
        {
            name: "Mamba Negra",
            image: mamba,
            texts: [`Ora ora, Prazer em te conhecer, ${userName}!`, 
            "Eu sou a Mamba Negra, e como o Babuíno disse, serei seu desafio final",
            "Meu papel é garantir que você está totalmente pronto para combater a “Ignorância” e por isso não pegarei leve! Você pode me desafiar a qualquer momento, mas já vou avisando: se não tiver completado todos os treinamentos...",
            "...será quase impossível passar por mim!"]
        },
        {
            name: "Babuíno",
            image: monkeyHappy,
            texts: ["Obrigado, Mamba negra. Viu o que disse, né? Eles não serão tão gentis",
            "Por último, iremos te recompensar com Joias do conhecimento que poderão ser utilizadas para conseguir materiais extras e itens que podem te ajudar na sua jornada. Ao entrar aqui todo dia, você também receberá um pouco de Joias do conhecimento que vão aumentando a cada dia",
            "Dito isso, você está pronto para começar a sua jornada e tome aqui um pouco de Joias do conhecimento para começar com tudo!"]
        }
    ]

    return script;
}



export default mainPageScript;
