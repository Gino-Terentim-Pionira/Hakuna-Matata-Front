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
	correctAnswers: number;
	totalAnswers: number;
	allQuestionsId?: string[];
	validateUser: VoidFunction;
	trail: number;
	certificateName: string;
	ignorance: number;
}

interface userDataProps {
	coins: number;
	status: number[];
	ignorance: number;
}

const FinalRewardModal: FC<IFinalRewardModal> = ({
	isOpen,
	coins,
	correctAnswers,
	totalAnswers,
	allQuestionsId,
	validateUser,
	trail,
	certificateName,
	ignorance
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
				title: 'Você é demais!',
				titleColor: colorPalette.inactiveButton,
				subtitle: `Você acertou ${correctAnswers} de ${totalAnswers} questões!`,
				icon: Cheetah,
				coins
			}
		return {
			title: 'Que pena!',
			titleColor: colorPalette.closeButton,
			subtitle: correctAnswers === 0 ? `Você não acertou nenhuma questão! Mas não desista, você poderá vencer a ignorância!` :
				`Você acertou apenas ${correctAnswers} de ${totalAnswers} questões! Mas não desista, você poderá vencer a ignorância!`,
			icon: Cross,
			coins
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
			/>

			<Modal
				isOpen={finalModalIsOpen}
				onClose={updateBlackMambaBadge}
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
