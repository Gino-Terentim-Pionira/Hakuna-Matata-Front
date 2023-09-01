import React, { FC, useEffect, useState } from 'react';
import {
    Text,
    Box,
    Flex,
    Modal,
    ModalContent,
    ModalOverlay,
    ModalBody,
    ModalCloseButton,
    Center,
    useDisclosure
} from '@chakra-ui/react';
import { useUser } from '../../hooks';

// Components
import RewardModal from './GenericModal';

// Styles
import fontTheme from '../../styles/base'
import colorPalette from '../../styles/colorPalette';
import api from '../../services/api';
import { AxiosResponse } from 'axios';

// Images
import Cheetah from '../../assets/icons/cheetahblink.svg';
import Cross from '../../assets/icons/cross.svg';
import { validateQuestionSize } from '../../utils/validates';

interface userDataProps {
    coins: number,
    status: number[],
    ignorance: number
}

interface IQuizComponent {
    openModal: boolean;
    closeModal: VoidFunction;
    onToggle: VoidFunction;
    moduleInfo: {
        questions_id: [{
            _id: string,
            description: string,
            alternatives: string[],
            answer: number,
            coins: number,
            score_points: number[],
        }];
        dificulty: string;
        total_coins: number;
    };
    validateUser: VoidFunction;
    firsTimeChallenge: boolean;
    userQuizCoins: number;
}


