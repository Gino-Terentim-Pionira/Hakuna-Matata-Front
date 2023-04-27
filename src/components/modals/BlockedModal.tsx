import React, { FC } from "react";
import { 
    Button, 
    Center, 
    Image, 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalOverlay,
    Text
} from "@chakra-ui/react";
import colorPalette from "../../styles/colorPalette";
import stop from "../../assets/icons/stop.svg";
import fontTheme from "../../styles/base";

type BlockedModalProp = {
	isOpen: boolean,
    onClose: VoidFunction;
};

const BlockedModal: FC<BlockedModalProp> = ({
    isOpen,
    onClose
}) => {

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='md'>
            <ModalOverlay />
            <ModalContent>
            <ModalCloseButton color={colorPalette.closeButton} size='lg' />
            <ModalBody>
            </ModalBody>
                <Center 
                    h='437px'
                    display='flex'
                    flexDirection='column'
                    justifyContent='space-between'
                >
                    <Center
                        display='flex'
                        flexDirection='column'
                    >
                        <Center
                            backgroundColor='#F5F5F5'
                            width='120px'
                            height='120px'
                            borderRadius='1000px'
                            marginTop='48px'
                            alignSelf='center'
                            justifyContent="center"
                            alignItems="center"
                            marginBottom='24px'
                        >
                            <Image
                                src={stop}
                            />
                        </Center>
                        <Text 
                            color={colorPalette.inactiveButton}
                            fontFamily={fontTheme.fonts}
                            fontWeight='bold'
                            fontSize='20px'
                            marginBottom='8px'
                        >
                            Tenha paciência, Jovem!
                        </Text>
                        <Text 
                            width='335px'
                            textAlign='center'
                            fontFamily={fontTheme.fonts}
                            fontSize='18px'
                            color={colorPalette.secundaryGrey}
                        >
                            Esse horizonte ainda não pode ser explorado, por enquanto...
                        </Text>
                    </Center>
                    <Button
                        width='252px'
                        height='45px'
                        background={colorPalette.primaryColor}
                        color={colorPalette.buttonTextColor}
                        fontSize='28px'
                        fontFamily={fontTheme.fonts}
                        onClick={onClose}
                        marginBottom='32px'
                        _hover={{}}
                    >
                        Continuar
                    </Button>
                </Center>
            </ModalContent>
        </Modal>
	);
};

export default BlockedModal;