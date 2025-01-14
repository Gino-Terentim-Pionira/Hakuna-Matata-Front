import React, { FC, useState, useEffect } from 'react';
import { Module, Video } from '../../recoil/trailRecoilState';
import button_on from '../../assets/icons/button_on.png';
import button_off from '../../assets/icons/button_off.png';
import button_blocked from '../../assets/icons/button_blocked.png';
import { MODULE_INFO } from '../../utils/constants/mouseOverConstants';
import { Tooltip, Flex, Image, Modal, ModalOverlay, ModalContent, useDisclosure, Box, ModalHeader, Text, ModalCloseButton, ModalBody, Button } from '@chakra-ui/react';
import fontTheme from '../../styles/base';
import colorPalette from '../../styles/colorPalette';
import styled from 'styled-components';
import VideoIcon from '../../assets/icons/video.png';
import { useUser, useTrail } from '../../hooks';
import { IVideoInfo } from './ModuleModal';
import VideoModal from './VideoModal';
import { AxiosResponse } from 'axios';
import { verifyModuleCooldown } from '../../services/moduleCooldown';
import LoadingState from '../LoadingState';
import TimeModal from './TimeModal';
import AlertModal from './AlertModal';
import { errorCases } from '../../utils/errors/errorsCases';
import ModuleQuizV2 from '../Quiz/ModuleQuizV2';
import api from '../../services/api';

