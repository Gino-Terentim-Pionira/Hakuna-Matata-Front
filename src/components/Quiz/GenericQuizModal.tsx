import { Flex, Text, Modal, ModalOverlay, ModalContent, Box, ModalBody, Center, ModalCloseButton } from '@chakra-ui/react';
import React, { FC, useState, useEffect } from 'react';
import colorPalette from '../../styles/colorPalette';
import fontTheme from '../../styles/base';
import { validateQuestionSize } from '../../utils/validates';

interface IGenericQuizModal {
    openModal: boolean;
    closeModal: VoidFunction;
    onToggle: VoidFunction;
    questions_id: ({
        _id: string;
        description: string;
        alternatives: string[];
        answer: number;
    })[] | [];
    onCorrect(question_id: string): void;
    onWrong(question_id: string): void;
    onEndQuiz(passed: boolean): void;
    correctAnswers: number;
    openAlert?: VoidFunction;
}

const GenericQuizModal: FC<IGenericQuizModal> = ({
    openModal,
    onEndQuiz,
    closeModal,
    onToggle,
    questions_id,
    onCorrect,
    onWrong,
    correctAnswers,
    openAlert
}) => {
    const [step, setStep] = useState(0);
    const [borderStyle, setBorderStyle] = useState(['none', 'none', 'none', 'none']);
    const [delayButton, setDelayButton] = useState(true);
    const length = questions_id.length;

    const callReward = (passed: boolean) => {
        onEndQuiz(passed);
    }

    const handleQuestion = () => {
        if (step >= (length - 1)) {
            onToggle();
            if (correctAnswers >= length / 2) {
                callReward(true);
            }
            else {
                callReward(false);
            }
        } else {
            setStep(step + 1);
        }
        setBorderStyle(['none', 'none', 'none', 'none']);
    }

    const isCorretAnswer = (index: number) => {
        const correctAnswer = questions_id[step].answer;
        const questionId = questions_id[step]._id;

        if (index === correctAnswer) {
            onCorrect(questionId);

            switch (index) {
                case 0:
                    setBorderStyle([`3px solid ${colorPalette.correctAnswer}`, 'none', 'none', 'none']);
                    break;
                case 1:
                    setBorderStyle(['none', `3px solid ${colorPalette.correctAnswer}`, 'none', 'none']);
                    break;
                case 2:
                    setBorderStyle(['none', 'none', `3px solid ${colorPalette.correctAnswer}`, 'none']);
                    break;
                case 3:
                    setBorderStyle(['none', 'none', 'none', `3px solid ${colorPalette.correctAnswer}`]);
                    break;
            }
        } else {
            switch (index) {
                case 0:
                    setBorderStyle([`3px solid ${colorPalette.incorrectAnswer}`, 'none', 'none', 'none']);
                    break;
                case 1:
                    setBorderStyle(['none', `3px solid ${colorPalette.incorrectAnswer}`, 'none', 'none']);
                    break;
                case 2:
                    setBorderStyle(['none', 'none', `3px solid ${colorPalette.incorrectAnswer}`, 'none']);
                    break;
                case 3:
                    setBorderStyle(['none', 'none', 'none', `3px solid ${colorPalette.incorrectAnswer}`]);
                    break;
            }

            onWrong(questionId);
        }
    }

    const buttonFunctions = (index: number) => {
        if (delayButton) {
            setDelayButton(!delayButton);
            isCorretAnswer(index);
            setTimeout(handleQuestion, 1000);
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

    useEffect(() => {
        setStep(0);
    }, [openModal])

    return (
		<>
			<Modal
				isOpen={openModal}
				onClose={openAlert ? openAlert : closeModal}
				size='full'
			>
				<ModalOverlay />
				<ModalContent
					margin='0'
					padding={{ base: 0, md: 'auto' }}
					height='100dvh'
					display='flex'
					justifyContent='center'
					alignItems='center'
					overflowY='auto'
				>
					<ModalCloseButton
						color={colorPalette.closeButton}
						size='lg'
					/>
					<Box
						w='40%'
						bg={colorPalette.primaryColor}
						h='83vh'
						position='absolute'
						zIndex='-1'
						left='0'
						top='0'
						borderTopStartRadius='5px'
						clipPath={{
							base: 'polygon(0% 0%, 100% 0%, 0% 40%)',
							md: 'polygon(0% 0%, 100% 0%, 0% 100%)',
						}}
					/>

					<ModalBody
						display='flex'
						w='100%'
						padding={{ base: '0 16px', md: 'auto' }}
						alignItems='center'
						maxHeight={{ base: 'none', md: 'auto' }}
						flexDirection='column'
					>
						<Flex
							w={{ base: '100%', md: '94%' }}
							h='97.5vh'
							flexDirection='column'
							alignItems='center'
							justifyContent={{
								base: 'flex-start',
								md: 'space-between',
							}}
						>
							<Flex w='100%' flexDirection='column'>
								<Text
									marginTop='0.5rem'
									fontFamily={fontTheme.fonts}
									fontSize={{ base: '26px', md: '30' }}
									fontWeight='bold'
									color={colorPalette.secondaryColor}
								>
									Q {step + 1}/{length}
								</Text>
								<Flex
									w={{ base: '100%', md: 'auto' }}
									marginTop='0.5rem'
									bg='white'
									boxShadow='4px 4px 4px rgba(0, 0, 0, 0.25)'
									borderRadius='8'
									h={{ base: 'fit-content', md: '29vh' }}
									minHeight={{ base: '120px', md: 'auto' }}
									maxHeight={{ base: '190px', md: 'auto' }}
									padding={{ base: '16px 16px', md: 'auto' }}
									justifyContent={{
										base: 'flex-start',
										md: 'center',
									}}
									alignItems={{
										base: 'flex-start',
										md: 'center',
									}}
								>
									<Text
										w={{ base: '100%', md: '92%' }}
										h='77%'
										fontFamily={fontTheme.fonts}
										fontSize={{ base: '16px', md: '25px' }}
									>
										{questions_id[step]?.description}
									</Text>
								</Flex>
							</Flex>

							<Flex
								flexDirection='column'
								justifyContent={{
									base: 'flex-start',
									md: 'space-around',
								}}
								w={{ base: '100%', md: '83%' }}
								h='54vh'
								marginTop={{ base: '20px', md: 'none' }}
								marginBottom={{ base: '0', md: '0.8rem' }}
							>
								<Flex
									flexDirection={{
										base: 'column',
										md: 'row',
									}}
									justifyContent='space-around'
									width={{ base: '100%', md: 'auto' }}
									h={{ base: 'fit-content', md: '45%' }}
									marginBottom={{ base: 0, md: '1rem' }}
								>
									<Center
										bg='white'
										h={{ base: 'fit-content', md: '100%' }}
										minHeight={{ base: '90px', md: 'auto' }}
										maxHeight={{
											base: '120px',
											md: 'auto',
										}}
										w={{ base: '100%', md: '40%' }}
										marginBottom={{ base: '16px', md: '0' }}
										padding={{ base: '8px 8px', md: 'auto' }}
										borderRadius='8px'
										border={borderStyle[0]}
										boxShadow='4px 4px 4px 4px rgba(0, 0, 0, 0.25)'
										transition={{ base: "none", md: 'all 200ms ease' }}
										_hover={{
											cursor: 'pointer',
											transform: { base: "none", md: 'scale(1.05)' },
										}}
										onClick={() => buttonFunctions(0)}
									>
										<Text
											w='90%'
											fontFamily={fontTheme.fonts}
											fontSize={{
												base: '16px',
												md: validateQuestionSize(
													questions_id[step]
												?.alternatives[0],
												)
												? '18px'
												: '24px'
											}}
											textAlign='center'
										>
											{
												questions_id[step]
													?.alternatives[0]
											}
										</Text>
									</Center>
									<Center
										bg='white'
										h={{ base: 'fit-content', md: '100%' }}
										minHeight={{ base: '90px', md: 'auto' }}
										maxHeight={{
											base: '120px',
											md: 'auto',
										}}
										w={{ base: '100%', md: '40%' }}
										marginBottom={{ base: '16px', md: '0' }}
										padding={{ base: '8px 8px', md: 'auto' }}
										borderRadius='8px'
										border={borderStyle[1]}
										boxShadow='4px 4px 4px 4px rgba(0, 0, 0, 0.25)'
										transition={{ base: "none", md: 'all 200ms ease' }}
										_hover={{
											cursor: 'pointer',
											transform: { base: "none", md: 'scale(1.05)' },
										}}
										onClick={() => buttonFunctions(1)}
									>
										<Text
											w='90%'
											fontFamily={fontTheme.fonts}
											fontSize={{
												base: '16px',
												md: validateQuestionSize(
													questions_id[step]
														?.alternatives[1],
												)
													? '18px'
													: '24px'
											}}
											textAlign='center'
										>
											{
												questions_id[step]
													?.alternatives[1]
											}
										</Text>
									</Center>
								</Flex>
								<Flex
									flexDirection={{
										base: 'column',
										md: 'row',
									}}
									justifyContent='space-around'
									width={{ base: '100%', md: 'auto' }}
									h={{ base: 'fit-content', md: '45%' }}
									marginBottom={{ base: 0, md: '1rem' }}
								>
									<Center
										bg='white'
										h={{ base: 'fit-content', md: '100%' }}
										minHeight={{ base: '90px', md: 'auto' }}
										maxHeight={{
											base: '120px',
											md: 'auto',
										}}
										w={{ base: '100%', md: '40%' }}
										marginBottom={{ base: '16px', md: '0' }}
										padding={{ base: '8px 8px', md: 'auto' }}
										borderRadius='8px'
										border={borderStyle[2]}
										boxShadow='4px 4px 4px 4px rgba(0, 0, 0, 0.25)'
										transition={{ base: "none", md: 'all 200ms ease' }}
										_hover={{
											cursor: 'pointer',
											transform: { base: "none", md: 'scale(1.05)' },
										}}
										onClick={() => buttonFunctions(2)}
									>
										<Text
											w='90%'
											fontFamily={fontTheme.fonts}
											fontSize={{
												base: '16px',
												md: validateQuestionSize(
													questions_id[step]
														?.alternatives[2],
												)
													? '18px'
													: '24px'
											}}
											textAlign='center'
										>
											{
												questions_id[step]
													?.alternatives[2]
											}
										</Text>
									</Center>
									<Center
										bg='white'
										h={{ base: 'fit-content', md: '100%' }}
										minHeight={{ base: '90px', md: 'auto' }}
										maxHeight={{
											base: '120px',
											md: 'auto',
										}}
										w={{ base: '100%', md: '40%' }}
										marginBottom={{ base: '16px', md: '0' }}
										padding={{ base: '8px 8px', md: 'auto' }}
										borderRadius='8px'
										border={borderStyle[3]}
										boxShadow='4px 4px 4px 4px rgba(0, 0, 0, 0.25)'
										transition={{ base: "none", md: 'all 200ms ease' }}
										_hover={{
											cursor: 'pointer',
											transform: { base: "none", md: 'scale(1.05)' },
										}}
										onClick={() => buttonFunctions(3)}
									>
										<Text
											w='90%'
											fontFamily={fontTheme.fonts}
											fontSize={{
												base: '16px',
												md: validateQuestionSize(
													questions_id[step]
														?.alternatives[3],
												)
													? '18px'
													: '24px'
											}}
											textAlign='center'
										>
											{
												questions_id[step]
													?.alternatives[3]
											}
										</Text>
									</Center>
								</Flex>
							</Flex>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}

export default GenericQuizModal;
