import couple from "../../../assets/sprites/lion/couple.png";
import lion from "../../../assets/sprites/lion/lion.png";
import lioness from "../../../assets/sprites/lion/lioness.png";

import api from '../../../services/api';

const checkScript = async (index: number) => {
    try {
        const _userId = sessionStorage.getItem('@pionira/userId');
        const { data } = await api.get("/finallionquiz");

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

const trail2FinalQuiz = async () => {
	const script = await (checkScript(0) || checkScript(1) || checkScript(2)) ? [
		{
			name: 'Leão e Leoa',
			image: couple,
			texts: [
				'Olá novamente, aprendiz…',
				'Então você acha que está preparado para o nosso desafio final?',
				'Espero que você tenha se preparado bem desde a última vez...',
				'Agora precisamos mais do que nunca da sua agilidade.',
				'Aqui você irá ser testado ao seu máximo, filhote… Por isso, não poupe esforços em usar tudo o que aprendeu ao longo de sua jornada!',
				'Boa sorte dessa vez!',
			],
		},
        {
			name: 'Leão',
			image: lion,
			texts: [
				'Então você acha que está preparado para o nosso desafio final?',
				'Esperamos que você tenha se preparado bem desde a última vez...',
			],
		},
        {
			name: 'Leoa',
			image: lioness,
			texts: [
				'Agora precisamos mais do que nunca da sua habilidade de liderança.',
				'Aqui você irá ser testado ao seu máximo, aprendiz... Por isso, não poupe esforços em usar tudo o que aprendeu ao longo de sua jornada!',
				'Boa sorte dessa vez!',
			],
		},
        {
			name: 'Leão e Leoa',
			image: couple,
			texts: [
				'Boa sorte dessa vez!'
			],
		},
	] : [
		{
			name: 'Leão e Leoa',
			image: couple,
			texts: [
				'Olha só…'	
			],
		},
        {
			name: 'Leão',
			image: lion,
			texts: [
				'Então você acha que está apto para encarar o nosso desafio final, aprendiz?',
				'Espero que você tenha se preparado bem desde a primeira vez que nos encontramos...',
			],
		},
        {
			name: 'Leoa',
			image: lioness,
			texts: [
				'E… bem...',
				'Agora precisamos mais do que nunca da sua habilidade de liderança.',
				'Aqui você irá ser testado ao seu máximo, aprendiz... Por isso, não poupe esforços em usar tudo o que aprendeu ao longo de sua jornada!'
			],
		},
        {
			name: 'Leão e Leoa',
			image: couple,
			texts: [
				'Boa sorte!'
			],
		},
	];

	return script;
};

export default trail2FinalQuiz;
