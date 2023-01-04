import React, { FC, useEffect, useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalOverlay,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Box,
    Flex,
    Button,
    Text,
    Grid,
    useDisclosure,
    Image
} from "@chakra-ui/react";

// Components
import QuizModal from './QuizModal';
import LoadingState from '../LoadingState';
import VideoModal from './VideoModal';
import TimeModal from './TimeModal';
import AlertModal from './AlertModal';

// Requisitions
import api from '../../services/api';

// Styles
import fontTheme from '../../styles/base';

// Images
import Coins from '../../assets/icons/coinicon.svg';
import button_on from '../../assets/icons/button_on.png';
import button_off from '../../assets/icons/button_off.png';
import colorPalette from '../../styles/colorPalette';


interface IModuleModal {
    quizIndex: number;
    top?: string;
    bottom?: string;
    left?: string; 
}

interface IQuizz {
    user_id: string;
    _id: string
    name: string;
    questions_id: [{
        _id: string,
        description: string,
        alternatives: string[],
        answer: number,
        coins: number,
        score: number[],
        user_id: string[]
    }];
    category: string;
    dificulty: string;
    videos_id: [{
        user_id: string[],
        name: string,
        url: string,
        nick: string,
        _id: string,
    }];
    total_coins: number;
}

interface IUser {
    _id: string;
    userName: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    birthday_date: string;
    is_confirmed: boolean;
    status: [number];
    coins: number;
    contribution: number;
    first_certificate: string;
    second_certificate: string;
    quiz_coins: {
        module1: number,
        module2: number,
        module3: number,
        module4: number
    }
}

