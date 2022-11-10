import React, { useEffect, useState } from 'react';
import {
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    Box,
    ModalBody,
    Flex,
    Button,
    Text,
    Image,
} from '@chakra-ui/react';

// Components
import AlertModal from './AlertModal';

// Requisitions
import api from '../../services/api';

// Styles
import fontTheme from '../../styles/base';
import { motion } from 'framer-motion';
import colorPalette from "../../styles/colorPalette";

// Images
import Coins from '../../assets/icons/coinicon.svg';
import rewardChest from "../../assets/icons/bau.png";

interface userDataProps {
    coins: number
}

const RandomRewardModal = () => {
    const [randomNumber, setRandomNumber] = useState(false);
    const [coins, setCoins] = useState(0);
    const [onError, setOnError] = useState(false);

    const { isOpen, onOpen } = useDisclosure();

    const getUser = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            const user = await api.get(`/user/${userId}`);
            const random = Math.floor(Math.random() * 100);
            if (random < user.data.luck) {
                setRandomNumber(true);
                if (user.data.ignorance <= 30) {
                    setCoins(120);
                } else if (user.data.ignorance < 50) {
                    setCoins(80);
                } else if (user.data.ignorance < 80) {
                    setCoins(50);
                } else {
                    setCoins(20);
                }
            }

        } catch (error) {
            setOnError(true);
        }
    }

    const updateUserCoins = async () => {
        try {

            await addCoinsStatus(coins);
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

        } catch (error) {
            setOnError(true);
        }
    }


    useEffect(() => {
        getUser();
    }, []);

    return (
        <Box width="18%" >
            {
                randomNumber ? (
                    <>
                        <motion.div
                            animate={{ scale: [0.8, 1, 0.8] }}
                            transition={{ loop: Infinity }}
                        >
                            <Image _hover={{
                                cursor: 'pointer',
                            }} onClick={() => { onOpen(); }} src={rewardChest} width='32rem' />
                            <Modal isOpen={isOpen} onClose={updateUserCoins} size="4xl">
                                <ModalOverlay />
                                <ModalContent paddingBottom='1.5rem' >
                                    <Box w="15%" bg={colorPalette.primaryColor} h="50vh" position="absolute" zIndex='0' right="-0.3" top="-0.2" borderTopEndRadius='5px' borderBottomStartRadius='23%' clipPath="polygon(0% 0%, 100% 0%, 100% 80%)" />
                                    <ModalBody>
                                        <Flex direction="column" alignItems='center' mt='1.2rem' mr='1.5rem'>
                                            <Text fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="4rem" color={colorPalette.secondaryColor}>
                                                Opa! O que é isso??
                                            </Text>
                                            <Text fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="1.8rem" color={colorPalette.secondaryColor}>
                                                Ao explorar a Savana você se deparou com um baú cheio de joias!
                                            </Text>
                                        </Flex>
                                        <Flex flexDirection='column' justifyContent='center' alignItems='center'>
                                            {/* first column of modal body  */}
                                            <Flex mt='2rem' ml='5rem' direction="column" alignItems="flex-start" width="75%">
                                                <Text fontFamily={fontTheme.fonts} fontSize="1.7rem">Você ganhou:</Text>
                                            </Flex>

                                            <Flex ml='5rem' direction='column' marginTop='1.5rem' width='75%' >
                                                <Flex w='50%' mt='2.5rem' ml='-5rem' justifyContent='center' alignSelf='center' alignItems='center'>
                                                    <Image src={Coins} w='50' h='50' />
                                                    <Text ml='1.5rem' fontSize='1.6rem'>{coins} Joias</Text>
                                                </Flex>
                                            </Flex>
                                        </Flex>

                                        <Flex w='48%' h="12vh" margin='auto' justifyContent="flex-end" flexDirection="column" alignItems="center">
                                            <Button bgColor={colorPalette.primaryColor} color="white" onClick={updateUserCoins} w="100%" h="55px" borderRadius="5px" fontSize="2.5rem" fontFamily={fontTheme.fonts}>
                                                Continuar
                                            </Button>
                                        </Flex>
                                    </ModalBody>
                                </ModalContent>
                            </Modal>
                        </motion.div>
                    </>
                ) : (
                    null
                )
            }
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
        </Box>
    );
}

export default RandomRewardModal;
