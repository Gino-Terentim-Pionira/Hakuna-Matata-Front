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
} from "@chakra-ui/react";
import Vimeo from '@u-wave/react-vimeo';
import YouTube from 'react-youtube';

// Components
import AlertModal from './AlertModal';
import LoadingState from '../LoadingState';

// Requisitions
import api from '../../services/api';

// Styles
import fontTheme from '../../styles/base';
import colorPalette from "../../styles/colorPalette";

// Images
import { errorCases } from '../../utils/errors/errorsCases';

interface IVideoModal {
    id: string;
    name: string;
    url: string;
    videoIsOpen: boolean,
    videoOnClose: VoidFunction,
    videoOnToggle: VoidFunction,
    plataform?: 'vimeo' | 'youtube';
}

interface IUser {
    _id: string;
    userName: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    birthday_date: string;
    is_confirmed: boolean;
    status: [number];
    coins: number;
    contribution: number;
    first_certificate: string;
    second_certificate: string;
}

const VideoModal: FC<IVideoModal> = ({ videoIsOpen, videoOnClose, videoOnToggle, id, name, url, plataform = 'vimeo' }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<IUser>({} as IUser);
    const [onError, setOnError] = useState(false);
    const [buttonIsLoading, setButtonIsLoading] = useState(false);

    // Pega as informações do usuário logado
    const getUser = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            const res = await api.get(`/user/${userId}`);
            setUser(res.data);
        } catch (error) {
            setOnError(true);
        }
    }

    const updateVideo = async (videoId: string) => {
        try {
            await api.patch(`video/${videoId}`, {
                user_id: user._id
            });
        } catch (error) {
            setOnError(true);
        }
    }

    // Verifica qual modal abrir
    const handleModal = async () => {
        try {
            setButtonIsLoading(true);
            await updateVideo(id);
            videoOnToggle();
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

    useEffect(() => {
        getUser();
    }, []);


    return (
        <>
            <Modal isOpen={videoIsOpen} onClose={videoOnClose} size="4xl">
                <ModalOverlay />
                <ModalContent height="34rem">
                    <ModalHeader display="flex" justifyContent="center" paddingBottom="0px">
                        <Text fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="3.7rem">
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
                    <ModalCloseButton size="lg" color={colorPalette.closeButton} onClick={() => {
                        videoOnToggle();
                        setIsLoading(true);
                    }} />
                    <ModalBody>
                        <Flex direction="column" alignItems="center" paddingTop="0px">

                            {isLoading ? (
                                <Flex position="absolute" zIndex="-1" width="100%" height="50vh" justifyContent="center">
                                    <LoadingState />
                                </Flex>
                            ) : null}
                            {
                                plataform === 'youtube' ?
                                    <YouTube
                                        videoId={url}
                                        opts={{
                                            width: '600px',
                                            height: '338px',
                                        }}
                                    />
                                    :
                                    <Vimeo
                                        onLoaded={() => { setIsLoading(false) }}
                                        width="625rem"
                                        height="350rem"
                                        video={parseVideoUrl() as string | number}
                                    />
                            }

                        </Flex>

                        {
                            !isLoading && <Flex justifyContent="center" alignItems='flex-end' marginTop="1rem">
                                <Button
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
                        }
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
