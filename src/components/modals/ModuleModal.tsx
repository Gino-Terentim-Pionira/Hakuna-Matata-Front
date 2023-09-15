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
    useDisclosure,
    Image,
    Tooltip
} from "@chakra-ui/react";
import { useUser, useModule } from '../../hooks';
import { AxiosResponse } from 'axios';

// Components
import QuizModal from './QuizModal';
import LoadingState from '../LoadingState';
import VideoModal from './VideoModal';
import TimeModal from './TimeModal';
import AlertModal from './AlertModal';

// Requisitions
import api from '../../services/api';
import { verifyModuleCooldown } from '../../services/moduleCooldown';

// Styles
import fontTheme from '../../styles/base';
import styled from 'styled-components';

// Images
import button_on from '../../assets/icons/button_on.png';
import button_off from '../../assets/icons/button_off.png';
import button_blocked from '../../assets/icons/button_blocked.png';
import colorPalette from '../../styles/colorPalette';
import { errorCases } from '../../utils/errors/errorsCases';
import VideoIcon from '../../assets/icons/video.png';
import { BLOCKED_MODULE, COMPLETE_MODULE, INCOMPLETE_MODULE } from '../../utils/constants/constants';

interface IModuleModal {
    quizIndex: number;
    top?: string;
    bottom?: string;
    left?: string;
    isBlocked?: boolean;
    blockedFunction?: VoidFunction;
}

const GridContainer = styled.div`
    display: grid;
    margin-left: 47px;
    grid-template-columns: 1fr 1fr 1fr;
    width: 1100px;
    max-height: 80vh;
    overflow-y: auto;
    padding-bottom: 116px;
    padding-left: 8px;
    grid-row-gap: 40px;
    grid-column-gap: 48px;

    @media (max-width: 1100px) {
        width: 700px;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 48px;
    }

    @media (max-width: 780px) {
        grid-template-columns: 1fr;

        > .videoCardContainer {
            margin: auto;
        }
    }
`;

