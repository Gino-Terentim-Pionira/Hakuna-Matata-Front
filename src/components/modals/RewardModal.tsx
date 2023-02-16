import React, { FC } from 'react';
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
    ModalCloseButton
} from "@chakra-ui/react";

// Components
import AlertModal from './AlertModal';
import LoadingState from '../LoadingState';

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
    quizTotalCoins: number;
    userQuizCoins: number;
    ignorance: number;
    confirmFunction: VoidFunction;
    loading: boolean;
    error: boolean;
    title: string;
    subtitle: string;
    passed: boolean;
    icon: string;
}


const RewardModal: FC<IRewardModal> = ({
    isOpen,
    coins,
    score,
    quizTotalCoins,
    userQuizCoins,
    confirmFunction,
    loading,
    error,
    title,
    subtitle,
    passed,
    icon
}) => {
    const statusPointsRecieved = [{
        name: "Agilidade",
        points: score[0]
    },
    {
        name: "Liderança",
        points: score[1]
    }];

    return (
        <>
            <Modal isOpen={isOpen} onClose={confirmFunction}>
                <ModalOverlay />
                <ModalContent h='478px' w='418px'  >
                    <ModalCloseButton color={'#E55454'} size='lg' />
                    {
                        loading ?
                            (
                                <Center w='100%' h='50vh'>
                                    <LoadingState />
                                </Center>
                            )
                            : (
                                <ModalBody>
                                    <Flex flexDirection='column' height='100%'>
                                        <Center 
                                            backgroundColor='#F5F5F5' 
                                            width='120px'
                                            height='120px'
                                            borderRadius='1000px'
                                            marginTop='48px'
                                            alignSelf='center'
                                        >
                                            <Image 
                                                src={icon} 
                                                w='96.51px' 
                                                h='80.3px' />
                                        </Center>
                                        <Center 
                                            flexDirection='column'
                                            marginTop='8px'
                                            lineHeight='22px'
                                            alignSelf='center'
                                            width='300px'
                                        >
                                            <Text
                                            fontSize='20px'
                                            fontWeight='bold'
                                            fontFamily={fontTheme.fonts}
                                            color={passed ? '#6D99F2' : '#F47070'}
                                            >
                                                {title}
                                            </Text>
                                            <Text
                                                fontSize='18px'
                                                fontFamily={fontTheme.fonts}
                                                color='#9D9D9D'
                                                textAlign='center'
                                            >
                                                {subtitle}
                                            </Text>
                                        </Center>
                                        <Center 
                                            flexDirection='column'
                                            marginTop='26px'
                                        >
                                            {
                                                quizTotalCoins === userQuizCoins ? (
                                                    <Text textAlign='center' fontFamily={fontTheme.fonts} fontSize='18px' w='93%'>
                                                        Você já conseguiu provar todo o seu valor nesse desafio!
                                                        Assim, não a mais nenhuma recompensa para você!
                                                        Pode seguir adiante, caro viajante!
                                                    </Text>
                                                ) : (
                                                    <Box>
                                                        {
                                                            statusPointsRecieved.map((status, index) => {
                                                                if (status.points > 0) return (
                                                                    <Flex 
                                                                        key={index}
                                                                        alignItems='center'
                                                                    >
                                                                        <Text 
                                                                            textAlign='center' 
                                                                            fontFamily={fontTheme.fonts} 
                                                                            fontSize="24px" 
                                                                            fontWeight='semibold'
                                                                            color='#0B67A1'
                                                                        > 
                                                                            + {status.points} {status.name} 
                                                                        </Text>
                                                                        <Image 
                                                                            src={plusIcon} 
                                                                            alt='plusIcon' 
                                                                            w='30' 
                                                                            h='30' 
                                                                        />
                                                                    </Flex>
                                                                )
                                                            })
                                                        }
                                                        <Flex 
                                                            alignItems='center'
                                                            marginTop='16px'
                                                        >
                                                            <Text 
                                                                textAlign='center' 
                                                                fontFamily={fontTheme.fonts} 
                                                                fontSize="24px" 
                                                                fontWeight='semibold'
                                                                color='#EDA641'
                                                            > 
                                                                + {coins} Joias
                                                            </Text>
                                                            <Image 
                                                                src={Coins} 
                                                                alt='Coins' 
                                                                w='30' 
                                                                h='30' 
                                                                marginLeft='5px'
                                                            />
                                                        </Flex>
                                                    </Box>
                                                )
                                                
                                            }
                                        </Center>
                                        <Center>
                                            <Button
                                                width='300px'
                                                height='50px'
                                                background={colorPalette.primaryColor}
                                                color={colorPalette.buttonTextColor}
                                                fontSize='1.7rem'
                                                onClick={confirmFunction}
                                                _hover={{}}
                                                loadingText="Enviando"
                                                spinnerPlacement='end'
                                            >
                                                Continuar
                                            </Button>
                                        </Center>
                                    </Flex>
                                </ModalBody>
                            )
                    }
                </ModalContent>
            </Modal>
            <AlertModal
                isOpen={error}
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
