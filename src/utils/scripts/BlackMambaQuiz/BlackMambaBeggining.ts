import babuino from "../../../assets/sprites/monkey/monkey.png";
import blackMamba from "../../../assets/sprites/blackMamba/mamba_negra.png";

const blackMambaBeggining = async () => {

    const script = [
        {
            name: "Babuíno",
            image: babuino,
            texts: ["Espere jovem, esse lugar me parece familiar… Uma floresta volumosa… com folhas escuras… esse ar intimidador…",
                "É isso mesmo jovem, era o que eu temia… você encontrou o covil da Mamba Negra! Ela dominou todas as habilidades possíveis para conseguir impedir a ignorância…",
            ]
        },
        {
            name: "Mamba Negra",
            image: blackMamba,
            texts: ["Mas mesmo assim, sozinha eu falhei. Por isso sou a responsável por desafiar diversos viajantes para ver se possuem o necessário para me ajudar nessa batalha. Tenha em mente que não pegarei leve com você! Então se sentir que não está preparado, siga as outras trilhas até ter “Sabedoria” o suficiente."]
        }
    ];

    return script;
}

export default blackMambaBeggining;

