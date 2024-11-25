import React, { useEffect, useRef, useState } from 'react';
import {
	Image,
	Flex,
	useDisclosure,
	Button,
	Box,
	Modal,
	ModalContent,
	ModalOverlay,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Text,
} from '@chakra-ui/react';
import { useUser } from '../hooks';

// Components
import NarrativeModal from '../components/modals/Narrative/NarrativeModal';
import FinalQuizModal from '../components/FinalBlackMambaQuiz/FinalQuiz';
import AlertModal from '../components/modals/AlertModal';
import NavActions from '../components/NavigationComponents/NavActions';

// Requisitions
import api from '../services/api';
import blackMambaScript from '../utils/scripts/BlackMambaQuiz/BlackMambaScript';
import blackMambaBeggining from './../utils/scripts/BlackMambaQuiz/BlackMambaBeggining';

// Styles
import fontTheme from '../styles/base';
import './../styles/blackMambaStyle.css';
import './../styles/fadeEffect.css';
import colorPalette from '../styles/colorPalette';

// Images
import BlackMambaBackground from '../assets/scenerys/blackMamba/black_mamba_bg.webp';
import ModalMamba from '../assets/modal/mamba_banner.webp';
import { errorCases } from '../utils/errors/errorsCases';
import LoadingOverlay from '../components/LoadingOverlay';
import { FINAL_QUIZ_SINK } from '../utils/constants/constants';
import { IUser } from '../recoil/useRecoilState';
import { LogOut } from '../services/auth';

interface IScript {
	name: string;
	image: string;
	texts: string[];
}

interface IQuiz {
	_id: string;
	name: string;
	questions_id: [
		{
			_id: string;
			description: string;
			alternatives: string[];
			answer: number;
			dificulty: string;
			score: number[];
			coins: number;
			user_id: string[];
		},
	];
	user_id: string[];
	total_coins: number;
	dificulty: string;
	tax: number;
}

interface IQuestions {
	alternatives: string[];
	dificulty: string;
	score: number[];
	user_id: string[];
	_id: string;
	description: string;
	answer: number;
	coins: number;
}