const ModuleModal: FC<IModuleModal> = ({ quizIndex, top, bottom, left, isBlocked, blockedFunction }) => {
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
        onOpen: timeOnOpen
    } = useDisclosure();

    const { isOpen: verificationIsOpen,
        onClose: verificatioOnClose,
        onOpen: verificationOnOpen,
        onToggle: verificationOnToggle
    } = useDisclosure();

    const { isOpen: videoIsOpen,
        onClose: videoOnClose,
        onOpen: videoOnOpen,
        onToggle: videoOnToggle
    } = useDisclosure();


    // States
    const { moduleData, getNewModuleInfo } = useModule();
    const moduleInfo = moduleData[quizIndex];
    const { userData, getNewUserInfo } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [buttonValidation, setButtonValidation] = useState(false);
    const [isFirstTimeChallenge, setIsFirstTimeChallenge] = useState(true);
    const [totalCoins, setTotalCoins] = useState(0);
    const [step, setStep] = useState(0);
    const [onError, setOnError] = useState(false);
    const [videoInfo, setVideoInfo] = useState({ id: '', name: '', url: '', coins: 0 });
    const [remainingCoins, setRemainingCoins] = useState(0);
    // Metodos
    const addUserIdToModule = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            await api.patch(`user/addmodule/${userId}`, {
                module_id: moduleInfo._id
            });
            await getNewModuleInfo();
        } catch (error) {
            setOnError(true);
        }
    }

    const confirmationValidation = async () => {
        if (userData) {
            setIsLoading(true);
            await addUserIdToModule();
            setIsLoading(false);
        }
        setButtonValidation(true);
    }

    const handleModal = async () => {
        try {
            setIsLoading(true);
            const userId = sessionStorage.getItem('@pionira/userId');
            const response: AxiosResponse = await verifyModuleCooldown(userId as string, moduleInfo._id);
            

            if (!response.data.validation) {
                setIsLoading(false);
                timeOnOpen();
            }
            else { // Fazer requisição de moedas faltantes aqui
                const module_name = encodeURI(moduleInfo.module_name);
                const coins = await api.get(`module/remainingCoins/${module_name}`);
                setRemainingCoins(coins.data);
                setIsLoading(false);
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

    const handleVideoModal = (id: string, name: string, url: string, coins: number) => {
        setVideoInfo({ id, name, url, coins });
        videoOnOpen();
    }

    const defineLabel = () => {
        if (isBlocked) {
            return BLOCKED_MODULE;
        } else if (userData.module_id?.includes(moduleInfo._id)) {
            return COMPLETE_MODULE(moduleInfo.module_name);
        } else {
            return INCOMPLETE_MODULE(moduleInfo.module_name);
        }
    }

    useEffect(() => {
        setTotalCoins(moduleInfo.total_coins);
        if(userData.question_id.includes(moduleInfo.questions_id[0]._id)) {
            setStep(step + 1);

        };
    }, [moduleInfo])

    return (
        <>
            <Tooltip 
                hasArrow
                placement='top'
                gutter={12}
                label={defineLabel()}
            >
                <Image
                    src={isBlocked ? button_blocked : (buttonValidation || userData.module_id?.includes(moduleInfo._id) ? button_on : button_off)}
                    onClick={isBlocked ? blockedFunction : onOpen}
                    _hover={{
                        cursor: 'pointer',
                        transform: 'scale(1.1)',
                    }}
                    position="absolute"
                    transition='all 0.2s ease'
                    width={[116, null, null, null, null, 180]}
                    height={[70, null, null, null, null, 110]}
                    top={top}
                    bottom={bottom}
                    left={left}
                />
            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose} size="full">
                <ModalOverlay />
                <ModalContent height="34rem" fontFamily={fontTheme.fonts}>
                    <Box
                        w="150px"
                        bg={colorPalette.primaryColor}
                        h="100%"
                        position="absolute"
                        zIndex="-1"
                        left="0"
                        top="0"
                        borderTopStartRadius='5px'
                    />
                    <ModalHeader d='flex' justifyContent='center'>
                        <Text color={colorPalette.textColor} fontFamily={fontTheme.fonts} fontSize='60' ml='2.3rem' >{moduleInfo.module_name}</Text>
                        <ModalCloseButton color={colorPalette.closeButton} size='lg' />
                    </ModalHeader>

                    <ModalBody display="flex" flexDirection='column' alignItems='center' >
                        {
                            isLoading ? (
                                <Box width="100%" h="90%">
                                    <LoadingState />
                                </Box>
                            ) : (
                                    <>
                                        <GridContainer>
                                            {
                                                moduleInfo.videos_id.map(({ _id, name, url, nick, coins }: {
                                                    name: string,
                                                    url: string,
                                                    nick: string,
                                                    _id: string,
                                                    coins: number
                                                }) => {
                                                    return (
                                                        <Flex
                                                            className='videoCardContainer'
                                                            width="297px"
                                                            height="334px"
                                                            borderRadius="8px"
                                                            flexDir="column"
                                                            boxShadow="0px 4px 14px rgba(0, 0, 0, 0.25)"
                                                            bg={"#FEFEFE"}
                                                            onClick={() => handleVideoModal(_id, name, url, coins)}
                                                            transition="ease 200ms"
                                                            _hover={{
                                                                cursor: 'pointer',
                                                                opacity: '0.8'
                                                            }}
                                                            key={_id}
                                                        >
                                                            <Flex justifyContent="center" alignItems="center" borderTopRadius="8px" width="100%" height="147px" bg={colorPalette.textColor}>
                                                                <Image height='59px' src={VideoIcon} alt="Icone de video" />
                                                            </Flex>
                                                            <Flex flexDir="column" paddingX="16px" marginTop="24px">
                                                                <Text color={colorPalette.textColor} fontFamily={fontTheme.fonts} fontSize="24px" fontWeight="500" >
                                                                    {name}
                                                                </Text>
                                                                <Text color={colorPalette.secundaryGrey} fontFamily={fontTheme.fonts} fontSize="16px" >
                                                                    {nick}
                                                                </Text>
                                                                {
                                                                    userData?.video_id.includes(_id) && <Text color={colorPalette.correctAnswer} fontFamily={fontTheme.fonts} fontSize="14px" fontWeight="bold" marginTop="8px">
                                                                        Já assistido
                                                                    </Text>
                                                                }

                                                            </Flex>
                                                        </Flex>
                                                    )
                                                })
                                            }
                                        </GridContainer>
                                    </>
                                )
                        }
                        {
                            !isLoading && <Button
                                display="Button"
                                justifyContent="center"
                                alignItems="center"
                                boxShadow="5px 5px 5px rgba(0, 0, 0, 0.25)"
                                margin="auto"
                                bottom="56px"
                                position='absolute'
                                bg={colorPalette.progressOrange}
                                width="330px"
                                height="65px"
                                borderRadius="16px"
                                _hover={{
                                    transform: 'scale(1.05)',
                                }}
                                onClick={() => handleModal()}
                            >
                                <Text
                                    fontFamily={fontTheme.fonts}
                                    fontSize="30px"
                                    color={colorPalette.textColor}
                                >
                                    Ir para o desafio!
                                </Text>
                            </Button>
                        }
                    </ModalBody>
                </ModalContent >
            </Modal >

            {
                moduleInfo ? <QuizModal
                    openModal={quizIsOpen}
                    closeModal={quizOnClose}
                    moduleInfo={moduleInfo}
                    onToggle={quizToggle}
                    firsTimeChallenge={isFirstTimeChallenge}
                    validateUser={confirmationValidation}
                    userQuizCoins={totalCoins - remainingCoins}
                /> : null
            }

            <TimeModal timeIsOpen={timeIsOpen} timeOnClose={timeOnClose} />

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
                            buttonValidation || userData.module_id?.includes(moduleInfo._id) ? (
                                <>
                                    <div>
                                        {
                                            remainingCoins == 0 ? ( // Mudar essa comparação já que o usuário não terá mais esse atributo
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
                                                            Ainda faltam Joias para se conquistar!
                                                    </Text>
                                                        <Text textAlign='center' fontFamily={fontTheme.fonts} fontSize='2.1rem' marginTop='0.2rem'>
                                                            Deseja realizar o desafio novamente?
                                                    </Text>
                                                        <Text textAlign='center' fontFamily={fontTheme.fonts} color='red' fontSize='1.2rem' mt='1rem'>
                                                            Joias restantes {remainingCoins}
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
                                            Realizar desafio denovo!
                                        </Button>
                                        <Button h='3.5rem' w='45%' bg={colorPalette.closeButton} onClick={() => verificationOnToggle()}>
                                            Voltar!
                                        </Button>
                                    </Flex>
                                </>
                            ) : (
                                    <>
                                        <Text textAlign='center' fontFamily={fontTheme.fonts} fontSize='2.4rem' marginTop='1rem'>
                                            Está preparado para responder o desafio desse módulo?
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
            <VideoModal
                id={videoInfo.id}
                name={videoInfo.name}
                url={videoInfo.url}
                coins={videoInfo.coins}
                videoIsOpen={videoIsOpen}
                videoOnClose={videoOnClose}
                videoOnToggle={videoOnToggle}
                updateQuiz={getNewUserInfo}
            />
        </>
    );
}

export default ModuleModal;