const ModuleModal: FC<IModuleModal> = ({ quizIndex, top, bottom, left }) => {
    //modais
    const { isOpen,
        onClose,
        onOpen,
        onToggle
    } = useDisclosure();

    const { isOpen: quizIsOpen,
        onClose: quizOnClose,
        onOpen: quizOnOpen,
        onToggle: quizToggle
    } = useDisclosure();

    const { isOpen: timeIsOpen,
        onClose: timeOnClose,
        onOpen: timeOnOpen,
        onToggle: timeOnToggle
    } = useDisclosure();

    const { isOpen: verificationIsOpen,
        onClose: verificatioOnClose,
        onOpen: verificationOnOpen,
        onToggle: verificationOnToggle
    } = useDisclosure();

    // States
    const [quiz, setQuiz] = useState<IQuizz>({
        name: '',
        questions_id: [{
            _id: '',
            description: '',
            alternatives: ['', '', '', ''],
            answer: 0,
            coins: 0,
            score: [0, 0, 0, 0, 0, 0],
            user_id: ['']
        }],
        category: '',
        dificulty: '',
        videos_id: [{
            user_id: [''],
            name: '',
            url: '',
            nick: '',
            _id: ''
        }],
        total_coins: 0
    } as IQuizz);

    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<IUser>({} as IUser);
    const [buttonValidation, setButtonValidation] = useState(false);
    const [isFirstTimeChallenge, setIsFirstTimeChallenge] = useState(true);
    const [totalCoins, setTotalCoins] = useState(0);
    const [step, setStep] = useState(0);
    const [userQuizCoins, setUserQuizCoins] = useState(0);
    const [onError, setOnError] = useState(false);

    // Metodos
    const getQuiz = async (quizIndex: number) => {
        try {
            const res = await api.get('/quizz');
            const quiz = res.data[quizIndex];

            setQuiz(quiz);

        } catch (error) {
            setOnError(true);
        }
    }


    const getUser = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            const res = await api.get(`/user/${userId}`);
            setUser(res.data);
            setUserQuizCoins(res.data.quiz_coins[quizIndex]);
        } catch (error) {
            setOnError(true);
        }
    }

    const updateQuiz = async (quizId: string) => {
        try {
            await api.patch(`quizz/user/${quizId}`, {
                user_id: user._id
            });
        } catch (error) {
            setOnError(true);
        }
    }

    const confirmationValidation = async () => {
        if (user) {
            setIsLoading(true);
            await updateQuiz(quiz._id);
        }
        setButtonValidation(true);
    }

    const handleModal = async () => {
        try {
            setIsLoading(true);
            const userId = sessionStorage.getItem('@pionira/userId');
            const validation = await api.get(`user/loadingQuiz/${userId}`);
            setIsLoading(false);

            if (!validation.data) {
                timeOnOpen();
            }
            else {
                verificationOnOpen();
            }
        } catch (error) {
            setOnError(true);
        }
    }

    const closeConfirmationModal = () => {
        onToggle();
        verificationOnToggle();
        quizOnOpen();
    }

    //UseEffects
    useEffect(() => {
        getUser();
        getQuiz(quizIndex);
    }, []);

    useEffect(() => {
        const userId = sessionStorage.getItem('@pionira/userId');

        setTotalCoins(quiz.total_coins);

        if (quiz.questions_id[0].user_id.includes(userId as string)) {
            setStep(step + 1);
        }
    }, [quiz])

    return (
        <>
            <Image
                src={buttonValidation || quiz.user_id?.includes(user._id) ? button_on : button_off}
                onClick={onOpen}
                _hover={{
                    cursor: 'pointer',
                    transform: 'scale(1.1)',
                }}
                position="absolute"
                transition='all 0.2s ease'
                width="120px"
                height="120px"
                top={top}
                bottom={bottom}
                left={left}
            />

            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent height="34rem" fontFamily={fontTheme.fonts}>
                    <Box
                        w="25%"
                        bg={colorPalette.primaryColor}
                        h="25rem"
                        position="absolute"
                        zIndex="-1"
                        left="0"
                        top="0"
                        borderTopStartRadius='5px'
                        clipPath="polygon(0% 0%, 55% 0%, 0% 100%)"
                    />
                    <ModalHeader d='flex' justifyContent='center'>
                        <Text fontFamily={fontTheme.fonts} fontSize='60' ml='2.3rem' >{quiz.name}</Text>
                        <ModalCloseButton color={colorPalette.closeButton} size='lg' />
                    </ModalHeader>

                    <ModalBody d='flex' mt='-1rem' flexDirection='column' alignItems='center' justifyContent='space-around' >

                        {
                            isLoading ? (
                                <>
                                    <LoadingState />
                                </>
                            ) : (
                                <>
                                    <Grid gridTemplateColumns='1fr 1fr' w='90%' h='19rem' overflowY='auto'>
                                        {
                                            quiz.videos_id.map(({ _id, user_id, name, url, nick }: {
                                                user_id: string[],
                                                name: string,
                                                url: string,
                                                nick: string
                                                _id: string
                                            }, index) => {
                                                return (
                                                    <div key={index}>
                                                        <VideoModal id={_id} name={name} nick={nick} usersId={user_id} url={url} />
                                                    </div>
                                                )
                                            })
                                        }

                                        <Flex opacity='0'>.</Flex>
                                    </Grid>
                                </>
                            )
                        }

                        <Flex justifyContent="flex-end" w='100%' >
                            <Flex justifyContent="space-between" w='65%' alignItems='center'>
                                <Button
                                    bgColor={colorPalette.confirmButton}
                                    width="50%"
                                    height="4rem"
                                    onClick={() => handleModal()}
                                >
                                    <Text
                                        fontFamily={fontTheme.fonts}
                                        fontWeight="semibold"
                                        fontSize="2rem"
                                    >
                                        Ir para o desafio!
                                    </Text>
                                </Button>
                                <Flex mr='1rem' alignItems='center' fontWeight='bold' fontSize='1.3rem' >
                                    <Image src={Coins} mr='0.5rem' /> {userQuizCoins}/{totalCoins}
                                </Flex>
                            </Flex>
                        </Flex>

                    </ModalBody>
                </ModalContent >
            </Modal >

            {
                quiz ? <QuizModal
                    openModal={quizIsOpen}
                    closeModal={quizOnClose}
                    quiz={quiz}
                    onToggle={quizToggle}
                    firsTimeChallenge={isFirstTimeChallenge}
                    validateUser={confirmationValidation}
                    userQuizCoins={userQuizCoins}
                    quizIndex={quizIndex}
                /> : null
            }

            <TimeModal timeIsOpen={timeIsOpen} timeOnClose={timeOnClose} timeOnToggle={timeOnToggle} />

            <Modal isOpen={verificationIsOpen} onClose={verificatioOnClose} size='3xl' >
                <ModalOverlay />
                <ModalContent height='34rem' display='flex' justifyContent='center' alignItems='center' >
                    <Box
                        w="23%"
                        bg={colorPalette.secondaryColor}
                        h="55vh"
                        position="absolute"
                        zIndex="-1"
                        left="0"
                        top="0"
                        borderTopStartRadius='5px'
                        clipPath="polygon(0% 0%, 100% 0%, 0% 100%)"
                    />
                    <ModalHeader>
                        <ModalCloseButton color={colorPalette.closeButton} size='lg' />
                    </ModalHeader>

                    <ModalBody d='flex' w='80%' flexDirection='column' justifyContent='space-evenly'>
                        {
                            buttonValidation || quiz.user_id?.includes(user._id) ? (
                                <>
                                    <div>
                                        {
                                            userQuizCoins === totalCoins ? (
                                                <>
                                                    <Text textAlign='center' fontFamily={fontTheme.fonts} fontSize='2.4rem' marginTop='2.5rem'>
                                                        Voce já provou por completo seu valor nesse desafio!
                                                    </Text>
                                                    <Text textAlign='center' fontFamily={fontTheme.fonts} color='red' fontSize='1.2rem' mt='1rem'>
                                                        Você não ganhara recompensas por realizar o desafio novamente *
                                                    </Text>
                                                    <Text textAlign='center' fontFamily={fontTheme.fonts} color='red' fontSize='1.2rem' >
                                                        deseja continuar?
                                                    </Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Text textAlign='center' fontFamily={fontTheme.fonts} fontSize='2.4rem' marginTop='2.5rem'>
                                                        Ainda faltam joias para se conquistar!
                                                    </Text>
                                                    <Text textAlign='center' fontFamily={fontTheme.fonts} fontSize='2.1rem' marginTop='0.2rem'>
                                                        Deseja realizar o desafio novamente?
                                                    </Text>
                                                    <Text textAlign='center' fontFamily={fontTheme.fonts} color='red' fontSize='1.2rem' mt='1rem'>
                                                        Joias restantes {totalCoins - userQuizCoins}
                                                    </Text>
                                                </>
                                            )
                                        }
                                    </div>
                                    <Flex justifyContent='space-around'>
                                        <Button h='3.5rem' bg={colorPalette.confirmButton} onClick={() => {
                                            setIsFirstTimeChallenge(false);
                                            closeConfirmationModal();
                                        }}>
                                            realizar desafio denovo!
                                        </Button>
                                        <Button h='3.5rem' w='45%' bg={colorPalette.closeButton} onClick={() => verificationOnToggle()}>
                                            Voltar!
                                        </Button>
                                    </Flex>
                                </>
                            ) : (
                                <>
                                    <Text textAlign='center' fontFamily={fontTheme.fonts} fontSize='2.4rem' marginTop='1rem'>
                                        Está preparado para responder o desafio desse video?
                                    </Text>
                                    <Flex justifyContent='space-around'>
                                        <Button h='3.5rem' bg={colorPalette.confirmButton} onClick={() => closeConfirmationModal()}>
                                            Sim, estou pronto!
                                        </Button>
                                        <Button h='3.5rem' bg={colorPalette.closeButton} onClick={() => verificationOnToggle()}>
                                            Não, não estou pronto!
                                        </Button>
                                    </Flex>
                                </>
                            )
                        }
                    </ModalBody>
                </ModalContent>
            </Modal>
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
        </>
    );
}

export default ModuleModal;
