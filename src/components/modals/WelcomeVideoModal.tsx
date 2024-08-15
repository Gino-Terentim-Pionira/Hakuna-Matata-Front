import React, {FC, useState} from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
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

type IWelcomeVideoModal =
 {
    isOpen: boolean,
    onClose: VoidFunction,
}

const WelcomeVideoModal: 
FC<IWelcomeVideoModal> 
= ({ isOpen, onClose}) => {
    const [isLoad, setIsLoad] = useState(true);
    const handleCloseModal = () => {
            setIsLoad(true);
            onClose()
    }
    return (
        <Modal isOpen={isOpen} onClose={handleCloseModal} size="6xl">
            <ModalOverlay/>
            <ModalContent paddingX="24px" paddingTop="24px" paddingBottom="48px" background={colorPalette.oracleWhite} height="fit-content">
                <ModalHeader paddingTop="0" paddingBottom="0px">
                    <Text fontFamily={fontTheme.fonts} fontWeight="semibold" color={colorPalette.primaryColor} fontSize="40px">
                        Seja bem vindo!
                    </Text>
                    <Text ml="4px" mt="-2px" fontFamily={fontTheme.fonts} fontWeight="medium" color={colorPalette.secundaryGrey} fontSize="18px">
                        Antes de começar sua jornada, algumas palavras de boas vindas do idealizador Gino Terentim!
                    </Text>
                </ModalHeader>
                <ModalCloseButton size="lg" color={colorPalette.closeButton} onClick={handleCloseModal} />
                <ModalBody mt="24px">
                    <Flex direction="column" alignItems="center" paddingTop="0px">
                            {
                                isLoad &&
                                <Flex height="550px">
                                    <LoadingState/>
                                </Flex>
                            }
                            <ReactPlayer
                                url='https://www.youtube.com/watch?v=NPcGhuJ_zXk'
                                controls={true}
                                playing={true}
                                width="100%"
                                height="550px"
                                onReady={() => setIsLoad(false)}
                                style={{
                                    display: isLoad ? 'none': 'block',
                                }}
                            />
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
};

export default WelcomeVideoModal;
