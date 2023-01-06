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
import colorPalette from '../styles/colorPalette';
import './../styles/fadeEffect.css';

// Components
import AlertModal from '../components/modals/AlertModal';
import TutorialModal from '../components/modals/TutorialModal';
import ProfileModal from '../components/modals/ProfileModal';
import RandomRewardModal from '../components/modals/RandomRewardModal';
import IgnoranceProgress from '../components/IgnoranceProgress';
import NarrativeModal from '../components/modals/NarrativeModal';
import ModuleModal from '../components/modals/ModuleModal';
import FinalUniversalQuiz from '../components/FinalUniversalQuiz';
import PremiumPassport from '../components/modals/PremiumPassport';

// Requisitions
import api from '../services/api';
import trail1FreeLunch from '../utils/scripts/CheetahTrail/Trail1FreeLunch';
import trail1Beggining from '../utils/scripts/CheetahTrail/Trail1Beggining';
import trail1Conclusion from '../utils/scripts/CheetahTrail/Trail1Conclusion';
import trail1FinalQuiz from '../utils/scripts/CheetahTrail/Trail1FinalQuiz';

// Images
import trail_bg from '../assets/scenerys/cheetah/trail_bg.png';
import icon_profile from '../assets/icons/icon_profile.svg';
import icon_tutorial from '../assets/icons/icon_tutorial.svg';
import icon_shop from '../assets/icons/icon_shop.svg';
import icon_map from '../assets/icons/icon_map.svg';
import icon_map_opened from '../assets/icons/icon_map_opened.svg';
import icon_logout from '../assets/icons/icon_logout.svg';
import final_cheetah_icon from '../assets/icons/final_cheetah_icon.svg';
import icon_membership from '../assets/icons/icon_membership.svg';
import cheetah from '../assets/sprites/cheetah/cheetah.png';
import insignaCheetah from '../assets/icons/insignia/insignaCheetah.svg';
import cheetah_bg from '../assets/modal/cheetah_bg.png';
import ignorance100 from '../assets/ignorance/cheetahPath/ignorance100.png';
import ignorance75 from '../assets/ignorance/cheetahPath/ignorance75.png';
import ignorance50 from '../assets/ignorance/cheetahPath/ignorance50.png';
import ignorance25 from '../assets/ignorance/cheetahPath/ignorance25.png';

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

