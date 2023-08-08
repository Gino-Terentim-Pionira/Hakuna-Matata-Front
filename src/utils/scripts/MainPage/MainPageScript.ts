import monkey from "../../../assets/sprites/monkey/monkey.png";


const mainPageScript = (userName: string) => {

    const script = [
        {
            name: "Babuíno",
            image: monkey,
            texts: [
                `Olá, jovem viajante. Seu nome é ${userName}, certo? Eu sou o Babuíno e preciso de sua ajuda. A Savana está sendo corrompida pela “Ignorância” e o único jeito de combatê-la é aumentando a nossa “Sabedoria”.`,
                'Faço parte do grupo “Pioneiros” e sou responsável por treinar viajantes com grande potencial, assim como você! Junte-se a nós nesta aventura e nos ajude a livrar a Savana da “Ignorância”! Vá em frente e acesse as trilhas para conhecer os demais treinadores.',
                'Só tome cuidado com o covil da Mamba Negra! Ela será seu desafio final nesta jornada. Antes de você ir, quero dar-lhe algumas joias, para ajudar neste começo. Tenha uma boa viagem.',
            ]
        }
    ]

    return script;
}



export default mainPageScript;
