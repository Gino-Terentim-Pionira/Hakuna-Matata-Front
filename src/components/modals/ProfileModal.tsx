import React, { FC, useState, useEffect, ReactElement } from 'react';
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
    Text,
    Image
} from "@chakra-ui/react";

// Components
import InsigniaCertificate from '../InsigniaCertificate';
import ProfileDataModal from './ProfileDataModal';
import PerfilModalButton from '../PerfilModalButton';
import ProgressionStatusModal from './ProgressionStatusModal/ProgressionStatusModal';

//styles
import colorPalette from '../../styles/colorPalette';

// Images
import WorldMap from '../../assets/WorldMap.png';
import ApprovedIcon from '../../assets/icons/ApprovedIcon.png';

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

    const renderBackgroundImage = (component: ReactElement, notShowStamp?: boolean) => (
        <Box
            position="relative"
            bgColor="#FFFCEA"
            bgImage={`url(${WorldMap})`}
            bgPosition="top"
            bgRepeat="no-repeat"
            h='97%' w='100%' borderRadius='8px'
            border='2px solid'
            borderColor={colorPalette.secondaryColor}
            boxShadow='6px 6px 4px rgba(0, 0, 0, 0.25)'
        >
            {component}
            {
                !notShowStamp && <Image bottom="16px" right="32px" position="absolute" src={ApprovedIcon} />
            }
        </Box>
    )

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={variant}>
            <ModalOverlay />
            <ModalContent height='80%' bg={colorPalette.backgroundColor}>
                <Box w="25%" bg={colorPalette.primaryColor} h="100%" position="absolute" zIndex='0' left="0" top="0"></Box>
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
                                    Insígnias
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
                        renderBackgroundImage(<ProgressionStatusModal />, true)
                    ) : step === 2 ? (
                        renderBackgroundImage(<ProfileDataModal />)
                    ) : (
                        renderBackgroundImage(<InsigniaCertificate />)
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ProfileModal;
