import React, { FC, useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Box,
    ModalBody,
    ModalCloseButton,
    Flex,
    Button,
    Text
} from "@chakra-ui/react";

// Components
import InsigniaCertificate from '../InsigniaCertificate';
import ProfileDataModal from './ProfileDataModal';
import PerfilModalButton from '../PerfilModalButton';
import ProgressionStatusModal from './ProgressionStatusModal/ProgressionStatusModal';

//styles
import colorPalette from '../../styles/colorPalette';

type ProfileModalProps = {
    isOpen: boolean,
    onClose: VoidFunction,
}

const useWindowSize = () => {
    const [size, setSize] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setSize(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);
    return size;
}

const ProfileModal: FC<ProfileModalProps> = ({
    isOpen,
    onClose
}) => {

    const width = useWindowSize();

    const [variant, setVariant] = useState('4xl');
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (width <= 1366) {
            setVariant('4xl');
        } else {
            setVariant('5xl');
        }
    }, [width]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={variant}>
            <ModalOverlay />
            <ModalContent height='80%' bg={colorPalette.backgroundColor}>
                <Box w="85%" bg={colorPalette.primaryColor} h="100vh" position="absolute" zIndex='0' left="0" top="0" borderTopStartRadius='5px' borderBottomStartRadius='23%' clipPath="polygon(0% 0%, 100% 0%, 30% 80%, 0% 80%)"></Box>
                <ModalHeader margin-top='1rem'>
                    <Flex justifyContent='space-around'>
                        {step === 1 ? (
                            <Button
                                size='lg'
                                height='4rem'
                                width='25%'
                                bg={colorPalette.secondaryColor}
                                _hover={{ transform: "scale(1.1)" }}
                                transition='all 200ms ease'
                                color='white'
                                onClick={() => setStep(1)}
                            >
                                <Text fontSize='1.5rem'>
                                    Status
                                </Text>
                            </Button>
                        ) : (
                            <PerfilModalButton whichBtn={1} click={() => setStep(1)} text='Status' />
                        )}
                        {step === 2 ? (
                            <Button
                                size='lg'
                                height='4rem'
                                width='25%'
                                bg={colorPalette.secondaryColor}
                                _hover={{ transform: "scale(1.1)" }}
                                transition='all 200ms ease'
                                color='white'
                                onClick={() => setStep(2)}
                            >
                                <Text fontSize='1.5rem'>
                                    Dados
                                </Text>
                            </Button>
                        ) : (
                            <PerfilModalButton whichBtn={1} click={() => setStep(2)} text='Dados' />
                        )}
                        {step === 3 ? (
                            <Button
                                size='lg'
                                height='4rem'
                                width='25%'
                                bg={colorPalette.secondaryColor}
                                _hover={{ transform: "scale(1.1)" }}
                                transition='all 200ms ease'
                                color='white'
                                display='flex'
                                flexDirection='column'
                                onClick={() => setStep(3)}
                            >
                                <Text fontSize='1.5rem'>
                                    Insígnias e
                                </Text>
                                <Text fontSize='1.5rem'>
                                    Certificados
                                </Text>
                            </Button>
                        ) : (
                            <PerfilModalButton whichBtn={2} click={() => setStep(3)} />
                        )}
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody zIndex='1'>
                    {step === 1 ? (
                        <Box bg={colorPalette.backgroundColor} h='97%' w='100%' borderRadius='8px' border='2px solid' borderColor={colorPalette.secondaryColor} boxShadow='6px 6px 4px rgba(0, 0, 0, 0.25)'>
                            <ProgressionStatusModal />
                        </Box>
                    ) : step === 2 ? (
                        <Box bg={colorPalette.backgroundColor} h='97%' w='100%' borderRadius='8px' border='2px solid' borderColor={colorPalette.secondaryColor} boxShadow='6px 6px 4px rgba(0, 0, 0, 0.25)'>
                            <ProfileDataModal />
                        </Box>
                    ) : (
                        <Box
                            bg={colorPalette.backgroundColor}
                            h='97%'
                            w='100%'
                            borderRadius='8px'
                            border='2px solid'
                            borderColor={colorPalette.secondaryColor}
                            boxShadow='6px 6px 4px rgba(0, 0, 0, 0.25)'
                        >
                            <InsigniaCertificate />
                        </Box>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ProfileModal;