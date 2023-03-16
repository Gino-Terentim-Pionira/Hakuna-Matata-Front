import monkey from "../../../assets/sprites/monkey/monkey.png";
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
            texts: [
                `Olá, jovem viajante. Seu nome é ${userName}, certo?`,
                'Eu sou o Babuíno e preciso de sua ajuda. A Savana está sendo corrompida pela “Ignorância” e o único jeito de combatê-la é aumentando a nossa “Sabedoria”.',
                'Faço parte do grupo “Pioneiros” e junto com outros somos responsáveis por treinar viajantes com grande potencial assim como você!',
                'Se desejar embarcar nessa aventura e nos ajudar a livrar a Savana da “Ignorância”, vá em frente e acesse uma das trilhas para conhecer os treinadores',
                'Só tome cuidado com o covil da Mamba Negra, ela será seu desafio final nessa jornada',
                'Antes de você ir, gostaria de te dar algumas joias para te ajudar nesse começo. Tenha uma boa viagem!'
            ]
        }
    ]

    return script;
}



export default mainPageScript;
