import cheetah_happy from "../../../assets/sprites/cheetah/cheetah_happy.png";

import api from '../../../services/api';

const getUser = async () => {
    const _userId = sessionStorage.getItem('@pionira/userId');
    const res = await api.get(`/user/${_userId}`);

    return res.data.userName;

}


const trail1Conclusion = async () => {

    const userName = await getUser();
    const script = [
        {
            name: "Cheetah",
            image: cheetah_happy,
            texts: [`Meus parabéns por ter me superado filh... AH! Acho que agora terei que parar de te chamar de “filhote” já que conseguiu me ultrapassar, né ${userName}?`, 
            "Depois desse árduo desafio você finalmente fez por merecer a minha marca: A insígnia da Agilidade",
            "Sempre que olhar para ela lembre-se que você se superou e está cada vez mais próximo de acabar com a “Ignorância” de uma vez por todas e salvar toda a Savana!",
            "Além de ter ganhado o meu respeito e ter se provado capaz de ultrapassar a “Ignorância”, você ganhou a minha admiração! Ver você batalhando todo dia para atingir o seu melhor me deu ainda mais forças para continuar na batalha",
            "E aposto que motivou os outros “Pioneiros” também! Continue assim que a “Ignorância” vai comer poeira!"
        ]
        }
    ];

    return script;
}

export default trail1Conclusion;
