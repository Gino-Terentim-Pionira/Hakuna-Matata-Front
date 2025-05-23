import blackMamba from "../../../assets/sprites/blackMamba/mamba_negra.png";
import mamba_negra_happy from "../../../assets/sprites/blackMamba/mamba_negra_happy.png";
import { IUser } from "../../../recoil/useRecoilState";

import api from '../../../services/api';

const checkScript = async (index: number) => {
    try {
        const _userId = sessionStorage.getItem('@pionira/userId');
        const { data } = await api.get("/finalQuiz");
        if (data[index].user_id.includes(_userId)) {
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

const blackMambaScript = async (user: IUser) => {

    const wisdom = 100 - user.ignorance;

    const script = user.finalQuizComplete.blackMamba ? [
        {
            name: "Mamba Negra",
            image: mamba_negra_happy,
            texts: [
                `Ora ora, ${user.userName}!`,
                "O que você está fazendo aqui? Você já conseguiu nos ajudar com a ignorância!",
                "Obrigado pela preocupação, mas por enquanto não precisamos de você! Pode seguir sua jornada!"
            ]
        }]
    :
    user.ignorance > 80 ? [await checkScript(2) ?
        {
            name: "Mamba Negra",
            image: blackMamba,
            texts: [
                "Ora ora, vejo que tem muita coragem mesmo!",
                "Ainda acredita que pode me derrotar mesmo depois da última vez?",
                "HA HA HA! Prepare-se!"
            ]
        } : {
            name: "Mamba Negra",
            image: blackMamba,
            texts: [
                "Ora ora, não esperava ser incomodado tão cedo, viajante!",
                "Vejo que acredita ter o conhecimento necessário para me desafiar.",
                "... sniff sniff",
                `Posso sentir que você possui um nível de "Sabedoria" em ${wisdom}%, que precoce...`,
                "Acho que devo te dar uma lição! Talvez assim você venha mais preparado da proxima vez!",
                "Prepare-se!"
            ]
        }

    ] : user.ignorance > 15 ? [await checkScript(1) ?
        {
            name: "Mamba Negra",
            image: mamba_negra_happy,
            texts: [
                "Ora ora, vejo que tem muita coragem mesmo!",
                "Ainda acredita que pode me derrotar mesmo depois da última vez?",
                "HA HA HA! Prepare-se!"
            ]
        } : {
            name: "Mamba Negra",
            image: blackMamba,
            texts: [
                `Ora ora, ${user.userName}!`,
                "Vejo que seguiu um pouco de sua jornada, entretanto ainda não é o suficiente.",
                "... sniff sniff",
                `Posso sentir que você possui um nível de "Sabedoria" em ${wisdom}%, não é baixo, mas não é o ideal...`,
                "Entretanto, vejo no seu olhar que deseja me desafiar... Meio displicente, talvez devo te ensinar uma lição...",
                "Prepare-se!"
            ]
        }
    ] : [await checkScript(0) ?
        {
            name: "Mamba Negra",
            image: mamba_negra_happy,
            texts: [
                "Ora ora, vejo que tem muita coragem mesmo!",
                "Ainda acredita que pode me derrotar mesmo depois da última vez?",
                "HA HA HA! Prepare-se!"
            ]
        } : {
            name: "Mamba Negra",
            image: blackMamba,
            texts: [
                `Ora Ora, seja bem-vindo, ${user.userName}!`,
                "Meus companheiros me informaram que você teve bastante êxito e suas jornadas.",
                "... sniff sniff",
                `Uau, posso sentir que você possui um nível de "Sabedoria" em ${wisdom}%, isso é fascinante...`,
                "Vejo que possui a determinação e o conhecimento necessário para me desafiar!",
                "Mas já vou lhe avisando que não sera nada fácil... Afinal, não é a toa que eu sou a rainha dessa Savana!",
                "Prepare-se!"
            ]
        }
    ];
	
    return script;
}



export default blackMambaScript;
