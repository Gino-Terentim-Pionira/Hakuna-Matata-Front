import React, { ChangeEventHandler } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
    Flex,
    FormControl,
    FormLabel,
    FormHelperText,
    Button,
    Textarea
} from '@chakra-ui/react';
import colorPalette from '../../styles/colorPalette';
import fontTheme from '../../styles/base';
import LoadingState from '../LoadingState';


type SuportModalType = {
    isOpen: boolean;
    inputHeader: string;
    inputFooter: string;
    buttonText: string;
    isLoading: boolean;
    messageOnChange: ChangeEventHandler;
    onButtonClick: () => void;
    onClose: VoidFunction;
}

export const SuportRequestModal = ({ isOpen, inputHeader, inputFooter, buttonText, messageOnChange, onButtonClick, isLoading, onClose }: SuportModalType) => {

    return (
        <>
            <Modal
                isCentered
                isOpen={isOpen}
                onClose={onClose}
                size='4xl'
                scrollBehavior='inside'
            >
                <ModalOverlay />
                <ModalContent
                    background={colorPalette.oracleWhite}
                    paddingX={{ base: '14px', md: '48px' }}
                    minHeight='60vh'
                    height={{ base: '100%', md: 'auto' }}
                    maxH={{ base: 'none', md: 'auto' }}
                    fontFamily={fontTheme.fonts}
                >
                    <ModalHeader
                        display='flex'
                        justifyContent={{ base: 'flex-start', md: 'auto' }}
                        paddingLeft={{ base: '0', md: 'auto' }}
                        paddingBottom={{ base: '12px', md: 'auto' }}
                        width='100%'
                        borderBottom={`2px solid ${colorPalette.primaryColor}`}
                    >
                        <Text
                            width='fit-content'
                            margin={{ base: '0', md: 'auto' }}
                            fontSize='40px'
                            color={colorPalette.textColor}
                            fontWeight='semibold'
                        >
                            Suporte Pionira
					</Text>
                        <ModalCloseButton
                            color={colorPalette.closeButton}
                            size={'48px'}
                            mr='8px'
                            mt={{ base: "24px", md: '8px' }}
                        />
                    </ModalHeader>

                    <ModalBody
                        width='100%'
                        paddingX={{ base: '0', md: 'auto' }}
                        sx={{
                            '&::-webkit-scrollbar': {
                                width: '4px',
                                height: '4px',
                                borderRadius: '8px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#9D9D9D',
                                borderRadius: '10px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: '#555',
                            },
                            '&::-moz-scrollbar': {
                                width: '4px',
                                height: '4px',
                                borderRadius: '8px',
                            },
                            '&::-moz-scrollbar-thumb': {
                                background: '#9D9D9D',
                                borderRadius: '10px',
                            },
                            '&::-moz-scrollbar-thumb:hover': {
                                background: '#555',
                            },
                        }}
                    >
                        <Flex
                            flexDirection='column'
                            alignItems='center'
                            justifyContent='center'
                            minH='80%'
                        >
                            {isLoading ? (
                                <LoadingState />
                            ) : (
                                    <>
                                        <Flex
                                            w='640px'
                                            mt='64px'
                                            mb='64px'
                                        >
                                            <FormControl>
                                                <FormLabel>{inputHeader}</FormLabel>
                                                <Textarea
                                                    width='100%'
                                                    height='200px'
                                                    placeholder='Escreva sua mensagem aqui...'
                                                    onChange={messageOnChange}
                                                />
                                                <FormHelperText>{inputFooter}</FormHelperText>
                                            </FormControl>
                                        </Flex>

                                        <Button
                                            w='230px'
                                            height='48px'
                                            background={colorPalette.primaryColor}
                                            color={colorPalette.buttonTextColor}
                                            fontSize='20px'
                                            borderRadius='8px'
                                            _hover={{
                                                opacity: 0.7,
                                            }}
                                            onClick={onButtonClick}
                                            cursor={'pointer'}
                                            mb='32px'
                                        >
                                            {buttonText}
                                        </Button>
                                    </>
                                )}
                        </Flex>

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}