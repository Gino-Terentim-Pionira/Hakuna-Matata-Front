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
import { useUser, useModule } from '../hooks';

//utils
import fontTheme from '../styles/base';
import ignoranceFilterFunction from '../utils/ignorance/ignoranceFilter';

//styles
import colorPalette from "../styles/colorPalette";

// Components
import AlertModal from '../components/modals/AlertModal';
import NarrativeModal from '../components/modals/Narrative/NarrativeModal';
import ModuleModal from '../components/modals/ModuleModal';
import IgnorancePremiumIcons from '../components/IgnoranceCoinsDisplay/IgnorancePremiumIcons';
import NavActions from '../components/NavigationComponents/NavActions';
import LoadingOverlay from '../components/LoadingOverlay';

// Requisitions
import api from '../services/api';
import lionBeggining from '../utils/scripts/LionTrail/LionBeggining';
import lionFreeLunch from '../utils/scripts/LionTrail/LionFreeLunch';
import lionConclusion from '../utils/scripts/LionTrail/LionConclusion';
import lionFinalQuiz from '../utils/scripts/LionTrail/LionFinalQuiz';

// Images
import trail_bg from '../assets/scenerys/lion/lion_bg.webp';
import final_lion_icon from '../assets/icons/final_lion_icon.svg';
import couple from '../assets/sprites/lion/couple.png';
import lion_bg from '../assets/modal/lion_banner.webp';
import atencao from '../assets/icons/atencao.png';

import ignorance100 from "../assets/ignorance/lionPath/ignorance_100.webp";
import ignorance75 from "../assets/ignorance/lionPath/ignorance_75.webp";
import ignorance50 from "../assets/ignorance/lionPath/ignorance_50.webp";
import ignorance25 from "../assets/ignorance/lionPath/ignorance_25.webp";
import { errorCases } from '../utils/errors/errorsCases';
import FinalUniversalQuiz from '../components/FinalUniversalQuiz/FinalUniversalQuiz';
import { FINAL_QUIZ_SINK } from '../utils/constants/constants';
import { getStatusPoints } from '../utils/statusUtils';
import { LEADERSHIP, STATUS_WARNING } from '../utils/constants/statusConstants';
import GenericModal from '../components/modals/GenericModal';
import { WAIT_TITLE, ALERT_CODE_SUBTITLE } from '../utils/constants/textConstants';
import { CONTINUE, GENERIC_MODAL_TEXT } from '../utils/constants/buttonConstants';
import lionTeasing from '../utils/scripts/LionTrail/LionTeasing';
import BlockedModal from '../components/modals/BlockedModal';
import buildModuleEndScript from '../utils/scripts/BuildModuleEndScript';
import { LogOut } from '../services/auth';
import { getTrailAccess, trailAccessEnum, setTrailAccess } from '../utils/localStorageUtils';

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

interface IScript {
	name: string;
	image: string;
	texts: string[];
}

