import { Flex, Image, Text, Modal, ModalOverlay, ModalContent, Box, ModalHeader, ModalCloseButton, ModalBody, Button } from '@chakra-ui/react';
import React, { FC } from 'react';
import colorPalette from '../../styles/colorPalette';
import fontTheme from '../../styles/base';

type QuizAlertProps = {
    modalIsOpen: boolean;
    modalOnClose: VoidFunction;
    title: string;
    image: string;
    confirmFunction: VoidFunction
}

const QuizAlertModal: FC<QuizAlertProps> = ({ 
    modalIsOpen,
    modalOnClose,
    title,
    image,
    confirmFunction
 }) => {
    return (
        <Modal
            isOpen={modalIsOpen}
            onClose={modalOnClose}
            size='4xl'
        >
            <ModalOverlay />
            <ModalContent
                height='530px'
                fontFamily={fontTheme.fonts}
            >
                <Box
                    w='20%'
                    bg={colorPalette.primaryColor}
                    h='100%'
                    position='absolute'
                    zIndex='-1'
                    left='0'
                    top='0'
                    borderTopStartRadius='5px'
                    clipPath='polygon(0% 0%, 70% 0%, 0% 100%)'
                />
                <ModalHeader
                    d='flex'
                    justifyContent='center'
                    mt='1.4rem'
                >
                    <Text
                        ml='2.3rem'
                        w='666px'
                        fontSize='32px'
                        textAlign='center'
                        fontWeight='normal'
                        fontFamily={fontTheme.fonts}
                        color={colorPalette.textColor}
                    >
                        {title}
                    </Text>
                    <ModalCloseButton
                        color={colorPalette.closeButton}
                        size='lg'
                    />
                </ModalHeader>

                <ModalBody
                    d='flex'
                    mt='-1rem'
                    flexDirection='column'
                    alignItems='center'
                >
                    <Image
                        src={image}
                        w='535px'
                        h='280px'
                        marginBottom='16px'
                    />

                    <Flex
                        w='65%'
                        justifyContent='space-between'
                    >
                        <Button
                            bgColor={
                                colorPalette.confirmButton
                            }
                            width='45%'
                            height='4rem'
                            fontSize='1.2rem'
                            _hover={{
                                transform: 'scale(1.1)',
                            }}
                            onClick={confirmFunction}
                        >
                            Vamos nessa!
                        </Button>
                        <Button
                            bgColor={
                                colorPalette.closeButton
                            }
                            width='45%'
                            height='4rem'
                            fontSize='1.2rem'
                            _hover={{
                                transform: 'scale(1.1)',
                            }}
                            onClick={modalOnClose}
                        >
                            Ainda não estou pronto!
                        </Button>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default QuizAlertModal;
