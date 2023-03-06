import React, { FC } from 'react';
import {
    Modal,
    ModalContent,
    ModalOverlay,
    Box,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Text,
    Button,
    Flex
} from '@chakra-ui/react';

// Styles
import fontTheme from '../../styles/base';
import colorPalette from '../../styles/colorPalette';

interface ITimeModal {
    timeIsOpen: boolean,
    timeOnClose: VoidFunction,
    timeOnToggle: VoidFunction
}

const TimeModal: FC<ITimeModal> = ({ timeIsOpen, timeOnClose, timeOnToggle }) => {
    return (
        <>
            <Modal isOpen={timeIsOpen} onClose={timeOnClose} size='3xl' >
                <ModalOverlay />
                <ModalContent height='34rem' display='flex' justifyContent='center' alignItems='center' >
                    <Box
                        w="28%"
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

                    <ModalBody d='flex' w='70%' flexDirection='column' justifyContent='space-evenly'>
                        <div>
                            <Text textAlign='center' color={colorPalette.closeButton} fontWeight='bold' fontFamily={fontTheme.fonts} fontSize='3rem' marginTop='2.5rem'>
                                OPA, CALMA AÍ!
                            </Text>
                            <Text textAlign='center' fontFamily={fontTheme.fonts} fontSize='1.5rem' mt='1rem'>
                                Você deve esperar no mínimo 30 minutos para refazer um desafio!
                            </Text>
                        </div>

                        <Flex justifyContent='space-around'>
                            <Button h='3.5rem' w='50%' bg={colorPalette.confirmButton} onClick={() => timeOnToggle()}>
                                Tudo bem!
                            </Button>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default TimeModal;
