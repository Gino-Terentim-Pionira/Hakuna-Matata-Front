import React, { FC, useState } from 'react';
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

interface IVideoModal {
    id: string;
    name: string;
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
    url,
    plataform = 'vimeo',
    updateQuiz
}) => {
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [onError, setOnError] = useState(false);
    const [buttonIsLoading, setButtonIsLoading] = useState(false);
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
    const handleModal = async () => {
        try {
            setButtonIsLoading(true);
            await updateVideo();
            updateQuiz();
            handleCloseModal();
            setButtonIsLoading(false);
        } catch (error) {
            setOnError(true);
            setButtonIsLoading(false);
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
    return (
        <>
            <Modal isOpen={videoIsOpen} onClose={handleCloseModal} size="4xl">
                <ModalOverlay />
                <ModalContent height="34rem">
                    <ModalHeader display="flex" justifyContent="center" paddingBottom="0px">
                        <Text fontFamily={fontTheme.fonts} fontWeight="semibold" color={colorPalette.textColor} fontSize="3.7rem">
                            {name}
                        </Text>
                    </ModalHeader>
                    <Box
                        w="25%"
                        bg={colorPalette.primaryColor}
                        h="55vh"
                        position="absolute"
                        zIndex="-1"
                        left="0"
                        top="0"
                        borderTopStartRadius='5px'
                        clipPath="polygon(0% 0%, 100% 0%, 0% 100%)"
                    />
                    <ModalCloseButton size="lg" color={colorPalette.closeButton} onClick={handleCloseModal} />
                    <ModalBody>
                        <Flex direction="column" alignItems="center" paddingTop="0px">
                            {
                                isVideoLoading &&
                                <Flex height="320px">
                                    <LoadingState/>
                                </Flex>
                            }
                            <ReactPlayer
                                url={plataform == 'youtube' ? `https://www.youtube.com/watch?v=${url}` : `https://vimeo.com/${parseVideoUrl()}`}
                                controls={true}
                                onEnded={handleModal}
                                onReady={() => setIsVideoLoading(false)}
                                style={{
                                    display: isVideoLoading ? 'none': 'block',
                                    marginTop: '-16px'
                                }}
                            />
                        </Flex>

                        <Flex justifyContent="center" alignItems='flex-end' marginTop="1rem">
                            <Button
                                display={isVideoLoading ? 'none': 'flex'}
                                bgColor={colorPalette.confirmButton}
                                width="50%"
                                height="3rem"
                                isLoading={buttonIsLoading}
                                onClick={!buttonIsLoading ? () => handleModal() : () => console.log()}
                            >
                                <Text
                                    fontFamily={fontTheme.fonts}
                                    fontWeight="semibold"
                                    fontSize="2rem"
                                >
                                    Concluído
                                    </Text>
                            </Button>
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
