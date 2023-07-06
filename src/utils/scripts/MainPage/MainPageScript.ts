import monkey from "../../../assets/sprites/monkey/monkey.png";


const mainPageScript = (userName: string) => {

    const script = [
        {
            name: "Babuíno",
            image: monkey,
            texts: [
                `Olá, jovem viajante. Seu nome é ${userName}, certo? Eu sou o Babuíno e preciso de sua ajuda. A Savana está sendo corrompida pela “Ignorância” e o único jeito de combatê-la é aumentando a nossa “Sabedoria”.`,
                'Faço parte do grupo “Pioneiros” e junto com outros somos responsáveis por treinar viajantes com grande potencial assim como você! Se desejar embarcar nessa aventura e nos ajudar a livrar a Savana da “Ignorância”, vá em frente e acesse uma das trilhas para conhecer os treinadores',
                'Só tome cuidado com o covil da Mamba Negra, ela será seu desafio final nessa jornada. Antes de você ir, gostaria de te dar algumas joias para te ajudar nesse começo. Tenha uma boa viagem!',
            ]
        }
    ]

    return script;
}



export default mainPageScript;
