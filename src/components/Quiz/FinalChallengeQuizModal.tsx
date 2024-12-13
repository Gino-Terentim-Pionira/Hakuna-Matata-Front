import { Flex, Text, Modal, ModalOverlay, ModalContent, Box, ModalBody, ModalCloseButton, Image } from '@chakra-ui/react';
import React, { FC, useState, useEffect } from 'react';
import colorPalette from '../../styles/colorPalette';
import fontTheme from '../../styles/base';

interface IFinalChallengeQuizModal {
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
    onEndQuiz(): void;
    correctAnswers: number;
    openAlert?: VoidFunction;
    image: string;
}

const FinalChallengeQuizModal: FC<IFinalChallengeQuizModal> = ({
    openModal,
    onEndQuiz,
    closeModal,
    onToggle,
    questions_id,
    onCorrect,
    onWrong,
    correctAnswers,
    openAlert,
    image
}) => {
    const [step, setStep] = useState(0);
    const [borderStyle, setBorderStyle] = useState(['none', 'none', 'none', 'none']);
    const [delayButton, setDelayButton] = useState(true);
    const length = questions_id.length;

    const callReward = () => {
        onEndQuiz();
    }

    const handleQuestion = () => {
        if (step >= (length - 1)) {
            onToggle();
            if (correctAnswers >= length / 2) {
                callReward();
            }
            else {
                callReward();
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
            <Modal isOpen={openModal} onClose={openAlert ? openAlert : closeModal} size='full' >
                <ModalOverlay />
                <ModalContent margin="0" display='flex' justifyContent='center' alignItems='center' >
                    <ModalCloseButton color={colorPalette.closeButton} size='lg' />
                    <Box
                        w="40%"
                        bg={colorPalette.primaryColor}
                        h="83vh"
                        position="absolute"
                        zIndex="-1"
                        left="0"
                        top="0"
                        borderTopStartRadius='5px'
                        clipPath="polygon(0% 0%, 100% 0%, 0% 100%)"
                    />

                    <ModalBody display='flex' w='100%' alignItems='center' flexDirection='column' >
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
											{questions_id[step]?.description}
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
											questions_id[step].alternatives.map( (item, index) => {
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
								<Image src={image} h='70%' />
							</Flex>
						</Flex>

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default FinalChallengeQuizModal;
