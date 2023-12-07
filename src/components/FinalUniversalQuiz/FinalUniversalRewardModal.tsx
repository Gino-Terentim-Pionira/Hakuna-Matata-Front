import React, { FC, useState } from 'react';
import api from '../../services/api';
import colorPalette from '../../styles/colorPalette';
import RewardModal from '../modals/GenericModal';

// Images
import Cross from '../../assets/icons/cross.svg';
import { getLogInUrl, setItems } from '../../services/linkedin';
import { convertImageToBase64 } from '../../utils/stringUtils';
import badgeShare from '../../assets/socialShare/badge.png';
import TypesEnum from '../../utils/enums/type';
import PlataformsEnum from '../../utils/enums/plataform';
import { SHARE } from '../../utils/constants/buttonConstants';

interface IFinalUniversalRewardModal {
	isOpen: boolean;
	coins: number;
	correctAnswers: number;
	totalAnswers: number;
	allQuestionsId?: string[];
	validateUser: VoidFunction;
	imgReward: string;
	routeQuiz: string;
	routeQuestions: string;
	insignaName: string;
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
	imgReward,
	routeQuiz,
	routeQuestions,
	insignaName,
	ignorance,
	trail,
}) => {
	const [isLoading, setIsLoading] = useState(false);

	const [onError, setOnError] = useState(false);

	const coinsRecieved = coins;

	const handleLinkedin = async (shareId: string) => {
        try {
            const response = await getLogInUrl();
            const imgbase64 = await convertImageToBase64(badgeShare);
            const text = `Ganhei a insígnia Marca ${insignaName}`;
            const description = `Insígnia Marca ${insignaName}`;
            setItems(
                text,
                description,
                imgbase64 as string,
                TypesEnum.badge,
                shareId as string,
                PlataformsEnum.linkedin);
            window.location.replace(response.data.url);
        } catch (error) {
            console.log(error);
        }
    }

	const updateUserCoins = async (share: boolean) => {
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

			const userValidade = (await api.get(`/user/${userId}`)).data;

			const badges = await api.get('/insignias/');

			const userBadges = badges.data[trail - 1].user_id;
			const badgeId = badges.data[trail - 1]._id;

			if (correctAnswers === totalAnswers) {
				await updateBadge(userBadges, badgeId, userId as string);
				if (trail === 1) {
					await api.patch(`/user/${routeQuiz}/${userId}`, {
						finalQuizComplete: {
							...userValidade.finalQuizComplete,
							cheetahFinal: true,
						},
					});
					
					await api.patch(`/user/narrative/${userId}`, {
                        narrative_status: {
                            ...userValidade.narrative_status,
                            trail1: 3
                        },
                    });
				} else if (trail === 2) {
					await api.patch(`/user/${routeQuiz}/${userId}`, {
						finalQuizComplete: {
							...userValidade.finalQuizComplete,
							lionFinal: true,
						},
					});

					await api.patch(`/user/narrative/${userId}`, {
                        narrative_status: {
                            ...userValidade.narrative_status,
                            trail2: 3
                        },
                    });
				}
			} 
			if (share) {
				await handleLinkedin(badgeId);
			} else {
				window.location.reload();
			}
		} catch (error) {
			setOnError(true);
		}
	};

	const updateBadge = async (userBadges: string[], badgeId: string, userId: string) => {
		try {
			if (!userBadges.includes(userId)) {
				userBadges.push(userId);
				await api.patch(`/user/addinsignia/${userId}`, {
					insignias_id: badgeId,
				});
			}
			
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
				subtitle: `Você provou por completo o seu valo e por isso lhe concedo a Marca ${insignaName}!`,
				icon: imgReward,
				coins,
				isSocial: true,
				secondButton: SHARE
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
			confirmFunction={async () => {
				await updateUserCoins(false)
			}}
			secondFunction={async () => {
				await updateUserCoins(true)
			}}
		/>
	);
};

export default FinalUniversalRewardModal;
