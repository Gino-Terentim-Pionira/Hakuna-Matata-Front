import lion_happy from "../../../assets/sprites/lion/happy_lion.png";
import lion from "../../../assets/sprites/lion/lion.png";
import lioness_happy from "../../../assets/sprites/lion/happy_lioness.png";

import api from '../../../services/api';

const getUser = async () => {
    const _userId = sessionStorage.getItem('@pionira/userId');
    const res = await api.get(`/user/${_userId}`);

    return res.data.userName;

}


const trail2Conclusion = async () => {

    const userName = await getUser();
    const script = [
        {
            name: "Leoa",
            image: lioness_happy,
            texts: [`Parabéns, ${userName}. Você conseguiu!`]
        },
        {
            name: "Leão",
            image: lion_happy,
            texts: ["Você nos superou e nos orgulhou com a sua evolução!"]
        },
        {
            name: "Leoa",
            image: lioness_happy,
            texts: ["Você nos mostrou que consegue ser um líder! Mostrou ter o orgulho e a força necessária para liderar o combate à Ignorância!"]
        },
        {
            name: "Leão",
            image: lion,
            texts: ["Mas mantenha em mente que a batalha ainda não acabou e ainda pode haver derrotas. Mas nunca abaixe a cabeça, continue sempre em frente!"]
        },
        {
            name: "Leoa",
            image: lioness_happy,
            texts: ["Aqui está a insígnia da “Liderança”, sempre que olhar para ela lembre-se de tudo que passou e todos os obstáculos superados. Assim a Ignorância não terá nenhuma chance!"]
        }
    ];

    return script;
}

export default trail2Conclusion;
