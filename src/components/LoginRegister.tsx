import { Flex, Center, Box, Text, Input, Button, Link } from '@chakra-ui/react';
import React, { ChangeEventHandler, FC } from 'react';
import colorPalette from '../styles/colorPalette';

type LoginRegisterProps = {
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
}

const LoginRegister: FC<LoginRegisterProps> = ({
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
    hasValidationError
}) => {
    return (
        <Flex
            w='35%'
            h='80%'
            border='1px solid'
            borderColor={colorPalette.inputBoder}
            color='Black'
            borderRadius='8px'
            flexDirection='column'
            align='center'
            justifyContent='space-between'
            marginLeft='1rem'
        >
            <Box
                width='90%'
                h='93%'
                marginTop='2.2rem'
                fontSize={[13, 15, 18, 22]}
            >
                <Text w='100%'> {firstText} </Text>
                <Input
                    borderColor={colorPalette.inputBoder}
                    marginTop='1rem'
                    isInvalid={hasValidationError}
                    focusBorderColor={hasValidationError ? "#red" : "#4161ed"}
                    color={colorPalette.textColor}
                    h='13%'
                    placeholder={firstPlaceholder}
                    type={firstInputType}
                    value={firstValue}
                    onChange={firstChange}
                />
                <Text color="red" fontSize="15"> {validationError} </Text>


                {secondText || secondValue || secondPlaceholder ? (
                    <>
                        <Text marginTop='6%'> {secondText}</Text>
                        <Input
                            borderColor={colorPalette.inputBoder}
                            marginTop='1rem'
                            h='13%'
                            placeholder={secondPlaceholder}
                            type={secondInputType}
                            value={secondValue}
                            onChange={secondChange}
                        />
                    </>
                ) : (null)}

                {forgetPassword ? (
                    <Box display="flex" justifyContent="flex-end" marginTop='0.5rem'>
                        <Link
                            color={colorPalette.linkTextColor}
                            fontSize="1rem"
                            textDecoration="underline"
                            onClick={forgetPasswordLink}
                        >
                            Esqueci minha senha
                        </Link>
                    </Box>) : (
                    null
                )}

            </Box>
            <Box w='70%' h='30%'>
                <Center marginTop='1rem'>
                    <Button
                        width='100%'
                        height='3rem'
                        background={colorPalette.primaryColor}
                        color={colorPalette.buttonTextColor}
                        fontSize='1.7rem'
                        onClick={nextStep}
                    >
                        {buttonText}
                    </Button>
                </Center>

                <Box display='flex' justifyContent='flex-end'>
                    <Link
                        marginTop='0.3rem'
                        color={colorPalette.linkTextColor}
                        textDecoration='underLine'
                        onClick={previousStep}
                    >
                        Voltar
                    </Link>
                </Box>
            </Box>
        </Flex>
    );
}

export default LoginRegister;
