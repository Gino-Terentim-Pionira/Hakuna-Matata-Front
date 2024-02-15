import monkey from "../../../assets/sprites/monkey/monkey.webp";


const mainPageScript = (userName: string) => {

    const script = [
        {
            name: "Babuíno",
            image: monkey,
            texts: [
                `Ah, que alegria ver um novo rosto sob o vasto céu da Savana. Seu nome é ${userName}, verdade? Bem-vindo! Eu sou o Babuíno, um guardião deste lugar, tão antigo quanto as estrelas que nos guiam e tão curioso quanto os ventos que nos trazem novas histórias.`,
                "A Savana, veja bem, está envolta numa névoa de 'Ignorância', um desafio que somente corações valentes e mentes brilhantes podem enfrentar. E aqui está você, pronto para trilhar o caminho da 'Sabedoria'.",
                "Esta será uma viagem de descoberta e conexão, onde cada passo é uma história, cada desafio uma lição. Estou aqui, como estive para muitos antes de você, para orientar e inspirar.",
                "Nosso caminho é feito de união e partilha, onde a generosidade do conhecimento ilumina as sombras da ignorância. Escolha sua trilha, jovem viajante. É uma oportunidade para crescer, para brilhar, para se superar.",
                "Os guardiões da Savana, cada um com sua própria sabedoria, esperam por você. E, sim, a Mamba Negra... um desafio que testará tudo o que você aprendeu. Mas lembre-se, a maior das jornadas começa com um simples passo.",
                "E para esse primeiro passo, algumas joias de sabedoria, um pequeno presente meu para você. Vamos lá, o vento já nos chama. Que sua jornada seja rica, plena de aprendizados e repleta de conexões.",
                "Este é o seu momento, sua chance de fazer a diferença, de ser mais um brilhante 'Pioneiro' na imensidão desta Savana."
            ]
        }
    ]

    return script;
}



export default mainPageScript;
