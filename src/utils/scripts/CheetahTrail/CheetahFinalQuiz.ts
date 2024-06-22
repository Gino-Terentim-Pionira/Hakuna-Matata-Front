import cheetah from '../../../assets/sprites/cheetah/cheetah.webp';
import { IUser } from '../../../recoil/useRecoilState';
import { getStatusPoints, hasEnougthStatusForFinalQuiz } from '../../statusUtils';
import { AGILITY } from '../../constants/statusConstants';
import { STATUS_POINTS_TO_UNLOCK_FINAL_QUIZ } from '../../constants/constants';

const cheetahFinalQuiz = async (userData: IUser) => {

	const notEnoughStatus = [

		{
			name: 'Cheetah',
			image: cheetah,
			texts: [
				`Viajante, você está prestes a alcançar o auge desta jornada! Apenas ${STATUS_POINTS_TO_UNLOCK_FINAL_QUIZ - getStatusPoints(userData, AGILITY)}% de Agilidade te separam do desafio final da nossa trilha e das recompensas que te esperam lá.`,
				'Sua agilidade e capacidade de adaptação te trouxeram até aqui, agora mantenha o foco e vamos lá!'
			],
		},
		{
			name: 'Cheetah',
			image: cheetah,
			texts: [
				`Você está quase lá. ${STATUS_POINTS_TO_UNLOCK_FINAL_QUIZ - getStatusPoints(userData, AGILITY)}% de Agilidade restantes para poder realizar o desafio final da nossa trilha!`,
				'Este é o momento decisivo. Concentre-se e avance com toda sua força.',
				'Mostre que pode superar a "Ignorância" e conquistar sua recompensa.'
			],
		}
	];

	const enoughStatus = [
		{
			name: 'Cheetah',
			image: cheetah,
			texts: [
				'Agora é a hora de mostrar tudo o que aprendeu.',
				'A "Ignorância" está prestes a ser deixada para trás de vez.',
				'Concentre-se e dê o seu melhor. Este é o momento de provar que você dominou a agilidade, como um Cheetah!',
				'O desafio final está desbloqueado!'
			]
		}
	];

	const IS_USER_HAS_ENOUGH_STATUS = {
		"notEnoughStatus": [notEnoughStatus[Math.floor(Math.random() * notEnoughStatus.length)]],
		"enoughStatus": enoughStatus
	}

	return IS_USER_HAS_ENOUGH_STATUS[hasEnougthStatusForFinalQuiz(userData, AGILITY)];
};

export default cheetahFinalQuiz;
