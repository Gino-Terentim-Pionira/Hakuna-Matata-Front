import { Flex, Center, Box, Text, Input, Button, Link, Image } from '@chakra-ui/react';
import React, { ChangeEventHandler, FC, useState } from 'react';
import fontTheme from '../styles/base';
import colorPalette from '../styles/colorPalette';
import closed_eye from '../assets/icons/closed-eye.png';
import eye from '../assets/icons/eye.png'

type LoginRegisterProps = {
    mainText: string;
    firstText: string;
    secondText?: string;
    firstPlaceholder: string;
    secondPlaceholder?: string;
    firstInputType: string;
    secondInputType?: string;
    firstValue: string;
    secondValue?: string;
    firstChange: ChangeEventHandler;
    secondChange?: ChangeEventHandler;
    nextStep: VoidFunction;
    previousStep: VoidFunction;
    buttonText: string;
    forgetPassword?: string;
    forgetPasswordLink?: VoidFunction;
    validationError?: string;
    hasValidationError?: boolean;
    loading: boolean;
}

const LoginRegister: FC<LoginRegisterProps> = ({
    mainText,
    firstText,
    secondText,
    firstValue,
    secondValue,
    firstChange,
    secondChange,
    firstPlaceholder,
    secondPlaceholder,
    firstInputType,
    secondInputType,
    nextStep,
    previousStep,
    forgetPassword,
    forgetPasswordLink,
    buttonText,
    validationError,
    hasValidationError,
    loading
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputElement = event.target as HTMLInputElement;
            inputElement.blur();
            nextStep();
        }
    }

    const renderPassword = (placeholder: string, type: string, value: string, onChange: VoidFunction, loading: boolean, onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void) => (
        <Box w="60%" minWidth="250px" position="relative">
            <Input
                width="100%"
                minWidth="250px"
                height="60px"
                borderColor={colorPalette.secundaryGrey}
                marginTop='4px'
                placeholder={placeholder}
                type={isPasswordVisible ? undefined : type}
                value={value}
                onChange={onChange}
                disabled={loading}
                onKeyDown={onKeyDown}
            />
            {
                type === 'password' && <Image
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    zIndex={100000}
                    _hover={{ cursor: 'pointer' }}
                    width="28px"
                    src={isPasswordVisible ? eye : closed_eye}
                    alt="Mostrar senha"
                    position="absolute"
                    top="32%"
                    right="16px"
                />
            }

        </Box>
    )

    return (
        <Flex
            width="55%"
            height="100vh"
            padding="80px 0 60px 32px"
            flexDir="column"
            justifyContent="space-between"
            fontFamily={fontTheme.fonts}
        >
            <Flex
                flexDir="column"
            >
                <Flex
                    width="100%"
                    height="fit-content"
                    maxHeight="200px"
                    minH="100px"
                    border={`2px solid ${colorPalette.secundaryGrey}`}
                    borderRadius='8px'
                    padding="16px 16px"
                >
                    <Text
                        fontSize={{ base: "14px", md: '16px', lg: '20px' }}
                        color={colorPalette.textColor}
                        width="100%"
                    >
                        {mainText}
                    </Text>
                </Flex>
                <Box marginTop="32px">
                    <Text
                        fontSize={{ base: "14px", md: '16px', lg: '18px' }}
                        color={colorPalette.textColor}
                    >
                        {firstText}
                    </Text>
                    {renderPassword(
                        firstPlaceholder as string,
                        firstInputType as string,
                        firstValue as string,
                        firstChange as VoidFunction,
                        loading,
                        handleKeyPress
                    )}
                    <Text color="red" fontSize="15"> {validationError} </Text>

                </Box>
                <Box marginTop="16px">
                    {secondText || secondValue || secondPlaceholder ? (
                        <>
                            <Text
                                fontSize={{ base: "14px", md: '16px', lg: '18px' }}
                                color={colorPalette.textColor}
                            >
                                {secondText}
                            </Text>
                            {renderPassword(
                                secondPlaceholder as string,
                                secondInputType as string,
                                secondValue as string,
                                secondChange as VoidFunction,
                                loading,
                                handleKeyPress
                            )}
                        </>
                    ) : (null)}

                    {forgetPassword ? (
                        <Box display="flex" justifyContent="flex-start" marginTop='8px'>
                            <Link
                                color={colorPalette.linkTextColor}
                                fontSize="1rem"
                                textDecoration="underline"
                                onClick={loading ? () => { return null } : forgetPasswordLink}
                                _hover={loading ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
                            >
                                Esqueci minha senha
                            </Link>
                        </Box>) : (
                            null
                        )}
                </Box>
            </Flex>

            <Box w='70%' h='fit-content'>
                <Center marginTop='1rem'>
                    <Button
                        width='100%'
                        height='50px'
                        background={loading ? colorPalette.neutralGray : colorPalette.primaryColor}
                        color={colorPalette.buttonTextColor}
                        fontSize='1.7rem'
                        onClick={nextStep}
                        _hover={{}}
                        loadingText="Enviando"
                        isLoading={loading}
                        spinnerPlacement='end'
                    >
                        {buttonText}
                    </Button>
                </Center>

                <Box display='flex' justifyContent='flex-end'>
                    <Link
                        marginTop='8px'
                        color={colorPalette.linkTextColor}
                        textDecoration='underLine'
                        onClick={loading ? () => { return null } : previousStep}
                        _hover={loading ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
                    >
                        Voltar
                    </Link>
                </Box>
            </Box>
        </Flex >
    );
}

export default LoginRegister;
