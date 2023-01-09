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
	Grid,
	Image,
	Center,
	useDisclosure,
	ModalHeader
} from '@chakra-ui/react';

// Components
import LoadingState from '../components/LoadingState';
import Certificate from './modals/CertificateModal';

// Requisitions
import api from '../services/api';
import { AxiosResponse } from 'axios';

// Styles
import fontTheme from '../styles/base';
import colorPalette from '../styles/colorPalette';

// Images
import Coins from '../assets/icons/coinicon.svg';
import plusIcon from '../assets/icons/plusIcon.png';
import AlertModal from './modals/AlertModal';
import imgReward from '../assets/icons/insignia/mambaTrailInsignia.png'
import { errorCases } from '../utils/errors/errorsCases';

interface IRewardModal {
	isOpen: boolean;
	coins: number;
	score: number[];
	correctAnswers: number;
	totalAnswers: number;
	allQuestionsId?: string[];
	validateUser: VoidFunction;
	trail:number;
	certificateName: string;
}

interface userDataProps {
	coins: number;
	status: number[];
	quiz_coins: number[];
	ignorance: number;
}

const RewardModal: FC<IRewardModal> = ({
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
				await api.patch(`/insignias/${badgeId}`, {
					user_id: userBadges,
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
				ignorance: (res.data.ignorance - 20 > 0) ? res.data.ignorance - 20 : 0,
			});
			
			validateUser();
		} catch (error) {
			setOnError(true);
		}
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={updateUserCoins} size='4xl'>
				<ModalOverlay />
				<ModalContent paddingBottom='1.5rem'>
					<Box
						w='15%'
						bg={colorPalette.primaryColor}
						h='50vh'
						position='absolute'
						zIndex='0'
						right='-0.3'
						top='-0.2'
						borderTopEndRadius='5px'
						borderBottomStartRadius='23%'
						clipPath='polygon(0% 0%, 100% 0%, 100% 80%)'
					/>
					{isLoading ? (
						<Center w='100%' h='50vh'>
							<LoadingState />
						</Center>
					) : (
						<ModalBody>
							<Flex
								direction='column'
								alignItems='center'
								mt='1.2rem'
								mr='1.5rem'
							>
								{correctAnswers === totalAnswers ? (
									<>
										<Text
											fontFamily={fontTheme.fonts}
											fontWeight='semibold'
											fontSize='4rem'
											color={colorPalette.secondaryColor}
										>
											Arrasou!
										</Text>
										<Text
											fontFamily={fontTheme.fonts}
											fontWeight='semibold'
											fontSize='1.8rem'
											color={colorPalette.secondaryColor}
										>
											Você acertou {correctAnswers} de{' '}
											{totalAnswers} questões!
										</Text>
									</>
								) : (
									<>
										<Text
											fontFamily={fontTheme.fonts}
											fontWeight='semibold'
											fontSize='4rem'
											color={colorPalette.closeButton}
										>
											Que pena!
										</Text>
										<Text
											fontFamily={fontTheme.fonts}
											fontWeight='semibold'
											fontSize='1.8rem'
											color={colorPalette.secondaryColor}
										>
											Você acertou apenas {correctAnswers}{' '}
											de {totalAnswers} questões!
										</Text>
									</>
								)}
							</Flex>

							<Flex
								flexDirection='column'
								justifyContent='center'
								alignItems='center'
							>
								{/* first column of modal body  */}
								<Flex
									mt='2rem'
									ml='5rem'
									direction='column'
									alignItems='flex-start'
									width='75%'
								>
									<Text
										fontFamily={fontTheme.fonts}
										fontSize='1.7rem'
									>
										Você ganhou:
									</Text>
								</Flex>

								<Flex
									ml='5rem'
									direction='column'
									marginTop='1.5rem'
									width='75%'
								>
									<Grid
										gridTemplateColumns='1fr 1fr 1fr'
										gridColumnGap='2rem'
										gridRowGap='2rem'
									>
										{statusPointsRecieved.map(
											(status, index) => {
												return (
													<Flex
														key={index}
														alignItems='center'
													>
														<Image
															src={plusIcon}
															alt='plusIcon'
															w='39'
															h='39'
														/>
														<Text
															textAlign='center'
															fontFamily={
																fontTheme.fonts
															}
															fontSize='1.6rem'
															ml='0.5rem'
														>
															{' '}
															{status.points}{' '}
															{status.name}{' '}
														</Text>
													</Flex>
												);
											},
										)}
									</Grid>

									<Flex
										w='50%'
										mt='2.5rem'
										ml='-5rem'
										justifyContent='center'
										alignSelf='center'
										alignItems='center'
									>
										<Image src={Coins} w='50' h='50' />
										<Text ml='1.5rem' fontSize='1.6rem'>
											{coinsRecieved} Joias
										</Text>
									</Flex>
								</Flex>
							</Flex>

							<Flex
								w='48%'
								h='12vh'
								margin='auto'
								justifyContent='flex-end'
								flexDirection='column'
								alignItems='center'
							>
								<Button
									bgColor={colorPalette.primaryColor}
									color='white'
									onClick={updateUserCoins}
									w='100%'
									h='55px'
									borderRadius='5px'
									fontSize='2.5rem'
									fontFamily={fontTheme.fonts}
								>
									Continuar
								</Button>
							</Flex>
						</ModalBody>
					)}
				</ModalContent>
			</Modal>

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

			<Certificate isOpen={certificateIsOpen} onOpen={certificateOnOpen} onClose={certificateOnClose} trail={trail} name={certificateName}/>

			<AlertModal
				isOpen={onError}
				onClose={() => window.location.reload()}
				alertTitle='Ops!'
				alertBody={errorCases.SERVER_ERROR}

				buttonBody={
					<Button
						color='white'
						bg={colorPalette.primaryColor}
						onClick={() => window.location.reload()}
					>
						Recarregar
					</Button>
				}
			/>
		</>
	);
};

export default RewardModal;
