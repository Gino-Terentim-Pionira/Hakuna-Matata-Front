import React, { useState, useRef, useEffect, SetStateAction } from 'react';
import {
	Box,
	Flex,
	Image,
	Center,
	useDisclosure,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	Text,
	ModalHeader,
	ModalCloseButton,
} from '@chakra-ui/react';

//utils
import { useHistory } from 'react-router-dom';
import fontTheme from '../styles/base';
import ignoranceFilterFunction from '../utils/ignorance/ignoranceFilter';

//styles
import colorPalette from "../styles/colorPalette";

// Components
import AlertModal from '../components/modals/AlertModal';
import NarrativeModal from '../components/modals/NarrativeModal';
import ModuleModal from '../components/modals/ModuleModal';
import IgnorancePremiumIcons from '../components/IgnorancePremiumIcons';
import NavActions from '../components/NavActions';
import LoadingOverlay from '../components/LoadingOverlay';

// Requisitions
import api from '../services/api';
import lionBeggining from '../utils/scripts/LionTrail/LionBeggining';
import lionFreeLunch from '../utils/scripts/LionTrail/LionFreeLunch';
import lionConclusion from '../utils/scripts/LionTrail/LionConclusion';
// import trail2Teasing from '../utils/scripts/LionTrail/Trail2Teasing';
import lionFinalQuiz from '../utils/scripts/LionTrail/LionFinalQuiz';

// Images
import trail_bg from '../assets/scenerys/lion/Trilha_leao_e_leoa.png';
import final_lion_icon from '../assets/icons/final_lion_icon.svg';
import couple from '../assets/sprites/lion/couple.png';
import lionTrailInsignia from '../assets/icons/insignia/lionTrailInsignia.svg';
import lion_bg from '../assets/modal/lion_bg.png';

import ignorance100 from "../assets/ignorance/lionPath/ignorance100.png";
import ignorance75 from "../assets/ignorance/lionPath/ignorance75.png";
import ignorance50 from "../assets/ignorance/lionPath/ignorance50.png";
import ignorance25 from "../assets/ignorance/lionPath/ignorance25.png";
import { errorCases } from '../utils/errors/errorsCases';
import FinalUniversalQuiz from '../components/FinalUniversalQuiz/FinalUniversalQuiz';


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

interface IUser {
	ignorance: number;
	_id: string;
	userName: string;
}

interface IScript {
	name: string;
	image: string;
	texts: string[];
}

