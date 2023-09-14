import monkey from "../../../assets/sprites/monkey/monkey.png";

const chatScript = (ignorance: number) => {
    const script = [
        {
            name: "Babuíno",
            image: monkey,
            texts: [`Atualmente o seu nível de sabedoria é ${100 - ignorance}%`, `Isso significa que o nível de ignorância está em ${ignorance}%, mantenha-se forte na sua jornada!`]
        }
    ]
    return script;
}

export default chatScript;
