import cheetah from '../../../assets/sprites/cheetah/cheetah.webp';
import api from '../../../services/api';

const checkScript = async (index: number) => {
    try {
        const _userId = sessionStorage.getItem('@pionira/userId');
        const { data } = await api.get("/finalcheetahquiz");

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

const cheetahFinalQuiz = async () => {
	const script = await (checkScript(0) || checkScript(1) || checkScript(2)) ? [
		{
			name: 'Cheetah',
			image: cheetah,
			texts: [
				'Olá novamente…',
				'Então você acha que está preparado para o nosso desafio final?',
				'Espero que você tenha se preparado bem desde a última vez... Agora precisamos mais do que nunca da sua agilidade',
				'Aqui você irá ser testado ao seu máximo. Por isso, não poupe esforços em usar tudo o que aprendeu ao longo de sua jornada!',
				'Boa sorte dessa vez!',
			],
		},
	] : [
		{
			name: 'Cheetah',
			image: cheetah,
			texts: [
				'Olha só… Então você acha que está apto para encarar o nosso desafio final?',
				'Espero que você tenha se preparado bem desde os seus primeiros passos...',
				'Ainda temos chão pela frente! E… bem... Agora precisamos mais do que nunca da sua agilidade',
				'Aqui você irá ser testado ao seu máximo. Por isso, não poupe esforços em usar tudo o que aprendeu ao longo de sua jornada!',
				'Boa sorte!',
			],
		},
	];

	return script;
};

export default cheetahFinalQuiz;