const BlackMambaPath = () => {
	const { isOpen, onClose, onOpen } = useDisclosure();
	const { userData, setUserData, getNewUserInfo } = useUser();
	const {
		isOpen: quizIsOpen,
		onClose: quizOnClose,
		onOpen: quizOnOpen,
	} = useDisclosure();

	const {
		isOpen: narrativeIsOpen,
		onOpen: narrativeOnOpen,
		onToggle: narrativeOnToggle,
	} = useDisclosure();

	const {
		isOpen: narrativeMonkeyIsOpen,
		onOpen: narrativeMonkeyOnOpen,
		onToggle: narrativeMonkeyOnToggle,
	} = useDisclosure();

	const [questions, setQuestions] = useState<IQuestions[]>([
		{
			alternatives: [''],
			dificulty: '',
			score: [0],
			user_id: [''],
			_id: '',
			description: '',
			answer: 0,
			coins: 0,
		},
	]);

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);
	const [isAlertCoins, setIsAlertCoins] = useState(false);
	const [completeTrail, setCompleteTrail] = useState(false);
	const [script, setScript] = useState<IScript[]>([]);
	const [scriptMonkey, setScriptMonkey] = useState<IScript[]>([]);
	const [mambaText, setMambaText] = useState<string>();
	const alertOnClose = () => setIsConfirmOpen(false);
	const isAlertOnClose = () => setIsAlertOpen(false);
	const isAlertCoinsOnClose = () => {
		setIsAlertCoins(false);
		setIsLoading(false);
	};
	const [alertAnswer, setAlertAnswer] = useState<string | undefined>('');
	const [alertQuiz, setAlertQuiz] = useState<string | undefined>('');
	const [alertCoins, setAlertCoins] = useState<string | undefined>('');
	const cancelRef = useRef<HTMLButtonElement>(null);
	const [onError, setOnError] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [payLoading, setPayLoading] = useState<boolean>(false);
	const [quiz, setQuiz] = useState<IQuiz>({
		_id: '',
		name: '',
		questions_id: [
			{
				_id: '',
				description: '',
				alternatives: [''],
				answer: 0,
				dificulty: '',
				score: [0],
				coins: 0,
				user_id: [''],
			},
		],
		user_id: [''],
		total_coins: 0,
		dificulty: '',
		tax: 0,
	});

	const finishQuestionIncludes = (
		questions: IQuestions[],
		_userId: string,
	) => {
		const res = questions.filter(
			(data: {
				alternatives: string[];
				dificulty: string;
				score: number[];
				user_id: string[];
				_id: string;
				description: string;
				answer: number;
				coins: number;
			}) => {
				return !data?.user_id.includes(_userId as string);
			},
		);
		return res;
	};

	const getUser = async () => {
		try {
			let userInfoData;
			if (!userData._id) {
				const _userId = sessionStorage.getItem('@pionira/userId');
				const { data } = await api.get(`/user/${_userId}`);
				setUserData(data);
				userInfoData = data;
			} else userInfoData = userData;

			const isComplete = userInfoData.finalQuizComplete.blackMamba;
			setIsLoading(false);
			updateScript(userInfoData);

			if (isComplete) {
				setMambaText(
					`Ora ora, vejo que sente mesmo minha falta... Já disse, você conseguiu vencer a ignorância por completo, não a nada mais a se fazer! Obrigado, ${userInfoData.userName}!`,
				);
				setCompleteTrail(true);
			} else {
				if (userInfoData.ignorance > 80)
					setMambaText(
						'Tenha cuidado, viajante! Você não se preparou o suficente para vencer a Mamba Negra!',
					);
				else if (userInfoData.ignorance > 40)
					setMambaText(
						'Você está definitivamente mais forte, viajante! Mas temo que a Mamba Negra é um desafio muito grande para você!',
					);
				else
					setMambaText(
						'Você está pronto, viajante! Lembre-se de toda a sua jornada para vencer esse desafio!',
					);
			}
		} catch (error) {
			setOnError(true);
		}
	};

	//Lógica para verificar a progressão da narrativa e autalizar o script
	const updateNarrative = async () => {
		let userInfoData;
		const _userId = sessionStorage.getItem('@pionira/userId');
		if (!userData._id) {
			const { data } = await api.get(`/user/${_userId}`);
			userInfoData = data;
		} else userInfoData = userData;

		if (userInfoData.narrative_status.blackMamba == 0) {
			//Verifica se é a primeira vez do usuário na trilha da mamba negra
			const newScript = await blackMambaBeggining();
			setScriptMonkey(newScript);
			narrativeMonkeyOnOpen();
			await api.patch(`/user/narrative/${_userId}`, {
				narrative_status: {
					...userInfoData.narrative_status,
					blackMamba: 2,
				},
			});
			await getNewUserInfo();
		}
	};

	const getQuiz = async () => {
		const _userId = sessionStorage.getItem('@pionira/userId');
		const newQuiz = await api.get('/finalQuiz');

		setQuiz(newQuiz.data[0]);
		const finishQuestions = finishQuestionIncludes(
			newQuiz.data[0].questions_id,
			_userId as string,
		);

		if (finishQuestions.length <= 0) {
			setQuestions(newQuiz.data[0].questions_id);
		} else {
			setQuestions(finishQuestions);
		}
	};

	const updateScript = async (user: IUser) => {
		const newScript = await blackMambaScript(user);
		setScript(newScript);
	};

	const logout = () => {
		setAlertAnswer('Tem certeza que você deseja sair da Savana?');
		setIsConfirmOpen(true);
	};

	const alertQuizConfirm = () => {
		setAlertQuiz(
			`Para fazer o desafio final da Mamba Negra são necessárias ${FINAL_QUIZ_SINK} joias do conhecimento! Tem certeza que deseja prosseguir?`,
		);
		setIsAlertOpen(true);
	};

	const handleModal = async () => {
		quizOnOpen();
		onClose();
	};

	const paxTax = async () => {
		const value = FINAL_QUIZ_SINK;
		setIsConfirmOpen(false);
		setPayLoading(true);
		const userId = sessionStorage.getItem('@pionira/userId');
		const userCoins = userData.coins;
		if (userCoins >= value) {
			const newCoins = userCoins - value;
			try {
				await api.patch(`/user/coins/${userId}`, {
					coins: newCoins,
				});

				setPayLoading(false);
				handleModal();
			} catch (error) {
				setPayLoading(false);
				setOnError(true);
			}
		}

		setPayLoading(false);
		if (userCoins < value) {
			setAlertCoins('Poxa!! Parece que você não tem moedas suficientes!');
			setIsAlertCoins(true);
		}
	};

	const closeAlert = () => {
        if (!payLoading) isAlertOnClose(); 
    }

	useEffect(() => {
		getUser();
		updateNarrative();
		getQuiz();
	}, []);

	return (
		<>
			<Flex h='100vh' flexDirection='column' alignItems='center'>
				<Image
					src={BlackMambaBackground}
					position='absolute'
					h='100vh'
					w='100%'
					zIndex='-3'
					left='0'
					top='0'
				/>

				{!narrativeIsOpen && !narrativeMonkeyIsOpen ? (
					<>
						<Flex
							position='absolute'
							justifySelf='center'
							w='30%'
							h='50vh'
							top='40vh'
							left='35vw'
							zIndex='11'
							className='bush-item-container'
							onClick={() => {
								if (!isLoading) {
									narrativeOnOpen();
									onOpen();
								}
							}}
						/>

						<Flex
							width='92.5%'
							justifyContent='space-between'
							alignItems='flex-start'
							zIndex='10'
							position='fixed'
						>
							<NavActions logout={logout} />
						</Flex>

						<Modal isOpen={isOpen} onClose={onClose} size='4xl'>
							<ModalOverlay />
							<ModalContent
								height='34rem'
								fontFamily={fontTheme.fonts}
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

								{completeTrail ? (
									<>
										<ModalBody
											d='flex'
											mt='-1rem'
											flexDirection='column'
											alignItems='center'
											justifyContent='space-between'
										>
											<Flex
												w='65%'
												h='100%'
												justifyContent='space-between'
												flexDirection='column'
												marginBottom='0.8rem'
											>
												<Text
													w='100%'
													marginTop='5rem'
													fontSize='2rem'
													lineHeight='9vh'
													textAlign='center'
													fontWeight='normal'
												>
													"{mambaText}"
												</Text>
												<ModalCloseButton
													color={
														colorPalette.closeButton
													}
													size='lg'
												/>
												<Button
													bgColor={
														colorPalette.secondaryColor
													}
													width='45%'
													alignSelf='center'
													color={
														colorPalette.buttonTextColor
													}
													height='4rem'
													fontSize='1.4rem'
													_hover={{
														transform: 'scale(1.1)',
													}}
													onClick={onClose}
												>
													Okay!
												</Button>
											</Flex>
										</ModalBody>
									</>
								) : (
									<>
										<ModalHeader
											d='flex'
											justifyContent='center'
											mt='1.4rem'
										>
											<Text
												ml='2.3rem'
												w='75%'
												fontSize='1.68rem'
												textAlign='center'
												fontWeight='normal'
											>
												"{mambaText}"
											</Text>
											<ModalCloseButton
												color={colorPalette.closeButton}
												size='lg'
											/>
										</ModalHeader>
										<ModalBody
											d='flex'
											mt='-1rem'
											flexDirection='column'
											alignItems='center'
											justifyContent='space-between'
										>
											<Image
												src={ModalMamba}
												w='65%'
												h='75%'
											/>

											<Flex
												w='65%'
												justifyContent='space-between'
												marginBottom='0.8rem'
											>
												<Button
													bgColor={
														colorPalette.confirmButton
													}
													width='45%'
													height='4rem'
													fontSize='1.2rem'
													_hover={{
														transform: 'scale(1.1)',
													}}
													onClick={() => {
														alertQuizConfirm();
													}}
												>
													Vamos nessa!
												</Button>
												<Button
													bgColor={
														colorPalette.closeButton
													}
													width='45%'
													height='4rem'
													fontSize='1.2rem'
													_hover={{
														transform: 'scale(1.1)',
													}}
													onClick={onClose}
												>
													Ainda não estou pronto!
												</Button>
											</Flex>
										</ModalBody>
									</>
								)}
							</ModalContent>
						</Modal>
					</>
				) : null}

				{quiz ? (
					<FinalQuizModal
						openModal={quizIsOpen}
						closeModal={quizOnClose}
						quiz={quiz}
						questions={questions}
					/>
				) : null}
				<AlertModal
					isOpen={isAlertOpen}
					onClose={closeAlert}
                	onClickClose = {closeAlert}
					alertTitle='Desafio Final'
					alertBody={alertQuiz}
					buttonBody={
						<Button
							ref={cancelRef}
							color='white'
							bg={colorPalette.primaryColor}
							onClick={paxTax}
							isLoading={payLoading}
						>
							Pagar
						</Button>
					}
				/>
				<AlertModal
					isOpen={isAlertCoins}
					onClose={isAlertCoinsOnClose}
					alertTitle='Moedas Insuficientes'
					alertBody={alertCoins}
					buttonBody={
						<Button
							ref={cancelRef}
							color='white'
							bg={colorPalette.primaryColor}
							onClick={() => {
								isAlertCoinsOnClose();
								setIsLoading(false);
							}}
						>
							Cancelar
						</Button>
					}
				/>

				<AlertModal
					isOpen={isConfirmOpen}
					onClose={alertOnClose}
					alertTitle='Logout'
					alertBody={alertAnswer}
					buttonBody={
						<Button
							ref={cancelRef}
							color='white'
							bg={colorPalette.primaryColor}
							onClick={LogOut}
						>
							Sair
						</Button>
					}
				/>
			</Flex>
			{
				isLoading && <LoadingOverlay />
			}

			{script.length > 0 ? (
				//verifica se o script possui algum conteúdo
				<NarrativeModal
					isOpen={narrativeIsOpen}
					script={script}
					onToggle={narrativeOnToggle}
				/>
			) : null}
			{scriptMonkey.length > 0 ? (
				<NarrativeModal
					isOpen={narrativeMonkeyIsOpen}
					script={scriptMonkey}
					onToggle={narrativeMonkeyOnToggle}
				/>
			) : null}
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

export default BlackMambaPath;
