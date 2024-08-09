import React, { FC, useState } from 'react';
import api from '../../services/api';
import colorPalette from '../../styles/colorPalette';
import RewardModal from '../modals/GenericModal';

// Images
import Cross from '../../assets/icons/cross.svg';
import Cheetah from '../../assets/icons/cheetahblink.svg';

interface IFinalUniversalRewardModal {
	isOpen: boolean;
	coins: number;
	correctAnswers: number;
	totalAnswers: number;
	allQuestionsId?: string[];
	validateUser: VoidFunction;
	routeQuiz: string;
	routeQuestions: string;
	ignorance: number;
	trail: number;
}

interface userDataProps {
	coins: number;
	status: number[];
	ignorance: number;
}

const FinalUniversalRewardModal: FC<IFinalUniversalRewardModal> = ({
	isOpen,
	coins,
	correctAnswers,
	totalAnswers,
	allQuestionsId,
	validateUser,
	routeQuiz,
	routeQuestions,
	ignorance,
	trail
}) => {
	const [isLoading, setIsLoading] = useState(false);

	const [onError, setOnError] = useState(false);

	const coinsRecieved = coins;

	const updateUserCoins = async () => {
		try {
			const userId = sessionStorage.getItem('@pionira/userId');
			setIsLoading(true);
			await addCoinsStatus(coinsRecieved);
			if (allQuestionsId) {
				const length = allQuestionsId.length;
				for (let i = 0; i < length; i++) {
					await api.patch(`/${routeQuestions}/${allQuestionsId[i]}`, {
						user_id: userId,
					});
				}
			};

			const userValidate = (await api.get(`/user/${userId}`)).data;

			if (correctAnswers === totalAnswers) {
				if (trail === 1) {
					await api.patch(`/user/${routeQuiz}/${userId}`, {
						finalQuizComplete: {
							...userValidate.finalQuizComplete,
							cheetahFinal: true,
						},
					});
					
					await api.patch(`/user/narrative/${userId}`, {
                        narrative_status: {
                            ...userValidate.narrative_status,
                            trail1: 3
                        },
                    });
				} else if (trail === 2) {
					await api.patch(`/user/${routeQuiz}/${userId}`, {
						finalQuizComplete: {
							...userValidate.finalQuizComplete,
							lionFinal: true,
						},
					});

					await api.patch(`/user/narrative/${userId}`, {
                        narrative_status: {
                            ...userValidate.narrative_status,
                            trail2: 3
                        },
                    });
				}
			} 
			setIsLoading(false);
		} catch (error) {
			setOnError(true);
		}
	};


	const addCoinsStatus = async (value: number) => {
		try {
			const _userId = sessionStorage.getItem('@pionira/userId');
			const res = await api.get<userDataProps>(`/user/${_userId}`);

			await api.patch<userDataProps>(`/user/coins/${_userId}`, {
				coins: res.data.coins + value,
			});

			await api.patch<userDataProps>(`/user/ignorance/${_userId}`, {
				ignorance: res.data.ignorance - ignorance,
			});

			validateUser();
		} catch (error) {
			setOnError(true);
		}
	};

	const rewardModalInfo = () => {
		if (correctAnswers === totalAnswers)
			return {
				title: 'Parabéns!!',
				titleColor: colorPalette.inactiveButton,
				subtitle: `Você provou por completo o seu valor!`,
				icon: Cheetah,
				coins
			}
		return {
			title: 'Que pena!',
			titleColor: colorPalette.closeButton,
			subtitle: correctAnswers === 0 ? `Você não acertou nenhuma questão! Mas não desista, você poderá vencer a ignorância!` :
				`Você acertou apenas ${correctAnswers} de ${totalAnswers} questões! Mas não desista, você poderá vencer a ignorância!`,
			icon: Cross,
			coins,
		}
	}

	return (
		<RewardModal
			isOpen={isOpen}
			genericModalInfo={rewardModalInfo()}
			loading={isLoading}
			error={onError}
			confirmFunction={() => {
				window.location.reload();
			}}
			initFunction={updateUserCoins}
		/>
	);
};

export default FinalUniversalRewardModal;
