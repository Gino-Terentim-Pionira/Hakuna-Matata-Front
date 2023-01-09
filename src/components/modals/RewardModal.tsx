import React, { FC, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    Box,
    ModalBody,
    Flex,
    Button,
    Text,
    Grid,
    Image,
    Center
} from "@chakra-ui/react";

// Components
import AlertModal from './AlertModal';
import LoadingState from '../LoadingState';

// Requisitions
import api from '../../services/api';
import { AxiosResponse } from 'axios'

// Styles
import fontTheme from '../../styles/base';
import colorPalette from "../../styles/colorPalette";

// Images
import Coins from '../../assets/icons/coinicon.svg'
import plusIcon from '../../assets/icons/plusIcon.png'
import { errorCases } from '../../utils/errors/errorsCases';

interface IRewardModal {
    isOpen: boolean;
    coins: number;
    score: number[];
    validateUser: VoidFunction;
    passed: boolean;
    correctAnswers: number;
    totalAnswers: number;
    firsTimeChallenge: boolean;
    allQuestionsId?: string[];
    quizIndex: number;
    quizTotalCoins: number;
    userQuizCoins: number;
    ignorance: number;
}

interface userDataProps {
    coins: number,
    status: number[],
    quiz_coins: number[],
    ignorance: number
}

