import React, { useState } from 'react';
import { Box, Modal, ModalOverlay, ModalContent, ModalHeader, Text, ModalCloseButton, ModalBody, useDisclosure, Button, Flex } from '@chakra-ui/react';
import colorPalette from '../styles/colorPalette';
import fontTheme from '../styles/base';
import { IMessages, ICommonQuestion, OracleServices } from '../services/OracleServices';
import trailEnum from '../utils/enums/trail';
import LoadingState from './LoadingState';
import AlertModal from './modals/AlertModal';
import { OracleChat } from './Oracle/OracleChat/OracleChat';

const BaboonHelp = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const oracleService = new OracleServices();
    const [isLoading, setIsLoading] = useState(true);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [oracleObject, setOracleObject] = useState({
        oracle_name: "",
        thread_id: "",
        assistant_id: "",
        messages: [
            {
                role: 'assistant',
                content: 'Você se perdeu, viajante? Estou aqui para te guiar'
            }
        ] as IMessages[],
        commonQuestions: [] as ICommonQuestion[]
    });

    const addUserMessage = (content: string) => {
		setOracleObject((currentState) => (
			{
				...currentState,
				messages: [{
					role: 'user',
					content
				}, ...currentState.messages]
			}
		));
	}

    const fetchData = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');

			const messages = await oracleService.getOracleHistory(userId as string, trailEnum.BABOON);
            const commonQuestionsResponse = await oracleService.getCommonQuestionsByModule(trailEnum.BABOON);

            setOracleObject((currentState) => (
                {
                    ...currentState,
                    oracle_name: messages.oracle.oracle_name,
                    thread_id: messages.thread_id,
                    assistant_id: messages.oracle.assistant_id,
					messages: [...messages.messages, ...currentState.messages],
                    commonQuestions: commonQuestionsResponse
                }
            ));

            setIsLoading(false);
        } catch (error) {
            setIsErrorOpen(true);
        }
    }

    const handleOpenChat = () => {
        onOpen();

        fetchData();
    }

    const handleCloseModal = () => {
        setIsLoading(true);
        setOracleObject({
            oracle_name: "",
            thread_id: "",
            assistant_id: "",
            messages: [
                {
                    role: 'assistant',
                    content: 'Você se perdeu, viajante? Estou aqui para te guiar'
                }
            ] as IMessages[],
            commonQuestions: [] as ICommonQuestion[]
        });
        onClose();
    }

    const handleCloseError = () => {
        setIsErrorOpen(false);
        handleCloseModal();
    }

    const sendMessage = async (content: string) => {
        if(!content) return
        try {
            setIsMessageLoading(true);
            addUserMessage(content);

            const response = await oracleService.sendMessageToBaboon(
                oracleObject.thread_id,
                content
            );

            const newMessages = response.map((message: IMessages) => ({
				...message,
				isNew: true
			}));

			setOracleObject((currentState) => (
				{
					...currentState,
					messages: [...newMessages, ...currentState.messages]
				}
			));
        } catch (error) {
            setIsErrorOpen(true);
        } finally {
            setIsMessageLoading(false);
        }
    }

    return (
        <>
            <Box
                _hover={{
                    cursor: 'pointer',
                }}
                onClick={handleOpenChat}
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src={'https://pionira.s3.sa-east-1.amazonaws.com/oracle/oracle_baboon.webm'} type="video/webm" />
                </video>
            </Box>

            <Modal isCentered isOpen={isOpen} onClose={handleCloseModal} size="4xl" scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent height='90vh' background={colorPalette.oracleWhite} paddingX="48px" minHeight='60vh' fontFamily={fontTheme.fonts}>
                    <ModalHeader width="100%" borderBottom={`2px solid ${colorPalette.primaryColor}`}>
                        <Text width="fit-content" margin="auto" fontSize="40px" color={colorPalette.textColor}
                            fontWeight="semibold">O Sábio Babuíno</Text>
                        <ModalCloseButton color={colorPalette.closeButton} size="48px" mr="8px" mt="8px" />
                    </ModalHeader>

                    <ModalBody 
                        height='100%'
                        marginTop="16px"
                        paddingTop="0px"
                    >
                        {
                            isLoading ? (
                                <LoadingState />
                            ) : (
                                    <Flex
                                        justifyContent='center'
                                        height='100%'
                                    >
                                        <OracleChat
                                            commonQuestions={oracleObject.commonQuestions}
                                            messages={oracleObject.messages}
                                            userMessage={sendMessage}
                                            isInputReleased={true}
                                            isMessageLoading={isMessageLoading}
                                            isMessageFree={true}
                                        />
                                    </Flex>
                                )
                        }
                    </ModalBody>
                </ModalContent>
            </Modal>
            <AlertModal
                isOpen={isErrorOpen}
                onClose={handleCloseError}
                buttonBody={
                    <Button
                        color='white'
                        bg={colorPalette.primaryColor}
                        _hover={{ bg: colorPalette.primaryColor }}
                        onClick={handleCloseError}
                        ml={3}
                    >
                        Confirmar
                    </Button>
                }
                alertTitle={'Babuíno indisponível'}
                alertBody={'O Sábio Babuíno está indisponível no momento. Tente novamente mais tarde!'}
            />
        </>
    )
}

export default BaboonHelp;