const QuizModal: FC<IQuizComponent> = ({
    openModal,
    closeModal,
    moduleInfo,
    onToggle,
    validateUser,
    firsTimeChallenge,
    userQuizCoins
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { getNewUserInfo, userData } = useUser();
    const [step, setStep] = useState(0);
    const length = moduleInfo.questions_id.length;
    const [coins, setCoins] = useState(0);
    const [status, setStatus] = useState([0, 0, 0, 0, 0, 0]);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [passed, setPassed] = useState(Boolean);
    const [borderStyle, setBorderStyle] = useState(['none', 'none', 'none', 'none']);
    const [delayButton, setDelayButton] = useState(true);
    const [questionsId, setQuestionsId] = useState<string[]>([]);
    const [ignorance, setIgnorance] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [onError, setOnError] = useState(false);

    const isCorretAnswer = (index: number) => {
        const correctAnswer = moduleInfo.questions_id[step].answer;
        const questionsCoins = moduleInfo.questions_id[step].coins;
        const questionStatus = moduleInfo.questions_id[step].score_points;
        const questionId = moduleInfo.questions_id[step]._id;
        const questionUserId = userData.question_id

        if (index === correctAnswer) {

            if (questionUserId.includes(moduleInfo.questions_id[step]._id)) {
                setCorrectAnswers(correctAnswers + 1);
            } else {
                setCoins(coins + questionsCoins);
                setCorrectAnswers(correctAnswers + 1);
                setStatus([
                    status[0] + questionStatus[0],
                    status[1] + questionStatus[1],
                    status[2] + questionStatus[2],
                    status[3] + questionStatus[3],
                    status[4] + questionStatus[4],
                    status[5] + questionStatus[5],
                ]);

                setIgnorance(ignorance + 1.5);
                setQuestionsId([...questionsId, questionId]);
            }

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
            setIgnorance(ignorance - 0.75);
        }
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

    const buttonFunctions = (index: number) => {
        if (delayButton) {
            setDelayButton(!delayButton);
            isCorretAnswer(index);
            setTimeout(handleQuestion, 1000);
        }
    }

    const callReward = (passed: boolean) => {
        setPassed(passed);
        onOpen();
    }

    useEffect(() => {
        if (!delayButton) {
            const timeout = setTimeout(() => {
                setDelayButton(!delayButton);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [delayButton]);

    const incrementAtStatusIndex = (res: AxiosResponse<userDataProps>) => {
        for (let i = 0; i < 2; i++) {
            res.data.status[i] = res.data.status[i] + status[i];
        }
        return res.data.status;
    }

    const addCoinsStatus = async (value: number) => {
        try {
            const _userId = sessionStorage.getItem('@pionira/userId');
            const res = await api.get<userDataProps>(`/user/${_userId}`);

            if (userQuizCoins < moduleInfo.total_coins)
                await api.patch<userDataProps>(`/user/coins/${_userId}`, {
                    coins: res.data.coins + value
                });
            await api.patch<userDataProps>(`/user/status/${_userId}`, {
                status: incrementAtStatusIndex(res)  // first parameter of this func needs to be dynamic
            });
            await api.patch<userDataProps>(`/user/ignorance/${_userId}`, {
                ignorance: res.data.ignorance - ignorance,
            });
        } catch (error) {
            console.log(error);
            setOnError(true);
        }
    }

    const updateUserQuizTime = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            await api.patch(`user/loadingQuiz/${userId}`, {
                quiz_loading: Date.now() - 10800000
            });
        } catch (error) {
            setOnError(true);
        }
    }

    const updateUserCoins = async () => {
        try {
            setIsLoading(true);
            await addCoinsStatus(coins);
            if (questionsId) {
                const userId = sessionStorage.getItem('@pionira/userId');
                const length = questionsId.length;
                for (let i = 0; i < length; i++) {
                    await api.patch(`/user/addquestion/${userId}`, {
                        question_id: questionsId[i]
                    });
                }
            }
            firsTimeChallenge ? validateUser() : null

            await updateUserQuizTime();
            await getNewUserInfo();
            onClose();
        } catch (error) {
            setOnError(true);
        }
    }

    const rewardModalInfo = () => {
        if (userQuizCoins >= moduleInfo.total_coins)
            return {
                title: 'Arrasou!',
                titleColor: colorPalette.inactiveButton,
                subtitle: 'Você já conseguiu provar todo o seu valor nesse desafio! Pode seguir adiante com sua jornada, caro viajante!',
                icon: Cheetah,
                coins: undefined,
                score: undefined
            }
        if (passed)
            return {
                title: 'Você é demais!',
                titleColor: colorPalette.inactiveButton,
                subtitle: `Você acertou ${correctAnswers} de ${length} questões!`,
                icon: Cheetah,
                coins,
                status
            }
        return {
            title: 'Que pena!',
            titleColor: colorPalette.closeButton,
            subtitle: `Você errou ${length - correctAnswers} de ${length} questões! Tente novamente em 30 minutos`,
            icon: Cross,
            coins,
            status
        }
    }

    return (
        <>
            <Modal isOpen={openModal} onClose={closeModal} size='full' >
                <ModalOverlay />
                <ModalContent margin="0" display='flex' justifyContent='center' alignItems='center' >
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
                        <ModalCloseButton color={colorPalette.closeButton} />
                        <Flex w='94%' h='97.5vh' flexDirection='column' alignItems='center' justifyContent='space-between' >
                            <Flex w='100%' flexDirection='column'>
                                <Text marginTop='0.5rem' fontFamily={fontTheme.fonts} fontSize='30' fontWeight='bold' color={colorPalette.secondaryColor} >Q {step + 1}/{length}</Text>
                                <Flex marginTop='0.5rem' bg='white' boxShadow='4px 4px 4px rgba(0, 0, 0, 0.25)' borderRadius='8' h='29vh' justifyContent='center' alignItems='center' >
                                    <Text w='92%' h='77%' fontFamily={fontTheme.fonts} fontSize='25px' >
                                        {moduleInfo?.questions_id[step]?.description}
                                    </Text>
                                </Flex>
                            </Flex>

                            <Flex flexDirection='column' justifyContent='space-around' w='83%' h='54vh' marginBottom='0.8rem'>
                                <Flex justifyContent='space-around' h='45%' marginBottom='1rem'>
                                    <Center
                                        bg='white'
                                        h='100%'
                                        w='40%'
                                        borderRadius='8px'
                                        border={borderStyle[0]}
                                        boxShadow='4px 4px 4px 4px rgba(0, 0, 0, 0.25)'
                                        transition='all 200ms ease'
                                        _hover={{
                                            cursor: 'pointer',
                                            transform: 'scale(1.05)'
                                        }}
                                        onClick={() => buttonFunctions(0)}
                                    >
                                        <Text
                                            w='90%'
                                            fontFamily={fontTheme.fonts}
                                            fontSize={validateQuestionSize(moduleInfo?.questions_id[step]?.alternatives[0]) ? '18px' : '24px'}
                                            textAlign='center'
                                        >
                                            {moduleInfo?.questions_id[step]?.alternatives[0]}
                                        </Text>
                                    </Center>
                                    <Center
                                        bg='white'
                                        h='100%'
                                        w='40%'
                                        border={borderStyle[1]}
                                        borderRadius='8px'
                                        boxShadow='4px 4px 4px 4px rgba(0, 0, 0, 0.25)'
                                        transition='all 200ms ease'
                                        _hover={{
                                            cursor: 'pointer',
                                            transform: 'scale(1.05)'
                                        }}
                                        onClick={() => buttonFunctions(1)}
                                    >
                                        <Text
                                            w='90%'
                                            fontFamily={fontTheme.fonts}
                                            fontSize={validateQuestionSize(moduleInfo?.questions_id[step]?.alternatives[1]) ? '18px' : '24px'}
                                            textAlign='center'
                                        >
                                            {moduleInfo?.questions_id[step]?.alternatives[1]}
                                        </Text>
                                    </Center>
                                </Flex>
                                <Flex justifyContent='space-around' h='45%'>
                                    <Center
                                        bg='white'
                                        h='100%'
                                        w='40%'
                                        borderRadius='8px'
                                        boxShadow='4px 4px 4px 4px rgba(0, 0, 0, 0.25)'
                                        transition='all 200ms ease'
                                        border={borderStyle[2]}
                                        _hover={{
                                            cursor: 'pointer',
                                            transform: 'scale(1.05)'
                                        }}
                                        onClick={() => buttonFunctions(2)}
                                    >
                                        <Text
                                            w='90%'
                                            fontFamily={fontTheme.fonts}
                                            fontSize={validateQuestionSize(moduleInfo?.questions_id[step]?.alternatives[2]) ? '18px' : '24px'}
                                            textAlign='center'
                                        >
                                            {moduleInfo?.questions_id[step]?.alternatives[2]}
                                        </Text>
                                    </Center>
                                    <Center
                                        bg='white'
                                        h='100%'
                                        w='40%'
                                        borderRadius='8px'
                                        boxShadow='4px 4px 4px 4px rgba(0, 0, 0, 0.25)'
                                        border={borderStyle[3]}
                                        transition='all 200ms ease'
                                        _hover={{
                                            cursor: 'pointer',
                                            transform: 'scale(1.05)'
                                        }}
                                        onClick={() => buttonFunctions(3)}
                                    >
                                        <Text
                                            w='90%'
                                            fontFamily={fontTheme.fonts}
                                            fontSize={validateQuestionSize(moduleInfo?.questions_id[step]?.alternatives[3]) ? '18px' : '24px'}
                                            textAlign='center'
                                        >
                                            {moduleInfo?.questions_id[step]?.alternatives[3]}
                                        </Text>
                                    </Center>
                                </Flex>
                            </Flex>
                        </Flex>

                    </ModalBody>
                </ModalContent>
            </Modal>

            <RewardModal
                isOpen={isOpen}
                genericModalInfo={rewardModalInfo()}
                confirmFunction={updateUserCoins}
                loading={isLoading}
                error={onError}
            />
        </>
    );
}

export default QuizModal;
