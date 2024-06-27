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
import { FINAL_QUIZ_SINK, WINSDOM_SOURCE } from '../../utils/constants/constants';

interface IQuestions {
	alternatives: string[];
	dificulty: string;
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
	routeQuiz: string;
	routeQuestions: string;
	trail: number;
}

const FinalUniversalQuiz: FC<IQuizComponent> = ({
	openModal,
	closeModal,
	quiz,
	questions,
	imgName,
	routeQuiz,
	routeQuestions,
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
		const questionId = questions[step]._id;

		if (index === newCorrectAnswer) {
			setCoins(coins + questionsCoins);
			setCorrectAnswer(correctAnswer + 1);

			setIgnorance(ignorance + WINSDOM_SOURCE);
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
			`Tem certeza que deseja sair do quiz? Você perderá as ${FINAL_QUIZ_SINK} joias do conhecimento que gastou!`,
		);
		setIsConfirmOpen(true);
	};

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
											fontSize={{xl: '20px', lg: '18px', md: '16px', sm: '14px'}}
										>
											{questions[step]?.description}
										</Text>
									</Flex>

									<Flex
										w='100%'
										h='100%'
										flexDir='column'
										alignItems='center'
										marginTop='0.5rem'
									>
										{
											questions[step].alternatives.map( (item, index) => {
												return (
													<Flex
													key={index}
													justifyContent='center'
													alignItems='center'
													w='90%'
													h='29%'
													boxShadow='4px 4px 4px rgba(0,0,0,0.25)'
													bg='white'
													borderRadius='0.5rem'
													marginBottom='0.7rem'
													marginRight='1.3rem'
													transition='all 200ms ease'
													border={borderStyle[index]}
													_hover={{
														cursor: 'pointer',
														transform: 'scale(1.05)',
													}}
													onClick={() => buttonFunctions(index)}
													>
														<Text
															w='92%'
															h='65%'
															fontFamily={fontTheme.fonts}
															fontSize='20px'
														>
															{
																item
															}
														</Text>
													</Flex>
												)
											} )
										}
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
				correctAnswers={correctAnswer}
				totalAnswers={length}
				allQuestionsId={questionsId}
				validateUser={validateUser}
				routeQuiz={routeQuiz}
				routeQuestions={routeQuestions}
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
