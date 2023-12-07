import React, { FC } from 'react';
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
import ReactPlayer from 'react-player';

// Styles
import fontTheme from '../../styles/base';
import colorPalette from '../../styles/colorPalette';

type ITutorialModal = {
    isOpen: boolean,
    onClose: VoidFunction,
    onToggle: VoidFunction,
}

const TutorialModal: FC<ITutorialModal> = ({ isOpen, onClose, onToggle }) => (
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
            }} />
            <ModalBody marginTop="16px">
                <Flex direction="column" alignItems="center" paddingTop="0px">
                    <ReactPlayer
                        url='https://www.youtube.com/watch?v=NPcGhuJ_zXk'
                        controls={true}
                        playing={true}
                        style={{
                            marginTop: '-16px'
                        }}
                    />
                </Flex>
            </ModalBody>
        </ModalContent>
    </Modal>
);

export default TutorialModal;