const CheetahPath = () => {
	const { isOpen, onClose, onOpen } = useDisclosure();
	const history = useHistory();

	const [user, setUser] = useState<IUser>({} as IUser);
	const [isAlertOpen, setIsAlertOpen] = useState(false);
	const [withoutMoney, setWithoutMoney] = useState(false);
	const isAlertOnClose = () => setIsAlertOpen(false);
	const isAlertCoinsOnClose = () => setIsAlertCoins(false);
	const [cheetahText, setCheetahText] = useState<string>();
	const [alertCoins, setAlertCoins] = useState<string | undefined>('');
	0;
	const [alertQuiz, setAlertQuiz] = useState<string | undefined>('');
	const [onError, setOnError] = useState(false);
	const [completeTrail, setCompleteTrail] = useState(false);

	const ignoranceArray = [
		ignorance100,
		ignorance75,
		ignorance50,
		ignorance25,
	];

	const {
		isOpen: tutorialIsOpen,
		onClose: tutorialOnClose,
		onOpen: tutorialOnOpen,
		onToggle: tutorialOnToggle,
	} = useDisclosure();

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

	const {
		isOpen: premiumIsOpen,
		onClose: premiumOnClose,
		onOpen: premiumOnOpen,
		onToggle: premiumOnToggle,
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
	const [ignoranceImage, setIgnoranceImage] = useState('');

	const [script, setScript] = useState<IScript[]>([]);
	const [challengeScript, setChallengeScript] = useState<IScript[]>([]);
	const [finalChallengeScript, setFinalChallengeScript] = useState<IScript[]>(
		[],
	);

	const goToShop = () => {
		history.push('/shop');
	};
	const logout = () => {
		setAlertAnswer('Tem certeza que você deseja sair da savana?');
		setIsConfirmOpen(true);
	};
	const goToMap = () => {
		history.push('/mainPage');
	};

	const setIgnoranceFilter = (
		ignorance: number,
		ignoranceArray: string[],
	) => {
		const filterBackgroung = ignoranceFilterFunction(
			ignorance,
			ignoranceArray,
		);
		setIgnoranceImage(filterBackgroung);
	};

	const getUser = async () => {
		const _userId: SetStateAction<string> | null = sessionStorage.getItem(
			'@pionira/userId',
		);
		const { data } = await api.get(`/user/${_userId}`);
		setIgnoranceFilter(data.ignorance, ignoranceArray);
		const isComplete = data.finalQuizComplete.cheetahFinal;

		if (isComplete) {
			setCheetahText(
				`Você já alcançou o máximo da sua agilidade filhote... digo ${data.userName}! Você até agora consegue me ultrapassar! Vamos com tudo contra a ignorância!`,
			);
			setCompleteTrail(true);
			if (data.narrative_status.trail1 !== 4) {
				await api.patch(`/user/narrative/${_userId}`, {
					narrative_status: {
						trail1: 3,
					},
				});
				await finalCheetahNarrative();
			}
		} else {
			if (data.ignorance > 80)
				setCheetahText(
					'Tenha cuidado, jovem! Você não se preparou o suficente para vencer a Cheetah!',
				);
			else if (data.ignorance > 40)
				setCheetahText(
					'Você está definitivamente mais forte, jovem! Mas temo que a Cheetah é um desafio muito grande para você!',
				);
			else
				setCheetahText(
					'Você está pronto, jovem! Lembre-se de toda a sua jornada para vencer esse desafio!',
				);
		}
	};

	const getQuiz = async () => {
		const _userId: SetStateAction<string> | null = sessionStorage.getItem(
			'@pionira/userId',
		);
		const { data } = await api.get(`/user/${_userId}`);
		const newQuiz = await api.get('/finalcheetahquiz');

		if (data.ignorance > 80) {
			setQuiz(newQuiz.data[2]);
			const finishQuestions = finishQuestionIncludes(
				newQuiz.data[2].questions_id,
				_userId as string,
			);

			if (finishQuestions.length <= 0) {
				setQuestions(newQuiz.data[2].questions_id);
			} else {
				setQuestions(finishQuestions);
			}
		} else if (data.ignorance > 40) {
			setQuiz(newQuiz.data[1]);
			const finishQuestions = finishQuestionIncludes(
				newQuiz.data[1].questions_id,
				_userId as string,
			);

			if (finishQuestions.length <= 0) {
				setQuestions(newQuiz.data[1].questions_id);
			} else {
				setQuestions(finishQuestions);
			}
		} else {
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
		}
	};

	const getUserRequisition = async () => {
		const _userId: SetStateAction<string> | null = sessionStorage.getItem(
			'@pionira/userId',
		);
		const res = await api.get(`/user/${_userId}`);
		setUser(res.data);
	};
	const firstAccess = async () => {
		const _userId: SetStateAction<string> | null = sessionStorage.getItem(
			'@pionira/userId',
		);
		const res = await api.get(`/user/${_userId}`);

		if (res.data.narrative_status.trail1 == 0) {
			await api.patch(`/user/narrative/${_userId}`, {
				narrative_status: {
					trail1: 1,
					trail2: res.data.narrative_status.trail2,
				},
			});

			history.go(0);
		}
	};

	//Lógica para verificar a progressão da narrativa e autalizar o script
	const updateNarrative = async () => {
		const _userId: SetStateAction<string> | null = sessionStorage.getItem(
			'@pionira/userId',
		);
		const res = await api.get(`/user/${_userId}`);

		if (
			res.data.narrative_status.trail1 == 1 &&
			res.data.narrative_status.trail2 == 0
		) {
			//Verifica se é a primeira vez do usuário em uma trilha
			const newScript = await trail1FreeLunch();
			setScript(newScript);
			narrativeOnOpen();
		} else if (res.data.narrative_status.trail1 == 1) {
			//Verifica se é a primeira vez do usuário na trilha da cheetah
			const newScript = await trail1Beggining();
			setScript(newScript);
			narrativeOnOpen();
		}
	};

	const challengeNarrative = async () => {
		const newChallengeScript = await trail1FinalQuiz();
		setChallengeScript(newChallengeScript);
		narrativeChallengeOnOpen();
	};

	const finalCheetahNarrative = async () => {
		const newChallengeScript = await trail1Conclusion();
		setFinalChallengeScript(newChallengeScript);
		finalNarrativeChallengeOnOpen();
	};

	const alertQuizConfirm = () => {
		setAlertQuiz(
			'Para fazer o desafio final da Cheetah são necessárias 40 joias do conhecimento! Tem certeza que deseja prosseguir?',
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
		const _userId: SetStateAction<string> | null = sessionStorage.getItem(
			'@pionira/userId',
		);
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
				'Poxa! Parece que você não tem moedas suficientes! Se você proseguir podera ganhar o dobro de Ignorância e até ficar devendo moesdas! Escolha com sabedorias filhote.',
			);
			setIsCoinsCheck(true);
		}
	};

	useEffect(() => {
		getUser();
		getUserRequisition();
		firstAccess();
		updateNarrative();
		getQuiz();
	}, []);

	return (
		<div className="fadeIn">
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
					<Flex
						maxWidth='4.5rem'
						marginTop='1.5rem'
						flexDirection='column'
						alignItems='center'
					>
						{narrativeIsOpen ||
						narrativeChallengeIsOpen ||
						finalNarrativeChallengeIsOpen ? null : (
							<>
								<Center
									_hover={{
										cursor: 'pointer',
										transform: 'scale(1.1)',
									}}
									transition='all 0.2s ease'
									mb='.75rem'
									border='2px solid black'
									borderRadius='4.5rem'
									width='4.5rem'
									height='4.5rem'
									bg='white'
									onClick={onOpen}
								>
									<Image
										src={icon_profile}
										marginBottom='.5rem'
									/>
								</Center>

								<Center
									_hover={{
										cursor: 'pointer',
										transform: 'scale(1.1)',
									}}
									transition='all 0.2s ease'
									mb='.75rem'
									border='2px solid black'
									borderRadius='4.5rem'
									width='4.5rem'
									height='4.5rem'
									bg='white'
									onClick={() => goToShop()}
								>
									<Image
										src={icon_shop}
										marginBottom='.1rem'
									/>
								</Center>

								<Center
									_hover={{
										cursor: 'pointer',
										transform: 'scale(1.1)',
									}}
									transition='all 0.2s ease'
									mb='.75rem'
									border='2px solid black'
									borderRadius='4.5rem'
									width='3.75rem'
									height='3.75rem'
									bg='white'
									onClick={tutorialOnOpen}
								>
									<Image src={icon_tutorial} />
								</Center>

								<Center
									_hover={{
										cursor: 'pointer',
										transform: 'scale(1.1)',
									}}
									transition='all 0.2s ease'
									mb='.75rem'
									border='2px solid black'
									borderRadius='4.5rem'
									width='3.75rem'
									height='3.75rem'
									bg='white'
									onClick={() => logout()}
								>
									<Image src={icon_logout} />
								</Center>
								<Center
									_hover={{
										cursor: 'pointer',
										transform: 'scale(1.1)',
									}}
									transition='all 0.2s ease'
									border='2px solid black'
									borderRadius='4.5rem'
									width='6.55rem'
									height='6.55rem'
									bg='white'
									onClick={() => goToMap()}
									position='absolute'
									mt='78vh'
								>
									<Image
										src={icon_map}
										onMouseOverCapture={(e) =>
											(e.currentTarget.src = icon_map_opened)
										}
										onMouseOut={(e) =>
											(e.currentTarget.src = icon_map)
										}
									/>
								</Center>
							</>
						)}
					</Flex>

					{narrativeIsOpen ||
					narrativeChallengeIsOpen ||
					finalNarrativeChallengeIsOpen ? null : (
						<Flex
							flexDirection='column'
							justifyContent='space-between'
							alignItems='flex-end'
							h='87.5vh'
							marginTop='1.5rem'
						>
							<Image
								src={icon_membership}
								width='5.5rem'
								_hover={{
									cursor: 'pointer',
									transform: 'scale(1.1)',
								}}
								transition='all 0.2s ease'
								onClick={premiumOnOpen}
							/>
							<Flex
								flexDirection='row'
								marginTop='65vh'
								justifyContent='flex-end'
								alignItems='center'
							>
								<RandomRewardModal />
								<IgnoranceProgress
									fontSize='1.7rem'
									marginTop='0'
									size='6rem'
									ignorance={user.ignorance}
									position='absolute'
								/>
							</Flex>
						</Flex>
					)}
				</Flex>

				{narrativeIsOpen ||
				narrativeChallengeIsOpen ||
				finalNarrativeChallengeIsOpen ? null : (
					<>
						<Flex
							margin='2vw'
							justifyContent='space-between'
							zIndex='10'
						>
							<ModuleModal left='19vw' top='64vh' quizIndex={0} />
							<ModuleModal left='45vw'top='50vh' quizIndex={1} />
							<ModuleModal left='68vw' top='79vh' quizIndex={2} />
							<ModuleModal left='89vw'top='57vh' quizIndex={3} />
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
								top='35vh'
								left='70vw'
								zIndex='999'
							>
								<Image
									src={final_cheetah_icon}
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
													"{cheetahText}"
												</Text>
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
												{cheetahText}
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
												src={cheetah_bg}
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

				<ProfileModal isOpen={isOpen} onClose={onClose} />

				{script.length > 0 ? (
					//verifica se o script possui algum conteúdo
					<NarrativeModal
						isOpen={narrativeIsOpen}
						script={script}
						onToggle={narrativeOnToggle}
					/>
				) : null}
				{challengeScript.length > 0 ? (
					//verifica se o script possui algum conteúdo
					<NarrativeModal
						isOpen={narrativeChallengeIsOpen}
						script={challengeScript}
						onToggle={narrativeChallengeOnToggle}
					/>
				) : null}

				{finalChallengeScript.length > 0 ? (
					//verifica se o script possui algum conteúdo
					<NarrativeModal
						isOpen={finalNarrativeChallengeIsOpen}
						script={finalChallengeScript}
						onToggle={finalNarrativeChallengeOnToggle}
					/>
				) : null}

				<TutorialModal
					isOpen={tutorialIsOpen}
					onClose={tutorialOnClose}
					onToggle={tutorialOnToggle}
				/>

				<PremiumPassport
					isOpen={premiumIsOpen}
					onClose={premiumOnClose}
					onToggle={premiumOnToggle}
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

			<FinalUniversalQuiz
				openModal={quizIsOpen}
				closeModal={quizOnClose}
				quiz={quiz}
				questions={questions}
				imgName={cheetah}
				imgReward={insignaCheetah}
				routeQuestions={'cheetahquestions'}
				routeQuiz={'finalcheetahquiz'}
				insignaName={'da Cheetah'}
				withoutMoney={withoutMoney}
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
									Proseguir
								</Button>
							) : null}
							<Button
								ref={cancelRef}
								color='white'
								bg={colorPalette.primaryColor}
								onClick={() => {
									isAlertCoinsOnClose();
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
				alertBody='Parece que ocorreu um erro durante a nossa viagem, Jovem! tente recarregar!'
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
		</div>
	);
};

export default CheetahPath;
