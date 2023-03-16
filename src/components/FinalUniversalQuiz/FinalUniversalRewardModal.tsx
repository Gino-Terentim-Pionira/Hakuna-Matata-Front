import React, { FC, useState } from 'react';
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalOverlay,
	ModalBody,
	Box,
	Flex,
	Button,
	Text,
	Image,
	useDisclosure,
} from '@chakra-ui/react';
import api from '../../services/api';
import { AxiosResponse } from 'axios';
import fontTheme from '../../styles/base';
import colorPalette from '../../styles/colorPalette';
import RewardModal from '../modals/RewardModal';

// Images
import Cheetah from '../../assets/icons/cheetahblink.svg';
import Cross from '../../assets/icons/cross.svg';

interface IFinalUniversalRewardModal {
	isOpen: boolean;
	coins: number;
	score: number[];
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
	quiz_coins: number[];
	ignorance: number;
}

const FinalUniversalRewardModal: FC<IFinalUniversalRewardModal> = ({
	isOpen,
	coins,
	score,
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

	const {
		isOpen: modalIsOpenCheetah,
		onClose: modalOnCloseCheetah,
		onOpen: modalOnOpenCheetah,
	} = useDisclosure();

	const [onError, setOnError] = useState(false);

	const coinsRecieved = coins;

	const statusPointsRecieved = [
		{
			name: 'AGI',
			points: score[0],
		},
		{
			name: 'LID',
			points: score[1],
		},
		{
			name: 'EST',
			points: score[2],
		},
		{
			name: 'INO',
			points: score[3],
		},
		{
			name: 'GM',
			points: score[4],
		},
		{
			name: 'GP',
			points: score[5],
		},
	];

	const incrementAtStatusIndex = (res: AxiosResponse<userDataProps>) => {
		for (let i = 0; i < 6; i++) {
			res.data.status[i] =
				res.data.status[i] + statusPointsRecieved[i].points;
		}
		return res.data.status;
	};

	const updateUserQuizTime = async () => {
		try {
			const userId = sessionStorage.getItem('@pionira/userId');
			await api.patch(`user/loadingQuiz/${userId}`, {
				quiz_loading: Date.now() - 10800000,
			});
		} catch (error) {
			setOnError(true);
		}
	};

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

			const userValidade = (await api.get(`/user/${userId}`)).data;

			if (correctAnswers === totalAnswers) {
				modalOnOpenCheetah();
				if (trail === 1) {
					await api.patch(`/user/${routeQuiz}/${userId}`, {
						finalQuizComplete: {
							...userValidade.finalQuizComplete,
							cheetahFinal: true,
						},
					});
				} else if (trail === 2) {
					await api.patch(`/user/${routeQuiz}/${userId}`, {
						finalQuizComplete: {
							...userValidade.finalQuizComplete,
							lionFinal: true,
						},
					});
				}

			} else {
				window.location.reload();
			}
			await updateUserQuizTime();
		} catch (error) {
			setOnError(true);
		}
	};

	const updateBadge = async () => {
		try {
			const userId = sessionStorage.getItem('@pionira/userId');
			setIsLoading(true);
			const badges = await api.get('/insignias/');

			const userBadges = badges.data[trail - 1].user_id;
			const badgeId = badges.data[trail - 1]._id;

			if (!userBadges.includes(userId)) {
				userBadges.push(userId);
				await api.patch(`/insignias/${badgeId}`, {
					user_id: userBadges,
				});
			}
			modalOnCloseCheetah();
			setIsLoading(false);
			window.location.reload();
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
			await api.patch<userDataProps>(`/user/status/${_userId}`, {
				status: incrementAtStatusIndex(res),
			});

			await api.patch<userDataProps>(`/user/ignorance/${_userId}`, {
				ignorance: (res.data.ignorance - ignorance > 0) ? res.data.ignorance - ignorance : 0,
			});

			validateUser();
		} catch (error) {
			setOnError(true);
		}
	};

	const rewardModalInfo = () => {
		if (correctAnswers === totalAnswers)
			return {
				title: 'Você é demais!',
				titleColor: colorPalette.inactiveButton,
				subtitle: `Você acertou ${correctAnswers} de ${totalAnswers} questões!`,
				icon: Cheetah,
				coins,
				status: score
			}
		return {
			title: 'Que pena!',
			titleColor: colorPalette.closeButton,
			subtitle: correctAnswers === 0 ? `Você não acertou nenhuma questão! Mas não desista, você poderá vencer a ignorância!` :
				`Você acertou apenas ${correctAnswers} de ${totalAnswers} questões! Mas não desista, você poderá vencer a ignorância!`,
			icon: Cross,
			coins,
			status: score
		}
	}

	return (
		<>
			<RewardModal
				isOpen={isOpen}
				rewardModalInfo={rewardModalInfo()}
				loading={isLoading}
				error={onError}
				confirmFunction={updateUserCoins}
			/>

			{/* Modal de Reward */}
			<Modal
				isOpen={modalIsOpenCheetah}
				onClose={modalOnCloseCheetah}
				size='4xl'
			>
				<ModalOverlay />
				<ModalContent
					height='40rem'
					fontFamily={fontTheme.fonts}
					mt='1rem'
					mb='0.6rem'
				>
					<Box
						w='25%'
						bg={colorPalette.primaryColor}
						h='25rem'
						position='absolute'
						zIndex='-1'
						left='0'
						top='0'
						borderTopStartRadius='5px'
						clipPath='polygon(0% 0%, 55% 0%, 0% 100%)'
					/>

					<ModalHeader d='flex' justifyContent='center' mt='1.4rem'>
						<Text
							ml='2.3rem'
							w='75%'
							fontSize='4.37rem'
							textAlign='center'
							fontWeight='600'
							fontStyle='normal'
							color={colorPalette.secondaryColor}
						>
							Parabens!
						</Text>
						<ModalCloseButton
							color={colorPalette.closeButton}
							size='lg'
						/>
					</ModalHeader>

					<ModalBody
						display='flex'
						mt='-1rem'
						flexDirection='column'
						h='30rem'
						alignItems='center'
						justifyContent='space-between'
					>
						<Text
							color={colorPalette.secondaryColor}
							fontWeight='600'
							fontSize='1.68rem'
							textAlign='center'
							width='75%'
						>
							{`“Você provou por completo o seu valor aqui, jovem!
							Você é merecedor da Marca ${insignaName}”!`}
						</Text>
						<Image src={imgReward} h='50%' />
						<Text
							color={colorPalette.secondaryColor}
							fontWeight='600'
							textDecoration='underline'
							fontSize='1.87rem'
						>
							{`Marca ${insignaName}`}
						</Text>
						<Flex
							w='65%'
							justifyContent='center'
							marginBottom='0.8rem'
						>
							<Button
								alignSelf='center'
								bgColor={colorPalette.confirmButton}
								width='45%'
								height='4rem'
								fontSize='1.2rem'
								_hover={{
									transform: 'scale(1.1)',
								}}
								onClick={updateBadge}
							>
								Vamos nessa!
							</Button>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default FinalUniversalRewardModal;
