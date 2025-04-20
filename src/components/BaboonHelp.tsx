import React, { useState, useEffect } from 'react';
import {
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Text,
    ModalCloseButton,
    ModalBody,
    useDisclosure,
    Button,
    Flex,
    useMediaQuery,
} from '@chakra-ui/react';
import colorPalette from '../styles/colorPalette';
import fontTheme from '../styles/base';
import { IMessages, ICommonQuestion, OracleServices } from '../services/OracleServices';
import trailEnum from '../utils/enums/trail';
import LoadingState from './LoadingState';
import AlertModal from './modals/AlertModal';
import { OracleChat } from './Oracle/OracleChat/OracleChat';
import SliderModal from './modals/SliderModal';
import monkey from "../assets/sprites/monkey/monkey.webp";
import { MdClose } from "react-icons/md";
import { S3_BABOON_HELP } from '../utils/constants/constants';
import { webmToOther } from '../utils/algorithms/webmToOther';
import MediaQueriesEnum from '../utils/enums/mediaQueries';

const BaboonHelp = () => {
    const MILI_SECONDS_INACTIVE = 40000;
    const [isInactive, setIsInactive] = useState(false);
    const [isInactiveOpen, setIsInactiveOpen] = useState(false);
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
    const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

    const handleCloseInactive = () => {
        setIsInactiveOpen(false);
    }

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

    const handleOpenChat = async () => {
        onOpen();
        setIsInactive(true);

        await fetchData();
    }

    const openInactiveChat = () => {
        handleCloseInactive();
        handleOpenChat();
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
        if (!content) return
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

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const resetTimer = () => {
            clearTimeout(timeout);
            if (!isInactive) {
                timeout = setTimeout(() => {
                    setIsInactive(true);
                    setIsInactiveOpen(true);
                }, MILI_SECONDS_INACTIVE);
            }
        };

        const handleMouseMove = () => {
            if (isInactive) return;
            resetTimer();
        };

        window.addEventListener('mousemove', handleMouseMove);

        resetTimer();

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isInactive]);

    return (
		<>
			<Box
				_hover={{
					cursor: 'pointer',
				}}
				onClick={handleOpenChat}
			>
				<video autoPlay loop muted playsInline>
					<source
						src={webmToOther(S3_BABOON_HELP, '.mov')}
						type='video/quicktime'
					/>
					<source src={S3_BABOON_HELP} type='video/webm' />
				</video>
			</Box>

			<Modal
				isCentered
				isOpen={isOpen}
				onClose={handleCloseModal}
				size='4xl'
				scrollBehavior='inside'
			>
				<ModalOverlay />
				<ModalContent
					height={{ base: '100dvh', md: '90vh' }}
					background={colorPalette.oracleWhite}
					paddingX={{ base: '0', md: '48px' }}
					minHeight='60vh'
					maxHeight={{ base: "none", md: 'initial' }}
					fontFamily={fontTheme.fonts}
				>
					<ModalHeader
						width='100%'
						borderBottom={`2px solid ${colorPalette.primaryColor}`}
					>
						<Text
							width='fit-content'
							margin='auto'
							fontSize='40px'
							color={colorPalette.textColor}
							fontWeight='semibold'
						>
							O Sábio Babuíno
						</Text>
						<ModalCloseButton
							color={colorPalette.closeButton}
							size='48px'
							mr='8px'
							mt='8px'
						/>
					</ModalHeader>

					<ModalBody
						height='100%'
						marginTop='16px'
						paddingTop='0px'
						paddingX={isDesktop ? '24px' : '16px'}
					>
						{isLoading ? (
							<LoadingState />
						) : (
							<Flex justifyContent='center' height='100%'>
								<OracleChat
									commonQuestions={
										oracleObject.commonQuestions
									}
									messages={oracleObject.messages}
									userMessage={sendMessage}
									isMessageLoading={isMessageLoading}
									inicialMessage='Estou perdido nesta Savana, o que posso fazer?'
								/>
							</Flex>
						)}
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
				alertBody={
					'O Sábio Babuíno está indisponível no momento. Tente novamente mais tarde!'
				}
			/>

			<SliderModal
				isOpen={isInactiveOpen}
				buttonFunctions={handleCloseInactive}
				image={monkey}
				visibleName={true}
				title='Está perdido, viajante?'
				visibleText={true}
				visibleImage={true}
				content='Tenho algumas dicas do que você poderia fazer em seguida!'
				customComponent={
					<Flex
						justifyContent='space-between'
						alignItems='flex-end'
						marginRight='32px'
						marginTop='32px'
						marginBottom='32px'
						flexDirection='column'
					>
						<MdClose
							size='54px'
							color={colorPalette.closeButton}
							cursor='pointer'
							onClick={handleCloseInactive}
						/>

						<Button
							width='142px'
							height='45px'
							backgroundColor={colorPalette.primaryColor}
							_hover={{ bg: colorPalette.primaryColor }}
							color={colorPalette.whiteText}
							fontFamily={fontTheme.fonts}
							fontSize='20px'
							onClick={openInactiveChat}
						>
							Converse comigo
						</Button>
					</Flex>
				}
			/>
		</>
	);
}

export default BaboonHelp;