const LionPath = () => {
	const history = useHistory();

	const [user, setUser] = useState<IUser>({} as IUser);
	const [isAlertOpen, setIsAlertOpen] = useState(false);
	const [withoutMoney, setWithoutMoney] = useState(false);
	const isAlertOnClose = () => setIsAlertOpen(false);
	const isAlertCoinsOnClose = () => {
		setIsAlertCoins(false);
		setIsLoading(false);
	};
	const [lionText, setLionText] = useState<string>();
	const [alertCoins, setAlertCoins] = useState<string | undefined>('');
	0;
	const [alertQuiz, setAlertQuiz] = useState<string | undefined>('');
	const [onError, setOnError] = useState(false);
	const [completeTrail, setCompleteTrail] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const ignoranceArray = [ignorance100, ignorance75, ignorance50, ignorance25];

	const {
		isOpen: narrativeIsOpen,
		onOpen: narrativeOnOpen,
		onToggle: narrativeOnToggle,
	} = useDisclosure();

	const {
		isOpen: modalIsOpen,
		onClose: modalOnClose,
		onOpen: modalOnOpen,
	} = useDisclosure();

	const {
		isOpen: quizIsOpen,
		onClose: quizOnClose,
		onOpen: quizOnOpen,
	} = useDisclosure();

	const {
		isOpen: narrativeChallengeIsOpen,
		onOpen: narrativeChallengeOnOpen,
		onToggle: narrativeChallengeOnToggle,
	} = useDisclosure();

	const {
		isOpen: finalNarrativeChallengeIsOpen,
		onOpen: finalNarrativeChallengeOnOpen,
		onToggle: finalNarrativeChallengeOnToggle,
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
				return !data.user_id.includes(_userId as string);
			},
		);
		return res;
	};

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const alertOnClose = () => setIsConfirmOpen(false);
	const [alertAnswer, setAlertAnswer] = useState<string | undefined>('');
	const [isAlertCoins, setIsAlertCoins] = useState(false);
	const [isCoinsCheck, setIsCoinsCheck] = useState(false);
	const cancelRef = useRef<HTMLButtonElement>(null);

	const [ignoranceImage, setIgnoranceImage] = useState("");

	const [script, setScript] = useState<IScript[]>([]);
	const [challengeScript, setChallengeScript] = useState<IScript[]>([]);
	const [finalChallengeScript, setFinalChallengeScript] = useState<IScript[]>([]);

	const logout = () => {
		setAlertAnswer('Tem certeza que você deseja sair da Savana?');
		setIsConfirmOpen(true);
	};

	const setIgnoranceFilter = (ignorance: number, ignoranceArray: string[]) => {
		const filterBackgroung = ignoranceFilterFunction(ignorance, ignoranceArray);
		setIgnoranceImage(filterBackgroung);
	}

	const getUser = async () => {
		try {
			const _userId: SetStateAction<string> | null = sessionStorage.getItem('@pionira/userId');
			const { data } = await api.get(`/user/${_userId}`);
			setIgnoranceFilter(data.ignorance, ignoranceArray);
			const isComplete = data.finalQuizComplete.lionFinal;
			setUser(data);
			setIsLoading(false);

			if (isComplete) {
				setLionText(
					`Você já alcançou o máximo da sua liderança, aprendiz... digo ${data.userName}! Você até agora consegue me ultrapassar! Vamos com tudo contra a ignorância!`,
				);
				setCompleteTrail(true);
				if (data.narrative_status.trail2 !== 4) {
					await api.patch(`/user/narrative/${_userId}`, {
						narrative_status: {
							...data.narrative_status,
							trail2: 3
						},
					});
					await finalLionNarrative();
				}
			} else {
				if (data.ignorance > 80)
					setLionText(
						'Tenha cuidado, jovem! Você não se preparou o suficente para vencer o Leão e Leoa!',
					);
				else if (data.ignorance > 40)
					setLionText(
						'Você está definitivamente mais forte, jovem! Mas temo que a Leão e Leoa é um desafio muito grande para você!',
					);
				else
					setLionText(
						'Você está pronto, jovem! Lembre-se de toda a sua jornada para vencer esse desafio!',
					);
			}
		} catch (error) {
			setOnError(true);
		}
	};

	const getQuiz = async () => {
		const _userId: SetStateAction<string> | null = sessionStorage.getItem('@pionira/userId');
		const newQuiz = await api.get('/finallionquiz');
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

	const firstAccess = async () => {
		const _userId: SetStateAction<string> | null = sessionStorage.getItem('@pionira/userId');
		const res = await api.get(`/user/${_userId}`);

		if (res.data.narrative_status.trail2 == 0) {
			await api.patch(`/user/narrative/${_userId}`, {
				narrative_status: {
					...res.data.narrative_status,
					trail2: 1
				},
			});

			history.go(0);
		}
	};

	//Lógica para verificar a progressão da narrativa e autalizar o script
	const updateNarrative = async () => {
		const _userId: SetStateAction<string> | null = sessionStorage.getItem('@pionira/userId');
		const res = await api.get(`/user/${_userId}`);
		// const { data } = await api.get(`/user/${_userId}`);
		// const isComplete = data.finalQuizComplete.lionFinal;

		if (
			res.data.narrative_status.trail1 == 0 &&
			res.data.narrative_status.trail2 == 1
		) {
			//Verifica se é a primeira vez do usuário em uma trilha
			const newScript = await lionFreeLunch();
			setScript(newScript);
			narrativeOnOpen();
		} else if (res.data.narrative_status.trail2 == 1) {
			//Verifica se é a primeira vez do usuário na trilha do leao
			const newScript = await lionBeggining();
			setScript(newScript);
			narrativeOnOpen();
		}
		// else if (res.data.narrative_status.trail2 == 2 && !isComplete) {
		// 	//Verifica se o usuário está no dia a dia da trilha
		// 	const randomNumber = Math.floor(Math.random() * 10);
		// 	const newScript = await trail2Teasing(randomNumber);
		// 	setScript(newScript);
		// 	narrativeOnOpen();
		// }
	};


	const challengeNarrative = async () => {
		const newChallengeScript = await lionFinalQuiz();
		setChallengeScript(newChallengeScript);
		narrativeChallengeOnOpen();
	};

	const finalLionNarrative = async () => {
		const newChallengeScript = await lionConclusion();
		setFinalChallengeScript(newChallengeScript);
		finalNarrativeChallengeOnOpen();
	};

	const alertQuizConfirm = () => {
		setAlertQuiz(
			'Para fazer o desafio final do Leão e Leoa são necessárias 40 joias do conhecimento! Tem certeza que deseja prosseguir?',
		);
		setIsAlertOpen(true);
	};

	const handleModal = async () => {
		quizOnOpen();
		modalOnClose();
	};

	const paxTax = async () => {
		const value = 40;
		setIsConfirmOpen(false);
		const _userId: SetStateAction<string> | null = sessionStorage.getItem('@pionira/userId');
		const user = await api.get(`/user/${_userId}`);
		const validation = await api.get(`user/loadingQuiz/${_userId}`);
		const userCoins = user.data.coins;

		if (userCoins >= value) {
			const newCoins = userCoins - value;
			try {
				if (validation) {
					await api.patch(`/user/coins/${_userId}`, {
						coins: newCoins,
					});
				}

				handleModal();
			} catch (error) {
				setOnError(true);
			}
		}

		if (userCoins < value) {
			setAlertCoins('Poxa! Parece que você não tem moedas suficientes!');
			setIsAlertCoins(true);
		}

		if (userCoins <= 0 || userCoins < value) {
			setAlertCoins(
				'Poxa! Parece que você não tem moedas suficientes! Se você prosseguir podera ganhar o dobro de Ignorância e até ficar devendo moedas! Escolha com sabedorias aprendiz.',
			);
			setIsCoinsCheck(true);
		}
	};

	useEffect(() => {
		getUser();
		firstAccess();
		updateNarrative();
		getQuiz();
	}, []);

	return (
		<>
			<Flex h='100vh' flexDirection='column' alignItems='center'>
				<Image
					src={trail_bg}
					position='absolute'
					h='100vh'
					w='100%'
					zIndex='-3'
					left='0'
					top='0'
				/>
				<Image
					src={ignoranceImage}
					position='absolute'
					h='100vh'
					w='100%'
					zIndex='-3'
					left='0'
					top='0'
				/>

				<Flex
					width='92.5%'
					justifyContent='space-between'
					alignItems='flex-start'
					margin='auto'
					zIndex='10'
					position='fixed'
				>
					{narrativeIsOpen || narrativeChallengeIsOpen || finalNarrativeChallengeIsOpen ? null : (
						<NavActions logout={logout} />
					)}

					{narrativeIsOpen || narrativeChallengeIsOpen || finalNarrativeChallengeIsOpen ? null : (
						<IgnorancePremiumIcons ignorance={user.ignorance} />
					)}
				</Flex>

				{narrativeIsOpen || narrativeChallengeIsOpen || finalNarrativeChallengeIsOpen ? null : (
					<>
						<Flex
							margin='2vw'
							justifyContent='space-between'
							zIndex='10'
						>
							<ModuleModal left='7vw' top='62vh' quizIndex={4} />
							<ModuleModal left='22vw' top='86vh' quizIndex={5} />
							<ModuleModal left='58vw' top='87vh' quizIndex={6} />
							<ModuleModal left='79vw' top='58vh' quizIndex={7} />
							<Center
								_hover={{
									cursor: 'pointer',
									transform: 'scale(1.1)',
								}}
								transition='all 0.2s ease'
								width='7rem'
								height='7rem'
								onClick={() => {
									if (!completeTrail) {
										narrativeChallengeOnOpen();
										challengeNarrative();
									}
									modalOnOpen();
								}}
								position='absolute'
								top='60vh'
								left='40vw'
								zIndex='999'
							>
								<Image
									src={final_lion_icon}
									width='90%'
									height='90%'
								/>
							</Center>
						</Flex>

						<Modal
							isOpen={modalIsOpen}
							onClose={modalOnClose}
							size='4xl'
						>
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
													"{lionText}"
												</Text>
												<Button
													bgColor={colorPalette.secondaryColor}
													width='45%'
													alignSelf='center'
													color={colorPalette.buttonTextColor}
													height='4rem'
													fontSize='1.4rem'
													_hover={{
														transform: 'scale(1.1)',
													}}
													onClick={modalOnClose}
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
												fontSize='1.4rem'
												textAlign='center'
												fontWeight='normal'
											>
												{lionText}
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
												src={lion_bg}
												w='65%'
												h='75%'
											/>

											<Flex
												w='65%'
												justifyContent='space-between'
												marginBottom='0.8rem'
											>
												<Button
													bgColor={colorPalette.confirmButton}
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
													bgColor={colorPalette.closeButton}
													width='45%'
													height='4rem'
													fontSize='1.2rem'
													_hover={{
														transform: 'scale(1.1)',
													}}
													onClick={modalOnClose}
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
				)}

				{script.length > 0 ? (
					//verifica se o script possui algum conteúdo
					<NarrativeModal
						isOpen={narrativeIsOpen}
						script={script}
						onToggle={narrativeOnToggle}
						narrative="lion"
					/>
				) : null}
				{challengeScript.length > 0 ? (
					//verifica se o script possui algum conteúdo
					<NarrativeModal
						isOpen={narrativeChallengeIsOpen}
						script={challengeScript}
						onToggle={narrativeChallengeOnToggle}
						narrative="lion"
						/>
				) : null}

				{finalChallengeScript.length > 0 ? (
					//verifica se o script possui algum conteúdo
					<NarrativeModal
						isOpen={finalNarrativeChallengeIsOpen}
						script={finalChallengeScript}
						onToggle={finalNarrativeChallengeOnToggle}
						narrative="lion"
						/>
				) : null}

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
							onClick={() => {
								alertOnClose();
								sessionStorage.clear();
								location.reload();
							}}
						>
							Sair
						</Button>
					}
				/>
			</Flex>
			{
				isLoading && <LoadingOverlay />
			}

			<FinalUniversalQuiz
				openModal={quizIsOpen}
				closeModal={quizOnClose}
				quiz={quiz}
				questions={questions}
				imgName={couple}
				imgReward={lionTrailInsignia}
				routeQuestions={'lionquestions'}
				routeQuiz={'finallionquiz'}
				insignaName={'do Leão e Leoa'}
				withoutMoney={withoutMoney}
				userIgnorance={user.ignorance}
				trail={2}
			/>

			<AlertModal
				isOpen={isAlertOpen}
				onClose={isAlertOnClose}
				alertTitle='Desafio Final'
				alertBody={alertQuiz}
				buttonBody={
					<Button
						ref={cancelRef}
						color='white'
						bg={colorPalette.primaryColor}
						onClick={() => {
							paxTax();
							isAlertOnClose();
							modalOnClose();
							setIsLoading(true);
						}}
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
					<>
						<Box
							w='100%'
							display='flex'
							justifyContent='space-between'
						>
							{isCoinsCheck ? (
								<Button
									ref={cancelRef}
									color='white'
									bg={colorPalette.closeButton}
									onClick={() => {
										handleModal();
										setWithoutMoney(true);
										setIsCoinsCheck(false);
									}}
								>
									Prosseguir
								</Button>
							) : null}
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
						</Box>
					</>
				}
			/>

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

export default LionPath;
