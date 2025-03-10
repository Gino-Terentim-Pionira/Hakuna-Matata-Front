import React, { FC, useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalOverlay,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Flex,
    Button,
    Text,
    Checkbox,
} from "@chakra-ui/react";
import ReactPlayer from 'react-player';
import { useUser } from '../../hooks';

// Components
import AlertModal from './AlertModal';

// Requisitions
import api from '../../services/api';

// Styles
import fontTheme from '../../styles/base';
import colorPalette from "../../styles/colorPalette";

// Images
import { errorCases } from '../../utils/errors/errorsCases';
import LoadingState from "../LoadingState";
import { OnProgressProps } from "react-player/base";
import { useSoundtrack } from '../../hooks/useSoundtrack';
import { BiSkipNextCircle } from "react-icons/bi";
import { BiSkipPreviousCircle } from "react-icons/bi";

interface IVideoModal {
    id: string;
    name: string;
    description: string;
    url: string;
    videoIsOpen: boolean,
    videoOnClose: VoidFunction,
    plataform?: 'vimeo' | 'youtube';
    updateQuiz: VoidFunction;
    coins: number;
    nextVideoFunction?: VoidFunction;
    previousVideoFunction?: VoidFunction;
}

const VideoModal: FC<IVideoModal> = ({
    videoIsOpen,
    videoOnClose,
    coins,
    id,
    name,
    description,
    url,
    plataform = 'youtube',
    updateQuiz,
    nextVideoFunction,
    previousVideoFunction
}) => {
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [onError, setOnError] = useState(false);
    const [videoDuration, setVideoDuration] = useState(0);
    const [fallbackHasBeenCalled, setFallbackHasBeenCalled] = useState(false);
    const { userData } = useUser();
    const { pauseSoundtrack } = useSoundtrack();
    const hasWatchedVideo = userData.video_id.includes(id);
    const [clickCheck, setClickCheck] = useState(false);

    const updateVideo = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            if (userData.video_id.includes(id)) return;
            await api.patch(`user/addvideo/${userId}`, {
                video_id: id
            });
            await api.patch(`/user/coins/${userId}`, {
                coins: userData.coins + coins,
            });
        } catch (error) {
            setOnError(true);
        }
    }

    // Verifica qual modal abrir
    const handleFinishedVideo = async () => {
        try {
            await updateVideo();
            await updateQuiz();
        } catch (error) {
            setOnError(true);
        }
    }

    const handleNextVideo = () => {
        handleCloseModal();
        nextVideoFunction && nextVideoFunction();
    }

    const handlePreviousVideo = () => {
        handleCloseModal();
        previousVideoFunction && previousVideoFunction();
    }

    const handleOnEnded = async () => {
        await handleFinishedVideo();
        handleNextVideo();
    }

    // Pega o necessario da URL do video
    const parseVideoUrl = () => {
        if (url)
            return url.split("//")[1].split("/")[1];
    }

    const handleCloseModal = () => {
        setIsVideoLoading(true);
        setFallbackHasBeenCalled(false);
        videoOnClose();
    }

    const handleDuration = (duration: number) => {
        setVideoDuration(duration);
    };

    const handleProgress = async (state: OnProgressProps) => {
        const currentTime = state.playedSeconds;
        const timeRemaining = videoDuration - currentTime;

        if (videoDuration === 0 || currentTime === 0) {
            return;
        }

        const shouldCallFallback = timeRemaining <= 300 && !userData?.video_id.includes(id) && !fallbackHasBeenCalled;
        if (shouldCallFallback) {
            setFallbackHasBeenCalled(true);
            await handleFinishedVideo();
        }
    };

    const handleCheckBox = async () => {
        setClickCheck(true);
        setFallbackHasBeenCalled(true);
        await handleFinishedVideo();
        setClickCheck(false);
    }

    const renderNavigationVideoButton = (navigationType: 'left' | 'right') => (navigationType === 'left' ?
        <Button
            marginRight='auto'
            marginTop='16px'
            color='white'
            _hover={{ bg: colorPalette.primaryColor }}
            bg={colorPalette.primaryColor}
            onClick={handlePreviousVideo}
            leftIcon={<BiSkipPreviousCircle color='black' size='26px' />}
        >
            Vídeo Anterior
        </Button>
        :
        <Button
            marginLeft='auto'
            marginTop='16px'
            color='white'
            _hover={{ bg: colorPalette.primaryColor }}
            bg={colorPalette.primaryColor}
            onClick={handleNextVideo}
            rightIcon={<BiSkipNextCircle color='black' size='26px' />}
        >
            Próximo vídeo
        </Button>
    )

    return (
        <>
            <Modal isOpen={videoIsOpen} onClose={handleCloseModal} size="5xl">
                <ModalOverlay />
                <ModalContent paddingX="24px" paddingTop="24px" paddingBottom="48px" background={colorPalette.oracleWhite} height="fit-content">
                    <ModalHeader paddingTop="0" paddingBottom="0px">
                        <Text fontFamily={fontTheme.fonts} fontWeight="semibold" color={colorPalette.primaryColor} fontSize="40px">
                            {name}
                        </Text>
                        <Text ml="4px" mt="-2px" fontFamily={fontTheme.fonts} fontWeight="medium" color={colorPalette.secundaryGrey} fontSize="18px">
                            {description}
                        </Text>
                    </ModalHeader>
                    <ModalCloseButton size="lg" color={colorPalette.closeButton} onClick={handleCloseModal} />
                    <ModalBody mt="24px">
                        <Flex direction="column" alignItems="center" paddingTop="0px">
                            {
                                isVideoLoading &&
                                <Flex height="450px">
                                    <LoadingState />
                                </Flex>
                            }
                            <ReactPlayer
                                url={plataform == 'youtube' ? `https://www.youtube.com/watch?v=${url}` : `https://vimeo.com/${parseVideoUrl()}`}
                                controls={true}
                                onStart={pauseSoundtrack}
                                onDuration={handleDuration}
                                onProgress={handleProgress}
                                onEnded={handleOnEnded}
                                width="100%"
                                height="450px"
                                onReady={() => setIsVideoLoading(false)}
                                style={{
                                    display: isVideoLoading ? 'none' : 'block',
                                }}
                            />
                            <Flex width='100%'>
                                {
                                    previousVideoFunction && renderNavigationVideoButton('left')
                                }
                                {
                                    nextVideoFunction && renderNavigationVideoButton('right')
                                }
                            </Flex>
                            {
                                !hasWatchedVideo ? (
                                    <Flex
                                        marginTop='16px'
                                        alignSelf='flex-start'
                                    >
                                        <Checkbox
                                            size='lg'
                                            onChange={handleCheckBox}
                                            disabled={clickCheck || hasWatchedVideo}
                                        >
                                            <Text
                                                fontSize='16px'
                                                fontFamily={fontTheme.fonts}
                                            >
                                                Declaro que assisti este vídeo na íntegra
                                            </Text>
                                        </Checkbox>
                                    </Flex>
                                ) : null
                            }
                        </Flex>
                    </ModalBody>
                </ModalContent >
            </Modal >
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
        </>
    )
}

export default VideoModal;
