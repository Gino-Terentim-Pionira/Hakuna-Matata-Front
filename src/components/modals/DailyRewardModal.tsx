import React, { useState, useEffect, FC } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    Box,
    ModalBody,
    Flex,
    Button,
    Text,
    Image,
    Center,
} from "@chakra-ui/react";
import Coins from '../../assets/icons/coinicon.svg'
import api from '../../services/api';
import fontTheme from '../../styles/base';
import LoadingState from '../LoadingState';
import AlertModal from './AlertModal';
import colorPalette from '../../styles/colorPalette';

interface IDailyReward {
    isOpen: boolean;
    onOpen: VoidFunction;
    onClose: VoidFunction;
}

interface userDataProps {
    coins: number,
    lastCollected: number,
    consecutiveDays: number,
}

const DailyRewardModal: FC<IDailyReward> = ({
    isOpen,
}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [onError, setOnError] = useState(false);
    const [coins, setCoins] = useState(0);

    const getUser = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            const user = await api.get(`/user/${userId}`);

            if (user.data.consecutiveDays >= 10) {
                setCoins(25);
            } else if (user.data.consecutiveDays > 0) {
                setCoins(10);
            }

        } catch (error) {
            setOnError(true);
        }
    }

    const coinsRecieved = coins;

    const updateUserDailyReward = async () => {
        try {

            setIsLoading(true);
            await addDailyRewardStatus(coinsRecieved);
            window.location.reload();

        } catch (error) {
            setOnError(true);
        }

    }

    const addDailyRewardStatus = async (value: number) => {
        try {
            const _userId = sessionStorage.getItem('@pionira/userId');
            const res = await api.get<userDataProps>(`/user/${_userId}`);

            const currentDate = new Date();

            await api.patch<userDataProps>(`/user/lastCollected/${_userId}`, {
                coins: res.data.coins + value,
                consecutiveDays: res.data.consecutiveDays + 1,
                lastCollected: currentDate.getTime()
            });

        } catch (error) {
            setOnError(true);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <Modal isOpen={isOpen} onClose={updateUserDailyReward} size="4xl">
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
                                    <Flex direction="column" alignItems='center' mt='1.2rem' mr='1.5rem'>
                                        <Text fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="4rem" color={colorPalette.secondaryColor}>
                                            Mantenha o ritmo!
                                        </Text>
                                        <Text fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="1.8rem" color={colorPalette.secondaryColor}>
                                            Aqui está sua recompensa diária, aproveite!
                                        </Text>
                                    </Flex>
                                    <Flex flexDirection='column' justifyContent='center' alignItems='center'>
                                        {/* first column of modal body  */}
                                        <Flex mt='2rem' ml='5rem' direction="column" alignItems="flex-start" width="75%">
                                            <Text fontFamily={fontTheme.fonts} fontSize="1.7rem">Você ganhou:</Text>
                                        </Flex>

                                        <Flex ml='5rem' direction='column' marginTop='1.5rem' width='75%' >
                                            <Flex w='50%' ml='-5rem' justifyContent='center' alignSelf='center' alignItems='center'>
                                                <Image src={Coins} w='50' h='50' />
                                                <Text ml='1.5rem' fontSize='1.6rem'>{coinsRecieved} Joias</Text>
                                            </Flex>
                                        </Flex>
                                    </Flex>

                                    <Flex w='48%' h="12vh" margin='auto' justifyContent="flex-end" flexDirection="column" alignItems="center">
                                        <Button bgColor={colorPalette.primaryColor} color="white" onClick={() => { updateUserDailyReward() }} w="100%" h="55px" borderRadius="5px" fontSize="2.5rem" fontFamily={fontTheme.fonts}>
                                            Continuar
                                        </Button>
                                    </Flex>
                                </ModalBody>
                            )
                    }
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
    )
}

export default DailyRewardModal;