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
import { useWindowSize } from '../../hooks/useWindowSize';

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
    const { isDesktop } = useWindowSize();

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
			<Modal isOpen={videoIsOpen} onClose={handleCloseModal} size='5xl'>
				<ModalOverlay />
				<ModalContent
					paddingX={{ base: 0, md: '24px' }}
					paddingTop={{ base: 0, md: '24px' }}
					paddingBottom={{ base: 0, md: '48px' }}
					margin={{ base: 0, md: '40px' }}
					height={{ base: '100dvh', md: 'fit-content' }}
					background={colorPalette.oracleWhite}
				>
					<ModalHeader padding='0 16px'>
						<Text
							fontFamily={fontTheme.fonts}
							fontWeight='semibold'
							color={colorPalette.primaryColor}
							fontSize={{ base: '28px', md: '40px' }}
							marginTop={{ base: '24px', md: 0 }}
						>
							{name}
						</Text>
						<Text
							display={isDesktop ? 'flex' : 'none'}
							ml='4px'
							mt='-2px'
							fontFamily={fontTheme.fonts}
							fontWeight='medium'
							color={colorPalette.secundaryGrey}
							fontSize='18px'
						>
							{description}
						</Text>
					</ModalHeader>
					<ModalCloseButton
						size='lg'
						color={colorPalette.closeButton}
						onClick={handleCloseModal}
					/>
					<ModalBody mt='24px' padding='0 16px'>
						<Flex
							height={{ base: '100%', md: 'initial' }}
							direction='column'
							alignItems='center'
							paddingTop='0px'
							paddingBottom={{base: "28px", md: '0px'}}
							justifyContent={{
								base: 'space-between',
								md: 'initial',
							}}
						>
							<Flex
								flexDirection='column'
								width='100%'
								alignItems='flex-start'
							>
								{isVideoLoading && (
									<Flex
										width='100%'
										height={isDesktop ? '450px' : '195px'}
										justifyContent='center'
									>
										<LoadingState />
									</Flex>
								)}
								<ReactPlayer
									url={
										plataform == 'youtube'
											? `https://www.youtube.com/watch?v=${url}`
											: `https://vimeo.com/${parseVideoUrl()}`
									}
									controls={true}
									onStart={pauseSoundtrack}
									onDuration={handleDuration}
									onProgress={handleProgress}
									onEnded={handleOnEnded}
									width='100%'
									height={isDesktop ? '450px' : '195px'}
									onReady={() => setIsVideoLoading(false)}
									style={{
										display: isVideoLoading
											? 'none'
											: 'block',
									}}
								/>
								<Text
									display={isDesktop ? 'none' : 'flex'}
									ml='4px'
									mt='24px'
									fontFamily={fontTheme.fonts}
									fontWeight='medium'
									color={colorPalette.secundaryGrey}
									fontSize='16px'
								>
									{description}
								</Text>
								{!hasWatchedVideo ? (
									<Flex
										display={isDesktop ? 'none' : 'flex'}
										marginTop='16px'
										alignSelf='flex-start'
									>
										<Checkbox
											size='lg'
											onChange={handleCheckBox}
											disabled={
												clickCheck ?? hasWatchedVideo
											}
										>
											<Text
												fontSize='16px'
												fontFamily={fontTheme.fonts}
												color={colorPalette.textColor}
											>
												Declaro que assisti este vídeo
												na íntegra
											</Text>
										</Checkbox>
									</Flex>
								) : null}
							</Flex>
							<Flex columnGap='12px' width='100%'>
								{previousVideoFunction &&
									renderNavigationVideoButton('left')}
								{nextVideoFunction &&
									renderNavigationVideoButton('right')}
							</Flex>
							{!hasWatchedVideo ? (
								<Flex
									display={isDesktop ? 'flex' : 'none'}
									marginTop='16px'
									alignSelf='flex-start'
								>
									<Checkbox
										size='lg'
										onChange={handleCheckBox}
										disabled={clickCheck ?? hasWatchedVideo}
									>
										<Text
											fontSize='16px'
											fontFamily={fontTheme.fonts}
										>
											Declaro que assisti este vídeo na
											íntegra
										</Text>
									</Checkbox>
								</Flex>
							) : null}
						</Flex>
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
		</>
	);
}

export default VideoModal;
