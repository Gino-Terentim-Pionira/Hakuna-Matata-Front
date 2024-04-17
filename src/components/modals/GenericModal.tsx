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
import { REWARD_MODAL_TEXT, GENERIC_MODAL_TEXT, LOAD_BUTTON } from '../../utils/constants/buttonConstants';
import { getStatusColor } from '../../utils/statusUtils';
import linkedin from '../../assets/icons/social/linkedin.png';

interface IGenericModal {
    genericModalInfo: {
        title: string;
        titleColor: string;
        subtitle: string;
        textBody?: string;
        icon: string;
        iconBackground?: string;
        coins?: number;
        status?: {
            name: string,
            points: number
        };
        firstButton?: string;
        secondButton?: string;
        alert?: string;
        video_names?: string[];
        isSocial?: boolean
    },
    isOpen: boolean;
    confirmFunction: VoidFunction;
    secondFunction?: VoidFunction;
    closeFunction?: VoidFunction;
    loading: boolean;
    error: boolean;
    isStaticModal?: boolean
}


const GenericModal: FC<IGenericModal> = ({
    isOpen,
    genericModalInfo,
    confirmFunction,
    secondFunction,
    closeFunction,
    loading,
    error,
    isStaticModal = false
}) => {
    const { title, titleColor, subtitle, icon, coins, status, video_names } = genericModalInfo;
    const [isDisabled, setIsDisabled] = useState(false);

    const coinsValidation = coins && coins !== 0;
    const statusValidation = status && status.points > 0;
    const videosValidation = video_names && video_names.length > 0

    const defineButtonText = () => {
        const costumizedText = genericModalInfo.firstButton;
        if (costumizedText) {
            return costumizedText;
        } else if (coinsValidation || statusValidation) {
            return REWARD_MODAL_TEXT;
        } else {
            return GENERIC_MODAL_TEXT;
        }
    }

    const handleClose = () => {
        if (!isDisabled || isStaticModal) { // Um modal estático não precisará da limitação dos cliques pois não dá recompensa
            setIsDisabled(true);
            closeFunction ? closeFunction() : confirmFunction();
        }
    }

    const handleButtonClick = (action: VoidFunction | undefined) => {
        if (!isDisabled || isStaticModal) { // Um modal estático não precisará da limitação dos cliques pois não dá recompensa
            setIsDisabled(true);
            action && action();
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose}>
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
                                            bg={genericModalInfo.iconBackground ? genericModalInfo.iconBackground : '#F5F5F5'}
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
                                                width='88px'
                                                height='88px'
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
                                            {
                                                genericModalInfo.alert && <Text
                                                    textAlign='center'
                                                    fontFamily={fontTheme.fonts}
                                                    fontSize="14px"
                                                    fontWeight='semibold'
                                                    color={colorPalette.alertText}
                                                    marginTop='16px'
                                                >
                                                    {genericModalInfo.alert}
                                                </Text>
                                            }
                                        </Box>
                                        <Center
                                            flexDirection='column'
                                            marginTop='16px'
                                            minHeight='40px'
                                            marginBottom='55px'
                                        >
                                            {
                                                genericModalInfo.textBody && <Text
                                                    fontSize='18px'
                                                    fontFamily={fontTheme.fonts}
                                                    color='#9D9D9D'
                                                    textAlign='center'
                                                >
                                                    {genericModalInfo.textBody}
                                                </Text>
                                            }
                                            {
                                                statusValidation ? (
                                                    <Flex
                                                        alignItems='center'
                                                        marginTop={'4px'}
                                                    >
                                                        <Text
                                                            textAlign='center'
                                                            fontFamily={fontTheme.fonts}
                                                            fontSize="24px"
                                                            fontWeight='semibold'
                                                            color={getStatusColor(status?.name as string)}
                                                        >
                                                            + {status?.points} {status?.name}
                                                        </Text>
                                                        <Image
                                                            src={plusIcon}
                                                            alt='plusIcon'
                                                            w='30'
                                                            h='30'
                                                        />
                                                    </Flex>
                                                ) : null
                                            }
                                            {
                                                coinsValidation ? <Flex
                                                    alignItems='center'
                                                    marginTop={statusValidation ? '8px' : undefined}
                                                >
                                                    <Text
                                                        textAlign='center'
                                                        fontFamily={fontTheme.fonts}
                                                        fontSize="24px"
                                                        fontWeight='semibold'
                                                        color={colorPalette.gold}
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
                                            {
                                                videosValidation && <Flex
                                                    width='295px'
                                                    flexDirection='column'
                                                    textAlign='center'
                                                    marginTop='32px'
                                                    fontFamily={fontTheme.fonts}
                                                >
                                                    <Text
                                                        fontSize='18px'
                                                        color={colorPalette.secundaryGrey}
                                                        marginBottom='8px'
                                                    >
                                                        Para acertar as
                                                        <Text
                                                            as='span'
                                                            color={colorPalette.closeButton}
                                                            fontWeight='bold'
                                                        > questões que errou</Text>
                                                        , veja esses vídeos novamente:
                                                    </Text>

                                                    <Text
                                                        color={colorPalette.secundaryGrey}
                                                        fontSize='16px'
                                                        fontWeight='bold'
                                                    >
                                                        {video_names?.join(", ")}
                                                    </Text>

                                                </Flex>
                                            }
                                        </Center>
                                    </Center>
                                    <Button
                                        width='300px'
                                        height='50px'
                                        background={colorPalette.primaryColor}
                                        color={colorPalette.buttonTextColor}
                                        fontSize='24px'
                                        fontFamily={fontTheme.fonts}
                                        onClick={() => handleButtonClick(confirmFunction)}
                                        loadingText={LOAD_BUTTON}
                                        spinnerPlacement='end'
                                    >
                                        {
                                            defineButtonText()
                                        }
                                    </Button>
                                    {
                                        genericModalInfo.secondButton &&
                                        <Button
                                            width='300px'
                                            height='50px'
                                            marginTop='24px'
                                            background={genericModalInfo.isSocial ? 'linkedin.500' : colorPalette.inactiveButton}
                                            color={colorPalette.buttonTextColor}
                                            fontSize='24px'
                                            fontFamily={fontTheme.fonts}
                                            onClick={() => handleButtonClick(secondFunction)}
                                            loadingText={LOAD_BUTTON}
                                            spinnerPlacement='end'
                                            leftIcon={
                                                genericModalInfo.isSocial ? (
                                                    <Image
                                                        width='24px'
                                                        height='24px'
                                                        src={linkedin}
                                                    />
                                                ) : <></>
                                            }
                                        >
                                            {
                                                genericModalInfo.secondButton
                                            }
                                        </Button>
                                    }
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
