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
    updateQuiz
}) => {
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [onError, setOnError] = useState(false);
    const [videoDuration, setVideoDuration] = useState(0);
    const { userData } = useUser();

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
            updateQuiz();
        } catch (error) {
            setOnError(true);
        }
    }

    // Pega o necessario da URL do video
    const parseVideoUrl = () => {
        if (url)
            return url.split("//")[1].split("/")[1];
    }

    const handleCloseModal = () => {
        setIsVideoLoading(true);
        videoOnClose()
    }

    const handleDuration = (duration: number) => {
        setVideoDuration(duration);
    };

    const handleProgress = async (state: OnProgressProps) => {
        const currentTime = state.playedSeconds;
        const timeRemaining = videoDuration - currentTime;

        if (timeRemaining <= 300 && !userData?.video_id.includes(id)) {
            await handleFinishedVideo()
        }
    };

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
                                    <LoadingState/>
                                </Flex>
                            }
                            <ReactPlayer
                                url={plataform == 'youtube' ? `https://www.youtube.com/watch?v=${url}` : `https://vimeo.com/${parseVideoUrl()}`}
                                controls={true}
                                onDuration={handleDuration}
                                onProgress={handleProgress}
                                onEnded={handleFinishedVideo}
                                width="100%"
                                height="450px"
                                onReady={() => setIsVideoLoading(false)}
                                style={{
                                    display: isVideoLoading ? 'none': 'block',
                                }}
                            />
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
