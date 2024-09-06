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
import { useSoundtrack } from '../../hooks/useSoundtrack';
import { AxiosResponse } from 'axios';

// Components
import LoadingState from '../LoadingState';
import VideoModal from './VideoModal';
import TimeModal from './TimeModal';
import AlertModal from './AlertModal';
import ModuleQuiz from '../Quiz/ModuleQuiz';

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
import { MODULE_INFO } from '../../utils/constants/mouseOverConstants';
import { getStatusPoints } from '../../utils/statusUtils';
import { getUserAnsweredQuestions } from "../../services/module";

interface IModuleModal {
    quizIndex: number;
    top?: string;
    bottom?: string;
    left?: string;
    isBlocked?: boolean;
    blockedFunction?: VoidFunction;
    openFinalModuleNarrative: VoidFunction;
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

const ModuleModal: FC<IModuleModal> = ({ quizIndex, top, bottom, left, isBlocked, blockedFunction, openFinalModuleNarrative }) => {
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
    } = useDisclosure();


    // States
    const { moduleData } = useModule();
    const moduleInfo = moduleData[quizIndex];
    const IS_MODULE_INFO_HAS_QUESTIONS = moduleInfo.questions_id.length > 0;
    const { userData, getNewUserInfo } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [buttonValidation, setButtonValidation] = useState(false);
    const [totalCoins, setTotalCoins] = useState(0);
    const [onError, setOnError] = useState(false);
    const { pauseSoundtrack, playSoundtrack } = useSoundtrack();
    const [videoInfo, setVideoInfo] = useState({ id: '', name: '', url: '', coins: 0, description: '' });
    const [remainingCoins, setRemainingCoins] = useState(0);
    const [iconInfo, setIconInfo] = useState({
        label: moduleInfo.module_name,
        description: "",
        availabilityInfo: "",
        availabilityColor: ""
    })
    const [image, setImage] = useState(button_off);

    const moduleStatusName = moduleInfo.status_requirement.status_name;
    const userStatus = getStatusPoints(userData, moduleStatusName);
    const moduleStatus = moduleInfo.status_requirement.points;
    const statusRequirement = userStatus >= moduleStatus;

    // Metodos
    const addUserIdToModule = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            await api.patch(`user/addmodule/${userId}`, {
                module_id: moduleInfo._id
            });
            await getNewUserInfo();
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

    const handleVideoModal = (id: string, name: string, url: string, coins: number, description: string) => {
        setVideoInfo({ id, name, url, coins, description });
        videoOnOpen();
        pauseSoundtrack();
    }

    const defineProperties = async () => {
        const totalNumberOfQuestions = moduleInfo.questions_id.length;

        if (isBlocked || !statusRequirement) {
            if(quizIndex === 0) {
                setIconInfo({
                    label: "Módulo indisponível",
                    ...MODULE_INFO('blocked', 0,0),
                    description: "Este módulo não está disponível ainda, aguarde para mais atualizações..."
                })
            } else {
                setIconInfo({
                    ...iconInfo,
                    ...MODULE_INFO('blocked', 0,0)
                })
            }
            setImage(button_blocked);
        } else if (buttonValidation || userData.module_id?.includes(moduleInfo._id)) {
            setIconInfo({
                ...iconInfo,
                ...MODULE_INFO('complete', totalNumberOfQuestions,totalNumberOfQuestions),
            })
            setImage(button_on);
        } else {
            let totalNumberOfAnsweredQuesitons = 0;
            try {
                const response = await getUserAnsweredQuestions(moduleInfo.module_name);
                totalNumberOfAnsweredQuesitons = response.data
            } catch (e) {
                totalNumberOfAnsweredQuesitons = 0
            }

            setIconInfo({
                ...iconInfo,
                ...MODULE_INFO('incomplete', totalNumberOfAnsweredQuesitons,totalNumberOfQuestions),
            })
            setImage(button_off);
        }
    }

    const handleOnCloseVideo = () => {
        playSoundtrack()
        videoOnClose()
    }

