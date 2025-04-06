import { Flex, Image, Text, Modal, ModalOverlay, ModalContent, Box, ModalHeader, ModalCloseButton, ModalBody, Button } from '@chakra-ui/react';
import React, { FC } from 'react';
import colorPalette from '../../styles/colorPalette';
import fontTheme from '../../styles/base';
import "./styles/QuizAlertModal.css";

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
                className="quiz_alert_modal_container"
                height='530px'
                fontFamily={fontTheme.fonts}
            >
                <Box
                    className="quiz_alert_modal_container_box"
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
                        className="quiz_alert_modal_container_header_title"
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
                    className="quiz_alert_modal_container_body_container"
                    d='flex'
                    mt='-1rem'
                    flexDirection='column'
                    alignItems='center'
                >
                    <div>
                        <Image
                            className="quiz_alert_modal_container_body_image"
                            src={image}
                            w='535px'
                            h='280px'
                            marginBottom='16px'
                        />
                        <Text
                            className="quiz_alert_modal_container_body_text"
                            margin="auto"
                            textAlign="center"
                            color={colorPalette.textColor}
                            fontSize='24px'

                        >
                            Bote em dia sua sabedoria completando esse desafio diário
                        </Text>
                    </div>

                    <Flex
                        className="quiz_alert_modal_container_body_buttons_container"
                        w='65%'
                        justifyContent='space-between'
                    >
                        <Button
                            className="quiz_alert_modal_container_body_buttons"
                            bgColor={
                                colorPalette.confirmButton
                            }
                            width='45%'
                            height='4rem'
                            fontSize='1.2rem'
                            _hover={{
                                transform: 'scale(1.1)',
                            }}
                            color={colorPalette.textColor}
                            onClick={confirmFunction}
                        >
                            Vamos nessa!
                        </Button>
                        <Button
                            className="quiz_alert_modal_container_body_buttons"
                            bgColor={
                                colorPalette.alertText
                            }
                            width='45%'
                            height='4rem'
                            fontSize='1.2rem'
                            _hover={{
                                transform: 'scale(1.1)',
                            }}
                            onClick={modalOnClose}
                            color={colorPalette.textColor}
                        >
                            Ainda não!
                        </Button>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default QuizAlertModal;
