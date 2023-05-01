import React, { FC, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    Box,
    ModalBody,
    ModalCloseButton,
    Flex,
    Text,
    ModalHeader
} from "@chakra-ui/react";
import YouTube from 'react-youtube';

// Components
import LoadingState from '../LoadingState';

// Styles
import fontTheme from '../../styles/base';
import colorPalette from '../../styles/colorPalette';

type ITutorialModal = {
    isOpen: boolean,
    onClose: VoidFunction,
    onToggle: VoidFunction,
}

const TutorialModal: FC<ITutorialModal> = ({ isOpen, onClose, onToggle }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay />
            <ModalContent height="34rem">
                <ModalHeader display="flex" justifyContent="center" paddingBottom="0px">
                    <Text marginTop='18px' color={colorPalette.textColor} fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="3.7rem">Seja bem-vindo!</Text>
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
                    clipPath="polygon(0% 0%, 100% 0%, 0% 100%)" />
                <ModalCloseButton size="lg" color={colorPalette.closeButton} onClick={() => {
                    onToggle();
                    setIsLoading(true);
                }} />
                <ModalBody marginTop="16px">
                    <Flex direction="column" alignItems="center" paddingTop="0px">
                        {isLoading &&
                            <Flex position="absolute" zIndex="-1" width="100%" justifyContent="center" top="50%">
                                <LoadingState />
                            </Flex>
                        }
                        <YouTube 
                            opts={{
                                width: '550',
                                height: '300',
                                playerVars: {
                                    autoplay: 1
                                }
                            }}
                            videoId="NPcGhuJ_zXk"
                        />
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default TutorialModal;