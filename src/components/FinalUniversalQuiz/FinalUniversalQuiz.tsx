import React, { FC, useState, useEffect, useRef } from 'react';
import {
	Text,
	Box,
	Flex,
	Modal,
	ModalContent,
	ModalOverlay,
	ModalBody,
	Image,
	Button,
	useDisclosure,
} from '@chakra-ui/react';
import fontTheme from '../../styles/base';

import FinalUniversalRewardModal from './FinalUniversalRewardModal';
import AlertModal from '../modals/AlertModal';

import api from '../../services/api';
import colorPalette from '../../styles/colorPalette';
import { errorCases } from '../../utils/errors/errorsCases';
import { shuffleString } from '../../utils/algorithms/shuffleString';

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

interface IQuizComponent {
	openModal: boolean;
	closeModal: VoidFunction;
	quiz: {
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
	};
	questions: IQuestions[];
	imgName: string;
	imgReward: string;
	routeQuiz: string;
	routeQuestions: string;
	insignaName: string;
	withoutMoney: boolean;
	userIgnorance: number;
	trail: number;
}

const FinalUniversalQuiz: FC<IQuizComponent> = ({
	openModal,
	closeModal,
	quiz,
	questions,
	imgName,
	imgReward,
	routeQuiz,
	routeQuestions,
	insignaName,
	withoutMoney,
	userIgnorance,
	trail
}) => {
	const { isOpen, onOpen } = useDisclosure();
	const [step, setStep] = useState(0);
	const [borderStyle, setBorderStyle] = useState([
		'none',
		'none',
		'none',
		'none',
	]);
	const [coins, setCoins] = useState(0);
	const [status, setStatus] = useState([0, 0, 0, 0, 0, 0]);
	const [correctAnswer, setCorrectAnswer] = useState(0);
	const [delayButton, setDelayButton] = useState(true);
	const [questionsId, setQuestionsId] = useState<string[]>([]);
	const [passed, setPassed] = useState(true);
	const [onError, setOnError] = useState(false);
	const [ignorance, setIgnorance] = useState(0);
	const length = questions.length;

	//Alert Modal
	const cancelRef = useRef<HTMLButtonElement>(null);
	const [alertAnswer, setAlertAnswer] = useState<string | undefined>('');
	const isAlertOnClose = () => setIsConfirmOpen(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const handleQuestion = () => {
		if (step >= length - 1) {
			setPassed(passed);
			onOpen();
		} else {
			setStep(step + 1);
		}
		setBorderStyle(['none', 'none', 'none', 'none']);
	};

	const isCorrect = (index: number) => {
		const newCorrectAnswer = questions[step].answer;
		const questionsCoins = questions[step].coins;
		const questionStatus = questions[step].score;
		const questionId = questions[step]._id;
		const quizDificulty = quiz.dificulty;

		if (index === newCorrectAnswer) {
			setCoins(coins + questionsCoins);
			setCorrectAnswer(correctAnswer + 1);
			setStatus([
				status[0] + questionStatus[0],
				status[1] + questionStatus[1],
				status[2] + questionStatus[2],
				status[3] + questionStatus[3],
				status[4] + questionStatus[4],
				status[5] + questionStatus[5],
			]);

			switch (quizDificulty) {
				case 'easy':
					setIgnorance(ignorance + 1);
					break;
				case 'normal':
					setIgnorance(ignorance + 2.5);
					break;
				case 'hard':
					setIgnorance(ignorance + 5);
					break;
			}
			setQuestionsId([...questionsId, questionId]);

			switch (index) {
				case 0:
					setBorderStyle([
						`3px solid ${colorPalette.correctAnswer}`,
						'none',
						'none',
						'none',
					]);
					break;
				case 1:
					setBorderStyle([
						'none',
						`3px solid ${colorPalette.correctAnswer}`,
						'none',
						'none',
					]);
					break;
				case 2:
					setBorderStyle([
						'none',
						'none',
						`3px solid ${colorPalette.correctAnswer}`,
						'none',
					]);
					break;
				case 3:
					setBorderStyle([
						'none',
						'none',
						'none',
						`3px solid ${colorPalette.correctAnswer}`,
					]);
					break;
			}
		} else {
			switch (index) {
				case 0:
					setBorderStyle([
						`3px solid ${colorPalette.incorrectAnswer}`,
						'none',
						'none',
						'none',
					]);
					break;
				case 1:
					setBorderStyle([
						'none',
						`3px solid ${colorPalette.incorrectAnswer}`,
						'none',
						'none',
					]);
					break;
				case 2:
					setBorderStyle([
						'none',
						'none',
						`3px solid ${colorPalette.incorrectAnswer}`,
						'none',
					]);
					break;
				case 3:
					setBorderStyle([
						'none',
						'none',
						'none',
						`3px solid ${colorPalette.incorrectAnswer}`,
					]);
					break;
			}
			if (withoutMoney) {
				switch (quizDificulty) {
					case 'easy':
						setIgnorance(ignorance - 2);
						break;
					case 'normal':
						setIgnorance(ignorance - 4);
						break;
					case 'hard':
						setIgnorance(ignorance - 6);
						break;
				}
			} else {
				switch (quizDificulty) {
					case 'easy':
						setIgnorance(ignorance - 1);
						break;
					case 'normal':
						setIgnorance(ignorance - 2);
						break;
					case 'hard':
						setIgnorance(ignorance - 4);
						break;
				}
			}
		}

		setTimeout(handleQuestion, 1000);
	};

	const buttonFunctions = (index: number) => {
		if (delayButton) {
			setDelayButton(!delayButton);
			isCorrect(index);
		}
	};

	const validateUser = async () => {
		try {
			const _userId = sessionStorage.getItem('@pionira/userId');
			if (!quiz.user_id.includes(_userId as string))
				await api.patch(`/${routeQuiz}/user/${quiz._id}`, {
					user_id: _userId,
				});
			else return;
		} catch (error) {
			setOnError(true);
		}
	};

	const confirmClose = () => {
		setAlertAnswer(
			'Tem certeza que deseja sair do quiz? Você perderá as 40 joias do conhecimento que gastou!',
		);
		setIsConfirmOpen(true);
	};

	const handleQuestionDescription = () => {
		if(userIgnorance >= 80) {
			return shuffleString(questions[step]?.description, 'hard');
		} else if (userIgnorance >= 40) {
			return shuffleString(questions[step]?.description, 'medium');
		} else {
			return questions[step]?.description
		}
		
	}

	useEffect(() => {
		if (!delayButton) {
			const timeout = setTimeout(() => {
				setDelayButton(!delayButton);
			}, 1000);
			return () => clearTimeout(timeout);
		}
	}, [delayButton]);

	return (
		<>
			<Modal isOpen={openModal} onClose={closeModal} size='full'>
				<ModalOverlay />
				<ModalContent
					margin='0'
					display='flex'
					justifyContent='center'
					alignItems='center'
					fontFamily={fontTheme.fonts}
				>
					<Box
						w='40%'
						bg={colorPalette.primaryColor}
						h='83vh'
						position='absolute'
						zIndex='-1'
						left='0'
						top='0'
						borderTopStartRadius='5px'
						clipPath='polygon(0% 0%, 100% 0%, 0% 100%)'
					/>

					<ModalBody display='flex' w='100%' alignItems='center'>
						<Text
							color={colorPalette.closeButton}
							fontSize='2rem'
							position='absolute'
							top='0'
							right='2%'
							transition='all 200ms ease'
							_hover={{
								cursor: 'pointer',
								transform: 'scale(1.05)',
							}}
							onClick={() => confirmClose()}
						>
							X
						</Text>
						<Flex w='100%' h='97vh'>
							<Flex w='55%' h='100%'>
								<Flex flexDir='column' w='100%' mt='-0.4rem'>
									<Text
										fontSize='2rem'
										fontWeight='bold'
										color={colorPalette.secondaryColor}
										marginLeft='2.8rem'
									>
										Q {step + 1}/{length}
									</Text>
									<Flex
										w='98%'
										borderRadius='0.5rem'
										boxShadow='4px 4px 4px rgba(0,0,0,0.25)'
										h='29%'
										maxH='161px'
										bg='white'
										marginTop='0.5rem'
										overflowY="auto"
										padding="24px"
									>
										<Text
											w='92%'
											fontFamily={fontTheme.fonts}
											fontSize={{xl: '18px', lg: '16px', md: '14px', sm: '14px'}}
										>
											{handleQuestionDescription()}
										</Text>
									</Flex>

									<Flex
										w='100%'
										h='100%'
										flexDir='column'
										alignItems='center'
										marginTop='0.5rem'
									>
										<Flex
											justifyContent='center'
											alignItems='center'
											w='90%'
											h='29%'
											boxShadow='4px 4px 4px rgba(0,0,0,0.25)'
											bg='white'
											borderRadius='0.5rem'
											marginRight='1.3rem'
											transition='all 200ms ease'
											border={borderStyle[0]}
											_hover={{
												cursor: 'pointer',
												transform: 'scale(1.05)',
											}}
											onClick={() => buttonFunctions(0)}
										>
											<Text
												w='92%'
												h='65%'
												fontFamily={fontTheme.fonts}
												fontSize='20px'
											>
												{
													questions[step]
														?.alternatives[0]
												}
											</Text>
										</Flex>

										<Flex
											justifyContent='center'
											alignItems='center'
											w='90%'
											h='29%'
											boxShadow='4px 4px 4px rgba(0,0,0,0.25)'
											bg='white'
											borderRadius='0.5rem'
											marginTop='0.7rem'
											marginRight='1.3rem'
											transition='all 200ms ease'
											border={borderStyle[1]}
											_hover={{
												cursor: 'pointer',
												transform: 'scale(1.05)',
											}}
											onClick={() => buttonFunctions(1)}
										>
											<Text
												w='92%'
												h='65%'
												fontFamily={fontTheme.fonts}
												fontSize='20px'
											>
												{
													questions[step]
														?.alternatives[1]
												}
											</Text>
										</Flex>

										<Flex
											justifyContent='center'
											alignItems='center'
											w='90%'
											h='29%'
											boxShadow='4px 4px 4px rgba(0,0,0,0.25)'
											bg='white'
											borderRadius='0.5rem'
											marginTop='0.7rem'
											marginRight='1.3rem'
											transition='all 200ms ease'
											border={borderStyle[2]}
											_hover={{
												cursor: 'pointer',
												transform: 'scale(1.05)',
											}}
											onClick={() => buttonFunctions(2)}
										>
											<Text
												w='92%'
												h='65%'
												fontFamily={fontTheme.fonts}
												fontSize='20px'
											>
												{
													questions[step]
														?.alternatives[2]
												}
											</Text>
										</Flex>

										<Flex
											justifyContent='center'
											alignItems='center'
											w='90%'
											h='29%'
											boxShadow='4px 4px 4px rgba(0,0,0,0.25)'
											bg='white'
											borderRadius='0.5rem'
											marginTop='0.7rem'
											marginRight='1.3rem'
											transition='all 200ms ease'
											border={borderStyle[3]}
											_hover={{
												cursor: 'pointer',
												transform: 'scale(1.05)',
											}}
											onClick={() => buttonFunctions(3)}
										>
											<Text
												w='92%'
												h='65%'
												fontFamily={fontTheme.fonts}
												fontSize='20px'
											>
												{
													questions[step]
														?.alternatives[3]
												}
											</Text>
										</Flex>
									</Flex>
								</Flex>
							</Flex>
							<Flex
								w='45%'
								h='100%'
								justifyContent='center'
								alignItems='center'
							>
								<Image src={imgName} h='70%' />
							</Flex>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>

			<AlertModal
				isOpen={isConfirmOpen}
				onClose={isAlertOnClose}
				alertTitle='Sair do Quiz'
				alertBody={alertAnswer}
				buttonBody={
					<Button
						ref={cancelRef}
						color='white'
						bg={colorPalette.primaryColor}
						onClick={() => {
							isAlertOnClose();
							location.reload();
						}}
					>
						Sair
					</Button>
				}
			/>

			<FinalUniversalRewardModal
				isOpen={isOpen}
				coins={coins}
				score={status}
				correctAnswers={correctAnswer}
				totalAnswers={length}
				allQuestionsId={questionsId}
				validateUser={validateUser}
				imgReward={imgReward}
				routeQuiz={routeQuiz}
				routeQuestions={routeQuestions}
				insignaName={insignaName}
				ignorance={ignorance}
				trail={trail}
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

export default FinalUniversalQuiz;
