import monkey from "../../../assets/sprites/monkey/monkey.webp";

const lockedPathScript = async () => {
    const script = [
        {
            name: "Babuíno",
            image: monkey,
            texts: ["Ei, jovem!",
            "Imagino que não seja uma boa ideia seguir por essa trilha agora.",
            "O nível de ignorância que atingiu essa área é alto demais para você!",
            "Melhor aprimorar suas habilidades nas outras trilhas antes de seguirmos por aqui.",
            "Em breve poderemos entrar aqui."]
        }
    ]
    return script;
}

export default lockedPathScript;
