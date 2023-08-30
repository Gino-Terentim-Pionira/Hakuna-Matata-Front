import React, { FC, useState } from 'react';
import {
	Modal,
	ModalContent,
	ModalOverlay,
	ModalBody,
	Box,
	Flex,
	Button,
	Text,
	Image,
	useDisclosure,
	ModalHeader
} from '@chakra-ui/react';

// Components
import Certificate from '../modals/CertificateModal';
import RewardModal from '../modals/GenericModal';

// Requisitions
import api from '../../services/api';
import { AxiosResponse } from 'axios';

// Styles
import fontTheme from '../../styles/base';
import colorPalette from '../../styles/colorPalette';

// Images
import imgReward from '../../assets/icons/insignia/mambaTrailInsignia.png'
import Cheetah from '../../assets/icons/cheetahblink.svg';
import Cross from '../../assets/icons/cross.svg';

interface IFinalRewardModal {
	isOpen: boolean;
	coins: number;
	score: number[];
	correctAnswers: number;
	totalAnswers: number;
	allQuestionsId?: string[];
	validateUser: VoidFunction;
	trail: number;
	certificateName: string;
}

interface userDataProps {
	coins: number;
	status: number[];
	ignorance: number;
}

const FinalRewardModal: FC<IFinalRewardModal> = ({
	isOpen,
	coins,
	score,
	correctAnswers,
	totalAnswers,
	allQuestionsId,
	validateUser,
	trail,
	certificateName
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [onError, setOnError] = useState(false);

	const {
		isOpen: finalModalIsOpen,
		onClose: finalModalOnClose,
		onOpen: finalModalOnOpen,
	} = useDisclosure();

	const { isOpen: certificateIsOpen,
		onOpen: certificateOnOpen,
		onClose: certificateOnClose
	} = useDisclosure();

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
					await api.patch(`/finalQuestion/${allQuestionsId[i]}`, {
						user_id: userId,
					});
				}
			}

			if (correctAnswers === totalAnswers) {
				finalModalOnOpen();
				await api.patch(`/user/finalQuiz/${userId}`, {
					finalQuizComplete: {
						blackMamba: true,
					},
				});
			} else {
				window.location.reload();
			}
			await updateUserQuizTime();
		} catch (error) {
			setOnError(true);
		}
	};

	const updateBlackMambaBadge = async () => {
		try {
			const userId = sessionStorage.getItem('@pionira/userId');
			setIsLoading(true);
			const badges = await api.get('/insignias/');
			const userBadges = badges.data[2].user_id;
			const badgeId = badges.data[2]._id;

			if (!userBadges.includes(userId)) {
				userBadges.push(userId);
				await api.patch(`user/addinsignia/${userId}`, {
					insignias_id: badgeId,
				});
			}
			finalModalOnClose();
			setIsLoading(false);
			certificateOnOpen();

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
				status: incrementAtStatusIndex(res), // first parameter of this func needs to be dynamic
			});

			await api.patch<userDataProps>(`/user/ignorance/${_userId}`, {
				// TODO - refatorar isso
				ignorance: (res.data.ignorance - 20 > 0) ? res.data.ignorance - 20 : 0,
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
				genericModalInfo={rewardModalInfo()}
				loading={isLoading}
				error={onError}
				confirmFunction={updateUserCoins}
				closeFunction={updateUserCoins}
			/>

			<Modal
				isOpen={finalModalIsOpen}
				onClose={finalModalOnClose}
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
							Você é merecedor da Marca da Mamba Negra”!`}
						</Text>
						<Image src={imgReward} h='50%' />
						<Text
							color={colorPalette.secondaryColor}
							fontWeight='600'
							textDecoration='underline'
							fontSize='1.87rem'
						>
							Marca da Mamba Negra
						</Text>
						<Flex
							w='65%'
							justifyContent='center'
							marginBottom='0.8rem'
						>
							<Button
								bgColor={colorPalette.secondaryColor}
								marginTop='6rem'
								width='45%'
								alignSelf='center'
								color={colorPalette.buttonTextColor}
								height='4rem'
								fontSize='1.4rem'
								_hover={{
									transform: 'scale(1.1)',
								}}
								onClick={() => updateBlackMambaBadge()}
							>
								Okay!
							</Button>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>

			<Certificate isOpen={certificateIsOpen} onOpen={certificateOnOpen} onClose={certificateOnClose} trail={trail} name={certificateName} />
		</>
	);
};

export default FinalRewardModal;