const RewardModal: FC<IRewardModal> = ({
    isOpen,
    coins,
    score,
    validateUser,
    passed,
    correctAnswers,
    totalAnswers,
    firsTimeChallenge,
    allQuestionsId,
    quizIndex,
    quizTotalCoins,
    userQuizCoins,
    ignorance
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [onError, setOnError] = useState(false);

    const coinsRecieved = coins;

    const statusPointsRecieved = [{
        name: "AGI",
        points: score[0]
    },
    {
        name: "LID",
        points: score[1]
    },
    {
        name: "EST",
        points: score[2]
    },
    {
        name: "INO",
        points: score[3]
    },
    {
        name: "GM",
        points: score[4]
    },
    {
        name: "GP",
        points: score[5]
    }];


    const incrementAtStatusIndex = (res: AxiosResponse<userDataProps>) => {
        for (let i = 0; i < 6; i++) {
            res.data.status[i] = res.data.status[i] + statusPointsRecieved[i].points;
        }
        return res.data.status;
    }

    const incrementQuizCoins = (res: AxiosResponse<userDataProps>) => {
        const length = res.data.quiz_coins.length

        for (let i = 0; i < length; i++) {
            if (i === quizIndex) {
                res.data.quiz_coins[i] = res.data.quiz_coins[i] + coins;
            }
        }
        return res.data.quiz_coins;
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
            await addCoinsStatus(coinsRecieved);
            if (allQuestionsId) {
                const userId = sessionStorage.getItem('@pionira/userId');
                const length = allQuestionsId.length;
                for (let i = 0; i < length; i++) {
                    await api.patch(`/questions/${allQuestionsId[i]}`, {
                        user_id: userId
                    });
                }
            }
            firsTimeChallenge ? validateUser() : null

            await updateUserQuizTime();
            window.location.reload();
        } catch (error) {
            setOnError(true);
        }

    }

    const addCoinsStatus = async (value: number) => {
        try {
            const _userId = sessionStorage.getItem('@pionira/userId');
            const res = await api.get<userDataProps>(`/user/${_userId}`);

            await api.patch<userDataProps>(`/user/coins/${_userId}`, {
                coins: res.data.coins + value
            });
            await api.patch<userDataProps>(`/user/quizCoins/${_userId}`, {
                quiz_coins: incrementQuizCoins(res)
            });
            await api.patch<userDataProps>(`/user/status/${_userId}`, {
                status: incrementAtStatusIndex(res)  // first parameter of this func needs to be dynamic
            });
            await api.patch<userDataProps>(`/user/ignorance/${_userId}`, {
                ignorance: (res.data.ignorance - ignorance > 0) ? res.data.ignorance - ignorance : 0,            })
        } catch (error) {
            setOnError(true);
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={updateUserCoins} size="4xl">
                <ModalOverlay />
                <ModalContent paddingBottom='1.5rem' >
                    <Box w="15%" bg={colorPalette.primaryColor} h="50vh" position="absolute" zIndex='0' right="-0.3" top="-0.2" borderTopEndRadius='5px' borderBottomStartRadius='23%' clipPath="polygon(0% 0%, 100% 0%, 100% 80%)" />
                    {
                        isLoading ?
                            (
                                <Center w='100%' h='50vh'>
                                    <LoadingState />
                                </Center>
                            )
                            : (
                                <ModalBody>
                                    {
                                        quizTotalCoins === userQuizCoins ? (
                                            <>
                                                <Flex direction="column" alignItems='center' mt='1.2rem' mr='1.5rem'>
                                                    {
                                                        passed ? (
                                                            <>
                                                                <Text fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="4rem" color={colorPalette.secondaryColor}>
                                                                    Arrasou!
                                                                </Text>
                                                                <Text fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="1.8rem" color={colorPalette.secondaryColor}>
                                                                    Você acertou {correctAnswers} de {totalAnswers} questões!
                                                                </Text>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Text fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="4rem" color={colorPalette.closeButton}>
                                                                    Que pena!
                                                                </Text>
                                                                <Text fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="1.8rem" color={colorPalette.secondaryColor}>
                                                                    Você acertou apenas {correctAnswers} de {totalAnswers} questões!
                                                                </Text>
                                                            </>
                                                        )
                                                    }
                                                </Flex>

                                                <Flex flexDirection='column' justifyContent='center' alignItems='center' w='100%' >
                                                    {/* first column of modal body  */}

                                                    <Flex ml='5rem' direction='column' textAlign='center' marginTop='2rem' width='75%' mr='2rem' >
                                                        <Text fontFamily={fontTheme.fonts} fontSize='2rem' w='93%'>
                                                            Você já conseguiu provar todo o seu valor nesse desafio!
                                                            Assim, não a mais nenhuma recompensa para você!
                                                            Pode seguir adiante, caro viajante!
                                                        </Text>
                                                    </Flex>
                                                </Flex>

                                                <Flex w='48%' h="12vh" margin='auto' mt='4rem' justifyContent="flex-end" flexDirection="column" alignItems="center">
                                                    <Button bgColor={colorPalette.primaryColor} color="white" onClick={updateUserCoins} w="100%" h="55px" borderRadius="5px" fontSize="2.5rem" fontFamily={fontTheme.fonts}>
                                                        Continuar
                                                    </Button>
                                                </Flex>
                                            </>
                                        ) : (
                                            <>
                                                <Flex direction="column" alignItems='center' mt='1.2rem'>
                                                    {
                                                        passed ? (
                                                            <>
                                                                <Text fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="4rem" color={colorPalette.secondaryColor}>
                                                                    Arrasou!
                                                                </Text>
                                                                <Text fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="1.8rem" color={colorPalette.secondaryColor}>
                                                                    {
                                                                        correctAnswers === totalAnswers ? `Voce dominou por completo esse desafio! Parabens!`
                                                                            : `Você acertou ${correctAnswers} de ${totalAnswers} questões!`
                                                                    }
                                                                </Text>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Text fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="4rem" color={colorPalette.closeButton}>
                                                                    Que pena!
                                                                </Text>
                                                                <Text fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="1.8rem" color={colorPalette.secondaryColor}>
                                                                    Você acertou apenas {correctAnswers} de {totalAnswers} questões!
                                                                </Text>
                                                                <Text fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="1.2rem" color={colorPalette.secondaryColor}>
                                                                    Que tal rever os vídeos e tentar novamente daqui a 30 minutos?
                                                                </Text>
                                                            </>
                                                        )
                                                    }
                                                </Flex>

                                                <Flex flexDirection='column' justifyContent='center' alignItems='center'>
                                                    {/* first column of modal body  */}
                                                    <Flex mt='2rem' ml='5rem' direction="column" alignItems="flex-start" width="75%">
                                                        <Text fontFamily={fontTheme.fonts} fontSize="1.7rem">Você ganhou:</Text>
                                                    </Flex>

                                                    <Flex ml='5rem' direction='column' marginTop='1.5rem' width='75%' >
                                                        <Grid gridTemplateColumns='1fr 1fr 1fr' gridColumnGap='2rem' gridRowGap='2rem'>
                                                            {
                                                                statusPointsRecieved.map((status, index) => {
                                                                    return (
                                                                        <Flex key={index} alignItems='center'>
                                                                            <Image src={plusIcon} alt='plusIcon' w='39' h='39' />
                                                                            <Text textAlign='center' fontFamily={fontTheme.fonts} fontSize="1.6rem" ml='0.5rem' > {status.points} {status.name} </Text>
                                                                        </Flex>
                                                                    )
                                                                })
                                                            }
                                                        </Grid>

                                                        <Flex w='50%' mt='2.5rem' ml='-5rem' justifyContent='center' alignSelf='center' alignItems='center'>
                                                            <Image src={Coins} w='50' h='50' />
                                                            <Text ml='1.5rem' fontSize='1.6rem'>{coinsRecieved} Joias</Text>
                                                        </Flex>
                                                    </Flex>
                                                </Flex>

                                                <Flex w='48%' h="12vh" margin='auto' justifyContent="flex-end" flexDirection="column" alignItems="center">
                                                    <Button bgColor={colorPalette.primaryColor} color="white" onClick={updateUserCoins} w="100%" h="55px" borderRadius="5px" fontSize="2.5rem" fontFamily={fontTheme.fonts}>
                                                        Continuar
                                                    </Button>
                                                </Flex>
                                            </>
                                        )
                                    }

                                </ModalBody>
                            )
                    }
                </ModalContent>
            </Modal>
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
    )
}

export default RewardModal;
