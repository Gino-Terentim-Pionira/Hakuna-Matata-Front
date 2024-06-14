import React, {FC, useState} from 'react';
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
import LoadingState from "../LoadingState";

type ITutorialModal = {
    isOpen: boolean,
    onClose: VoidFunction,
}

const TutorialModal: FC<ITutorialModal> = ({ isOpen, onClose}) => {
    const [isLoad, setIsLoad] = useState(true);
    const handleCloseModal = () => {
            setIsLoad(true);
            onClose()
    }
    return (
        <Modal isOpen={isOpen} onClose={handleCloseModal} size="4xl">
            <ModalOverlay/>
            <ModalContent height="34rem">
                <ModalHeader display="flex" justifyContent="center" paddingBottom="0px">
                    <Text marginTop='18px' color={colorPalette.textColor} fontFamily={fontTheme.fonts}
                          fontWeight="semibold" fontSize="3.7rem">Seja bem-vindo!</Text>
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
                    clipPath="polygon(0% 0%, 100% 0%, 0% 100%)"/>
                <ModalCloseButton size="lg" color={colorPalette.closeButton} onClick={handleCloseModal}/>
                <ModalBody marginTop="16px">
                    <Flex direction="column" alignItems="center" paddingTop="0px">
                            {
                                isLoad &&
                                <Flex height="280px">
                                    <LoadingState/>
                                </Flex>
                            }
                            <ReactPlayer
                                url='https://www.youtube.com/watch?v=NPcGhuJ_zXk'
                                controls={true}
                                playing={true}
                                style={{
                                    display: isLoad ? 'none': 'block',
                                    marginTop: '-16px'
                                }}
                                onReady={() => setIsLoad(false)}
                            />
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
};

export default TutorialModal;