const LionPath = () => {
	const { userData, setUserData } = useUser();
	const { getNewModuleInfo, moduleData } = useModule();
	const [isAlertOpen, setIsAlertOpen] = useState(false);
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
	const [payLoading, setPayLoading] = useState<boolean>(false);
	const [statusAlert, setStatusAlert] = useState(false);

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
	const cancelRef = useRef<HTMLButtonElement>(null);

	const [ignoranceImage, setIgnoranceImage] = useState("");

	const [script, setScript] = useState<IScript[]>([]);
	const [blockedMessage, setBlockedMessage] = useState<string>('');
	const [isBlockedOpen, setIsBlockedOpen] = useState(false);

	const logout = () => {
		setAlertAnswer('Tem certeza que você deseja sair da Savana?');
		setIsConfirmOpen(true);
	};

	const setIgnoranceFilter = (ignorance: number, ignoranceArray: string[]) => {
		const filterBackgroung = ignoranceFilterFunction(ignorance, ignoranceArray);
		setIgnoranceImage(filterBackgroung);
	}

	const handleNarrativeModal = (script: IScript[]) => {
		setScript(script);
		narrativeOnOpen();
	}

	const getUser = async () => {
		try {
			let userInfoData;
			const _userId = sessionStorage.getItem('@pionira/userId');
			if (moduleData.length === 0) {
				await getNewModuleInfo();
			}

			if (!userData._id) {
				const { data } = await api.get(`/user/${_userId}`);
				setUserData(data);
				userInfoData = data;
			} else userInfoData = userData;
			setIgnoranceFilter(userInfoData.ignorance, ignoranceArray);
			const isComplete = userInfoData.finalQuizComplete.lionFinal;
			setIsLoading(false);

			if (isComplete) {
				setLionText(
					`Você já alcançou o máximo da sua liderança, aprendiz... digo ${userInfoData.userName}! Você até agora consegue me ultrapassar! Vamos com tudo contra a ignorância!`,
				);
				setCompleteTrail(true);
				if (userInfoData.narrative_status.trail2 === 3) {
					finalLionNarrative(userInfoData.userName);
				}
			} else {
				if (userInfoData.ignorance > 80)
					setLionText(
						'Tenha cuidado, viajante! Você não se preparou o suficente para vencer o Leão e Leoa!',
					);
				else if (userInfoData.ignorance > 40)
					setLionText(
						'Você está definitivamente mais forte, viajante! Mas temo que o Leão e a Leoa é um desafio muito grande para você!',
					);
				else
					setLionText(
						'Você está pronto, viajante! Lembre-se de toda a sua jornada para vencer esse desafio!',
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

	//Lógica para verificar a progressão da narrativa e autalizar o script
	const checkNarrative = async () => {
		let userInfoData;
		const _userId = sessionStorage.getItem('@pionira/userId');
		if (!userData._id) {
			const { data } = await api.get(`/user/${_userId}`);
			userInfoData = data;
		} else userInfoData = userData;

		if (
			userInfoData.narrative_status.trail1 == 0 &&
			userInfoData.narrative_status.trail2 == 0
		) {
			//Verifica se é a primeira vez do usuário em uma trilha
			const newScript = await lionFreeLunch();
			handleNarrativeModal(newScript);
		} else if (userInfoData.narrative_status.trail2 == 0) {
			//Verifica se é a primeira vez do usuário na trilha do leao
			const newScript = await lionBeggining();
			handleNarrativeModal(newScript);
		} else if (userInfoData.narrative_status.trail2 != 3) { // Se não for a primera vez e se não for o diálogo final, começará a contagem de acessos
			const lion_access = getTrailAccess(trailAccessEnum.LION);
			if (lion_access) {
				const number_access = parseInt(lion_access);
				if (number_access < 3) {
					setTrailAccess(trailAccessEnum.LION, `${number_access + 1}`);
				} else {
					setTrailAccess(trailAccessEnum.LION, '0');
					const newScript = lionTeasing();
					handleNarrativeModal(newScript);
				}
			} else {
				setTrailAccess(trailAccessEnum.LION, '1');
			}
		}
	};


	const challengeNarrative = async () => {
		const newChallengeScript = await lionFinalQuiz();
		handleNarrativeModal(newChallengeScript);
	};

	const handleChallengeNarrative = async () => {
		if (!completeTrail) {
			await challengeNarrative();
		}
		modalOnOpen();
	}

	const finalLionNarrative = (userName: string) => {
		const newChallengeScript = lionConclusion(userName);
		handleNarrativeModal(newChallengeScript);
	};

	const alertQuizConfirm = () => {
		setAlertQuiz(
			`Para fazer o desafio final do Leão e Leoa são necessárias ${FINAL_QUIZ_SINK} joias do conhecimento! Tem certeza que deseja prosseguir?`,
		);
		setIsAlertOpen(true);
	};

	const handleModal = async () => {
		quizOnOpen();
		modalOnClose();
	};

	const paxTax = async () => {
		const value = FINAL_QUIZ_SINK;
		setIsConfirmOpen(false);
		setPayLoading(true);
		const _userId: SetStateAction<string> | null = sessionStorage.getItem('@pionira/userId');
		const userCoins = userData.coins;

		if (userCoins >= value) {
			const newCoins = userCoins - value;
			try {
				await api.patch(`/user/coins/${_userId}`, {
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
			setAlertCoins('Poxa! Parece que você não tem moedas suficientes!');
			setIsAlertCoins(true);
		}
	};

	const closeAlert = () => {
		if (!payLoading) isAlertOnClose();
	}

	const handleStatusAlert = () => {
		setStatusAlert(false);
		alertQuizConfirm();
	}

	const closeStatusAlert = () => {
		setStatusAlert(false);
	}

	const checkStatus = () => {
		if (getStatusPoints(userData, LEADERSHIP) < 80) {
			setStatusAlert(true);
		} else {
			alertQuizConfirm();
		}
	}

	const statusAlertInfo = {
		title: WAIT_TITLE,
		titleColor: colorPalette.progressOrange,
		subtitle: STATUS_WARNING(LEADERSHIP),
		icon: atencao,
		firstButton: CONTINUE,
		secondButton: GENERIC_MODAL_TEXT,
		alert: ALERT_CODE_SUBTITLE
	}

	const handleStatusRequirement = () => {
		setBlockedMessage(`Seu nível de ${LEADERSHIP} não é suficiente!`);
		setIsBlockedOpen(true);
	}

	const handleBlockedModule = () => {
		setBlockedMessage("Esse treinamento ainda não está disponível!");
		setIsBlockedOpen(true);
	}

	const moduleEndNarrativeScript = (quizIndex: number) => {
		const script = buildModuleEndScript('Leão e Leoa', moduleData[quizIndex].final_message);
		handleNarrativeModal(script)
	}

	useEffect(() => {
		getUser();
		checkNarrative();
		getQuiz();
	}, []);

	return (
		<>
			{
				isLoading ? <LoadingOverlay /> : (
					<>
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
						>
							{narrativeIsOpen ? null : (
								<NavActions logout={logout} />
							)}

							{narrativeIsOpen ? null : (
								<IgnorancePremiumIcons ignorance={userData.ignorance} />
							)}
						</Flex>

						{narrativeIsOpen ? null : (
							<>
								<Flex
									margin='2vw'
									justifyContent='space-between'
								>
									<ModuleModal
										left='8vw'
										top='65vh'
										quizIndex={0}
										openFinalModuleNarrative={() => moduleEndNarrativeScript(0)}
										blockedFunction={handleStatusRequirement}
									/>
									<ModuleModal
										left='22vw'
										top='88vh'
										quizIndex={1}
										openFinalModuleNarrative={() => moduleEndNarrativeScript(1)}
										blockedFunction={handleStatusRequirement}
									/>
									<ModuleModal
										left='58vw'
										top='85vh'
										quizIndex={2}
										openFinalModuleNarrative={() => moduleEndNarrativeScript(2)}
										blockedFunction={handleStatusRequirement}
									/>
									<ModuleModal
										left='79vw'
										top='55vh'
										quizIndex={0}
										openFinalModuleNarrative={() => moduleEndNarrativeScript(0)}
										isBlocked={true}
										blockedFunction={handleBlockedModule}
									/>
									<Center
										_hover={{
											cursor: 'pointer',
											transform: 'scale(1.1)',
										}}
										transition='all 0.2s ease'
										width='7rem'
										height='7rem'
										onClick={() => {
											handleChallengeNarrative();
										}}
										position='absolute'
										top='60vh'
										left='40vw'
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
																onClick={checkStatus}
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

						<FinalUniversalQuiz
							openModal={quizIsOpen}
							closeModal={quizOnClose}
							quiz={quiz}
							questions={questions}
							imgName={couple}
							routeQuestions={'lionquestions'}
							routeQuiz={'finallionquiz'}
							trail={2}
						/>
					</>
				)
			}

			{script.length > 0 &&
				//verifica se o script possui algum conteúdo
				<NarrativeModal
					isOpen={narrativeIsOpen}
					script={script}
					onToggle={narrativeOnToggle}
					narrative="lion"
				/>
			}

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

			<AlertModal
				isOpen={isAlertOpen}
				onClose={closeAlert}
				onClickClose={closeAlert}
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
					<>
						<Box
							w='100%'
							display='flex'
							justifyContent='space-between'
						>
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

			<GenericModal
				genericModalInfo={statusAlertInfo}
				isOpen={statusAlert}
				confirmFunction={handleStatusAlert}
				secondFunction={closeStatusAlert}
				closeFunction={closeStatusAlert}
				loading={false}
				error={false}
			/>

			<BlockedModal
				isOpen={isBlockedOpen}
				onClose={() => { setIsBlockedOpen(false) }}
				subtitle={blockedMessage}
			/>

		</>
	);
};

export default LionPath;
