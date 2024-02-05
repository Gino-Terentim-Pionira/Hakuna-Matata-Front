import React, { FC, useState, useEffect } from 'react';
import api from '../../services/api';
import colorPalette from '../../styles/colorPalette';
import RewardModal from '../modals/GenericModal';

// Images
import Cross from '../../assets/icons/cross.svg';
import { getLogInUrl, setItems } from '../../services/linkedin';
import { convertImageToBase64 } from '../../utils/stringUtils';
import badgeShare from '../../assets/socialShare/badge.webp';
import TypesEnum from '../../utils/enums/type';
import PlataformsEnum from '../../utils/enums/plataform';
import { SHARE } from '../../utils/constants/buttonConstants';
import RelicsName from '../../utils/enums/relicsName';
import { addRelic } from '../../services/relic';
import useRelic from '../../hooks/useRelic';
import { IUser } from '../../recoil/useRecoilState';

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
	relic: RelicsName
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
	trail,
	relic
}) => {
	const { relicData, getRelics } = useRelic();
	const [isLoading, setIsLoading] = useState(false);

	const [onError, setOnError] = useState(false);

	const coinsRecieved = coins;

	const handleLinkedin = async (shareId: string) => {
        try {
            const response = await getLogInUrl();
            const imgbase64 = await convertImageToBase64(badgeShare);
            const text = `Ganhei a relíquia ${relic}`;
            const description = `Relíquia ${relic}`;
            setItems(
                text,
                description,
                imgbase64 as string,
                TypesEnum.RELIC,
                shareId as string,
                PlataformsEnum.LINKEDIN);
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

			const userValidate = (await api.get(`/user/${userId}`)).data;

			if (correctAnswers === totalAnswers) {
				await updateRelic(userValidate.user_relics, relic, userId as string);
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
			if (share) {
				await handleLinkedin(relic);
			} else {
				window.location.reload();
			}
		} catch (error) {
			setOnError(true);
		}
	};

	const updateRelic = async (
		ownedRelics: IUser['user_relics'],
		relicName: RelicsName, 
		userId: string
	) => {
		try {
			await addRelic(ownedRelics, relicName, userId);
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

	const verifyRelics = async () => {
		const _userId = sessionStorage.getItem('@pionira/userId');
		if (!relicData.relics || !relicData.user_relics) {
			await getRelics(_userId as string);
		}
	}

	const rewardModalInfo = () => {
		if (correctAnswers === totalAnswers)
			return {
				title: 'Parabéns!!',
				titleColor: colorPalette.inactiveButton,
				subtitle: `Você provou por completo o seu valo e por isso lhe concedo: ${relic}!`,
				icon: relicData?.relics?.find(item => item.relic_name == relic)?.image as string,
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

	useEffect(() => {
        verifyRelics();
    }, []);

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
