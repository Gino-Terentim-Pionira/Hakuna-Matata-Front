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
    Image
} from "@chakra-ui/react";

// Components
import RelicsCertificate from './RelicComponents/RelicsCertificate';
import ProfileDataModal from './ProfileDataModal';
import PerfilModalButton from '../../PerfilModalButton';
import ProgressionStatusModal from './ProgressionStatusModal/ProgressionStatusModal';

//styles
import colorPalette from '../../../styles/colorPalette';

// Images
import WorldMap from '../../../assets/WorldMap.webp';
import ApprovedIcon from '../../../assets/icons/ApprovedIcon.png';

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
            <ModalContent height='80%' maxH="600px" bg={colorPalette.backgroundColor}>
                <Box w="25%" bg={colorPalette.primaryColor} h="100%" position="absolute" zIndex='0' left="0" top="0"></Box>
                <ModalHeader margin-top='1rem'>
                    <Flex justifyContent='space-around'>
                            <PerfilModalButton onClick={() => setStep(1)} label='Status' isSelected={step === 1} />
                            <PerfilModalButton onClick={() => setStep(2)} label='Dados' isSelected={step === 2} />
                            <PerfilModalButton onClick={() => setStep(3)} label="Relíquias"  isSelected={step === 3 } />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody zIndex='1'>
                    {step === 1 ? (
                        renderBackgroundImage(<ProgressionStatusModal />, true)
                    ) : step === 2 ? (
                        renderBackgroundImage(<ProfileDataModal />)
                    ) : (
                        renderBackgroundImage(<RelicsCertificate />)
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ProfileModal;
