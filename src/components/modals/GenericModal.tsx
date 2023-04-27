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
import Cheetah from '../../assets/icons/cheetahblink.svg'

interface IGenericModal {
    genericModalInfo: {
        title: string;
        titleColor: string;
        subtitle: string;
        icon: string;
        coins?: number;
        status?: number[];
    },
    isOpen: boolean;
    confirmFunction: VoidFunction;
    loading: boolean;
    error: boolean;
}


const GenericModal: FC<IGenericModal> = ({
    isOpen,
    genericModalInfo,
    confirmFunction,
    loading,
    error,
}) => {
    const { title, titleColor, subtitle, icon, coins, status } = genericModalInfo;

    const statusPointsRecieved = [{
        name: "Agilidade",
        points: status && status[0]
    },
    {
        name: "Liderança",
        points: status && status[1]
    }];

    const coinsValidation = coins && coins !== 0;
    const statusValidation = statusPointsRecieved[0].points && statusPointsRecieved[0].points !== 0;

    return (
        <>
            <Modal isOpen={isOpen} onClose={confirmFunction}>
                <ModalOverlay />
                <ModalContent fontSize={fontTheme.fonts} minHeight="437px" h='fit-content' w='418px'  >
                    <ModalCloseButton color={colorPalette.closeButton} size='lg' />
                    {
                        loading ?
                            (
                                <Center w='100%' h='50vh'>
                                    <LoadingState />
                                </Center>
                            )
                            : (
                                <ModalBody paddingBottom="28px" display="flex" justifyContent="space-between" alignItems='center' flexDirection='column' height='100%'>
                                    <Center flexDirection='column'>
                                        <Center
                                            backgroundColor='#F5F5F5'
                                            width='120px'
                                            height='120px'
                                            borderRadius='1000px'
                                            marginTop='48px'
                                            alignSelf='center'
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Image
                                                src={icon}
                                                marginLeft={icon === Cheetah ? '8px' : undefined}
                                                marginTop={icon === Cheetah ? '8px' : undefined}
                                            />
                                        </Center>
                                        <Box
                                            marginTop='8px'
                                            lineHeight='22px'
                                            width='300px'
                                            textAlign="center"
                                        >
                                            <Text
                                                fontSize='20px'
                                                fontWeight='bold'
                                                fontFamily={fontTheme.fonts}
                                                color={titleColor}
                                            >
                                                {title}
                                            </Text>
                                            <Text
                                                fontSize='18px'
                                                fontFamily={fontTheme.fonts}
                                                color='#9D9D9D'
                                                textAlign='center'
                                                marginTop='8px'
                                            >
                                                {subtitle}
                                            </Text>
                                        </Box>
                                        <Center
                                            flexDirection='column'
                                            marginTop='26px'
                                        >
                                            {
                                                statusValidation ? (statusPointsRecieved.map((status, index) => {
                                                    if (status.points && status.points > 0) return (
                                                        <Flex
                                                            key={index}
                                                            alignItems='center'
                                                            marginTop={index >= 1 ? '4px' : undefined}
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
                                                })) : null
                                            }
                                            {
                                                coinsValidation ? <Flex
                                                    alignItems='center'
                                                    marginTop={statusPointsRecieved[0].points ? '8px' : undefined}
                                                    marginBottom='55px'
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
                                                </Flex> : null
                                            }
                                        </Center>
                                    </Center>
                                    <Button
                                        width='300px'
                                        height='50px'
                                        background={colorPalette.primaryColor}
                                        color={colorPalette.buttonTextColor}
                                        fontSize='28px'
                                        fontFamily={fontTheme.fonts}
                                        onClick={confirmFunction}
                                        loadingText="Enviando"
                                        spinnerPlacement='end'
                                    >
                                        Continuar
                                    </Button>
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

export default GenericModal;