interface IModuleModalV2 {
    moduleInfo: Module,
    top?: string;
    bottom?: string;
    left?: string;
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

const ModuleModalV2: FC<IModuleModalV2> = ({
    moduleInfo,
    top,
    bottom,
    left
}) => {
    const [iconInfo, setIconInfo] = useState({
        label: moduleInfo.moduleName,
        description: "",
        availabilityInfo: "",
        availabilityColor: ""
    });
    const [image, setImage] = useState(button_off);
    const [isModuleBlocked, setIsModuleBlocked] = useState(false);
    const { userData, getNewUserInfo } = useUser();
    const { getNewTrailInfo } = useTrail();
    const IS_MODULE_INFO_HAS_QUESTIONS = moduleInfo.questions.length;
    const [videoInfo, setVideoInfo] = useState<IVideoInfo>({ id: '', name: '', url: '', coins: 0, description: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [onError, setOnError] = useState(false);

    const { isOpen,
        onClose,
        onOpen,
        onToggle
    } = useDisclosure();

    const { isOpen: videoIsOpen,
        onClose: videoOnClose,
        onOpen: videoOnOpen,
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

    const { isOpen: quizIsOpen,
        onClose: quizOnClose,
        onOpen: quizOnOpen,
        onToggle: quizToggle
    } = useDisclosure();

    const handleOnCloseVideo = () => {
        videoOnClose()
    }

    const handleModal = async () => {
        try {
            setIsLoading(true);
            const userId = sessionStorage.getItem('@pionira/userId');
            const response: AxiosResponse = await verifyModuleCooldown(userId as string, moduleInfo._id);


            if (!response.data.validation) {
                setIsLoading(false);
                timeOnOpen();
            } else {
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

    const addUserIdToModule = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            await api.patch(`user/addmodule/${userId}`, {
                module_id: moduleInfo._id
            });
            await getNewUserInfo();
            await getNewTrailInfo(moduleInfo.trailName);
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
    }

    const getVideoInfoWith = (offset: number, index: number) => {
        const videoInfo = moduleInfo.videos[index + offset];
        return videoInfo
            ? () =>
                handleVideoModal(
                    videoInfo._id,
                    videoInfo.videoName,
                    videoInfo.url,
                    videoInfo.coins,
                    videoInfo.description,
                    index + offset
                )
            : undefined;
    };

    const handleVideoModal = (
        id: string,
        name: string,
        url: string,
        coins: number,
        description: string,
        index: number
    ) => {
        const nextVideoFunction = getVideoInfoWith(1, index);
        const previousVideoFunction = getVideoInfoWith(-1, index);

        setVideoInfo({ id, name, url, coins, description, nextVideoFunction, previousVideoFunction });
        videoOnOpen();
    };

    const defineProperties = () => {

        const totalNumberOfQuestions = moduleInfo.questions.length;

        if (!moduleInfo.videos.length || moduleInfo.isBlocked) {
            setIconInfo({
                ...iconInfo,
                ...MODULE_INFO('blocked', 0, 0),
                description: !moduleInfo.videos.length ? "Este módulo não está disponível ainda, aguarde para mais atualizações..." : "Para desbloquear este módulo, finalize 100% do anterior."
            });
            setImage(button_blocked);
            setIsModuleBlocked(true);
        } else if (moduleInfo.isCompleted) {
            setIconInfo({
                ...iconInfo,
                ...MODULE_INFO('complete', totalNumberOfQuestions, totalNumberOfQuestions),
            });
            setIsModuleBlocked(false);
            setImage(button_on);
        } else {
            setIconInfo({
                ...iconInfo,
                ...MODULE_INFO('incomplete', totalNumberOfQuestions - moduleInfo.questionsRemaining, totalNumberOfQuestions),
            });
            setIsModuleBlocked(false);
            setImage(button_off);
        }
    }

    useEffect(() => {
        defineProperties();
    }, [moduleInfo]);

    const renderTooltip = () => {
        return <>
            <p style={{ fontWeight: 'bold' }} >{iconInfo.label}</p>
            <p style={{ fontSize: '12px', marginTop: '2px' }} >{iconInfo.description}</p>
            <p style={{ fontWeight: 'bold', color: iconInfo.availabilityColor, marginTop: '8px' }}>
                {iconInfo.availabilityInfo}
            </p>
        </>
    }

    const handleOpenModule = () => {
        isModuleBlocked ? null : onOpen();
    }

    return (
        <>
            <Tooltip
                hasArrow
                placement='top'
                gutter={12}
                label={renderTooltip()}
                closeOnClick={false}
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
                        onClick={handleOpenModule}
                        _hover={{
                            cursor: isModuleBlocked ? 'not-allowed' : 'pointer',
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
                        <Text color={colorPalette.textColor} fontFamily={fontTheme.fonts} fontSize='60' ml='2.3rem' >{moduleInfo.moduleName}</Text>
                        <ModalCloseButton color={colorPalette.closeButton} size='lg' />
                    </ModalHeader>

                    <ModalBody display="flex" flexDirection='column' alignItems='center' >
                        {
                            isLoading ? (
                                <Box width="100%" h="90%">
                                    <LoadingState />
                                </Box>
                            ) : (
                                    <GridContainer>
                                        {
                                            moduleInfo.videos.map((video: Video, index) => {
                                                return (
                                                    <Flex
                                                        className='videoCardContainer'
                                                        width="297px"
                                                        height="auto"
                                                        borderRadius="8px"
                                                        flexDir="column"
                                                        boxShadow="0px 4px 14px rgba(0, 0, 0, 0.25)"
                                                        bg={"#FEFEFE"}
                                                        onClick={() => handleVideoModal(video._id, video.videoName, video.url, video.coins, video.description, index)}
                                                        transition="ease 200ms"
                                                        _hover={{
                                                            cursor: 'pointer',
                                                            opacity: '0.8'
                                                        }}
                                                        key={video._id}
                                                    >
                                                        <Flex justifyContent="center" alignItems="center" borderTopRadius="8px" width="100%" height="165px" bg={colorPalette.textColor}>
                                                            <Image height={video.thumbnail ? '' : '59px'} src={video.thumbnail || VideoIcon} alt="Icone de video" borderTopRadius='8px' />
                                                        </Flex>
                                                        <Flex flexDir="column" paddingX="16px" marginTop="24px">
                                                            <Text color={colorPalette.textColor} fontFamily={fontTheme.fonts} fontSize="24px" fontWeight="500" >
                                                                {video.videoName}
                                                            </Text>
                                                            <Text color={colorPalette.secundaryGrey} fontFamily={fontTheme.fonts} fontSize="16px" >
                                                                {video.description}
                                                            </Text>
                                                            {
                                                                userData?.video_id.includes(video._id) && <Text color={colorPalette.correctAnswer} fontFamily={fontTheme.fonts} fontSize="14px" fontWeight="bold" marginTop="8px">
                                                                    Já assistido
                                                    </Text>
                                                            }

                                                        </Flex>
                                                    </Flex>
                                                )
                                            })
                                        }
                                    </GridContainer>
                                )
                        }
                        {
                            (!isLoading && IS_MODULE_INFO_HAS_QUESTIONS) ? (
                                <Button
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
                                    onClick={handleModal}
                                >
                                    <Text
                                        fontFamily={fontTheme.fonts}
                                        fontSize="30px"
                                        color={colorPalette.textColor}
                                    >
                                        Ir para o desafio!
                                </Text>
                                </Button>
                            ) : null
                        }
                    </ModalBody>
                </ModalContent >
            </Modal >

            <TimeModal timeIsOpen={timeIsOpen} timeOnClose={timeOnClose} />

            {
                moduleInfo && IS_MODULE_INFO_HAS_QUESTIONS ? <ModuleQuizV2
                    openModal={quizIsOpen}
                    closeModal={quizOnClose}
                    moduleInfo={moduleInfo}
                    onToggle={quizToggle}
                    completeModuleFunction={confirmationValidation}
                /> : null
            }

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
                            userData.module_id?.includes(moduleInfo._id) ? (
                                <>
                                    <div>
                                        {
                                            moduleInfo.coinsRemaining == 0 ? (
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
                                                            Joias restantes {moduleInfo.coinsRemaining}
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
                nextVideoFunction={videoInfo.nextVideoFunction}
                previousVideoFunction={videoInfo.previousVideoFunction}
            />
        </>
    )
}

export default ModuleModalV2;
