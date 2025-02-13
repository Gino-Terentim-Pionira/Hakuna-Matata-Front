import happy_lioness from "../../../assets/sprites/lion/happy_lioness.png";
import happy_couple from "../../../assets/sprites/lion/happy_couple.png";
import lion from "../../../assets/sprites/lion/lion.png";
import lioness from "../../../assets/sprites/lion/lioness.png";

const LionBeggining = async () => {

    const script = [
        {
            name: "Leão",
            image: lion,
            texts: ["Prazer, eu sou o Leão",
            ]
        },
        {
            name: "Leoa",
            image: lioness,
            texts: ["E eu sou a leoa"]
        },
        {
            name: "Leão e Leoa",
            image: happy_couple,
            texts: ["E nós somos os responsáveis pelo treinamento de liderança"]
        },
        {
            name: "Leão",
            image: lion,
            texts: ["Para combater a Ignorância, é super importante conseguir inspirar os outros a nos ajudar na nossa luta, liberando-os da corrupção da alienação. Fico me perguntando se um Aprendiz que nem você conseguirá chegar nesse nível",
                "Nós somos os responsáveis pela área da Liderança e temos como objetivo tornar um Aprendiz como você em um verdadeiro líder! Ao longo do seu treinamento, você receberá pontos de habilidades em cada uma dessas áreas e poderá checá-los no seu passaporte. Para provar o seu valor, terá que passar pelo nosso desafio"]
        },
        {
            name: "Leoa",
            image: lioness,
            texts: ["Você poderá enfrentar o nosso desafio a qualquer momento, mas já vou avisando, se não tiver passado pelo nosso treinamento, você acabará perdendo!",
                "Então recomendo que você faça todos os exercícios para aprender a liderar e não se preocupe em falhar. Ao longo do caminho, você poderá se deparar com várias decepções, a Ignorância pode avançar nesses momentos, mas o importante é sempre manter a cabeça erguida! Nunca desistir"]
        },
        {
            name: "Leão",
            image: lion,
            texts: ["Sempre que você cair, a Ignorância irá avançar, mas sempre que você levantar mais forte do que antes, ela irá regredir ainda mais!"]
        },
        {
            name: "Leoa",
            image: happy_lioness,
            texts: ["Agora, vá nos orgulhar"]
        }
    ];

    return script;
}

export default LionBeggining;