    const renderTooltip = () => {
        return <>
            <p style={{ fontWeight: 'bold'}} >{iconInfo.label}</p>
            <p style={{ fontSize: '12px', marginTop: '2px'}} >{iconInfo.description}</p>
            <p style={{ fontWeight: 'bold', color: iconInfo.availabilityColor, marginTop: '8px' }}>
                {iconInfo.availabilityInfo}
            </p>
        </>
    }

    useEffect(() => {
        setTotalCoins(moduleInfo.total_coins);
        defineProperties().finally();
    }, [userData, statusRequirement])

    return (
        <>
            <Tooltip
                hasArrow
                placement='top'
                gutter={12}
                label={renderTooltip()}
            >
                <Flex
                    position="absolute"
                    top={top}
                    bottom={bottom}
                    left={left}
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                >
                    <Image
                        src={image}
                        onClick={isBlocked || !statusRequirement ? blockedFunction : onOpen}
                        _hover={{
                            cursor: 'pointer',
                            transform: 'scale(1.1)',
                        }}

                        transition='all 0.2s ease'
                        width={[116, null, null, null, null, 180]}
                        height={[70, null, null, null, null, 110]}

                    />
                </Flex>
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
                                                moduleInfo.videos_id.map(({ _id, name, url, description, coins, thumbnail }: {
                                                    name: string,
                                                    url: string,
                                                    description: string,
                                                    _id: string,
                                                    coins: number,
                                                    thumbnail?: string
                                                }) => {
                                                    return (
                                                        <Flex
                                                            className='videoCardContainer'
                                                            width="297px"
                                                            height="380px"
                                                            borderRadius="8px"
                                                            flexDir="column"
                                                            boxShadow="0px 4px 14px rgba(0, 0, 0, 0.25)"
                                                            bg={"#FEFEFE"}
                                                            onClick={() => handleVideoModal(_id, name, url, coins, description)}
                                                            transition="ease 200ms"
                                                            _hover={{
                                                                cursor: 'pointer',
                                                                opacity: '0.8'
                                                            }}
                                                            key={_id}
                                                        >
                                                            <Flex justifyContent="center" alignItems="center" borderTopRadius="8px" width="100%" height="165px" bg={colorPalette.textColor}>
                                                            <Image height={thumbnail ? '' : '59px'}  src={thumbnail || VideoIcon} alt="Icone de video" borderTopRadius='8px' />
                                                            </Flex>
                                                            <Flex flexDir="column" paddingX="16px" marginTop="24px">
                                                                <Text color={colorPalette.textColor} fontFamily={fontTheme.fonts} fontSize="24px" fontWeight="500" >
                                                                    {name}
                                                                </Text>
                                                                <Text color={colorPalette.secundaryGrey} fontFamily={fontTheme.fonts} fontSize="16px" >
                                                                    {description}
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
                            !isLoading && IS_MODULE_INFO_HAS_QUESTIONS && <Button
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
                moduleInfo && IS_MODULE_INFO_HAS_QUESTIONS ? <ModuleQuiz
                    openModal={quizIsOpen}
                    closeModal={quizOnClose}
                    moduleInfo={moduleInfo}
                    onToggle={quizToggle}
                    validateUser={confirmationValidation}
                    userQuizCoins={totalCoins - remainingCoins}
                    remainingCoins={remainingCoins}
                    openFinalModuleNarrative={openFinalModuleNarrative}
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
                                        <Button h='3.5rem' _hover={{ bg: colorPalette.confirmButton }} bg={colorPalette.confirmButton} onClick={() => {
                                            closeConfirmationModal();
                                        }}>
                                            Realizar desafio denovo!
                                        </Button>
                                        <Button h='3.5rem' w='45%' _hover={{ bg: colorPalette.closeButton }} bg={colorPalette.closeButton} onClick={() => verificationOnToggle()}>
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
                        _hover={{ bg: colorPalette.primaryColor }}
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
                description={videoInfo.description}
                url={videoInfo.url}
                coins={videoInfo.coins}
                videoIsOpen={videoIsOpen}
                videoOnClose={handleOnCloseVideo}
                updateQuiz={getNewUserInfo}
            />
        </>
    );
}

export default ModuleModal;
