import { Flex, Center, Box, Text, Input, Button, Link, Image, InputGroup, InputRightElement } from '@chakra-ui/react';
import React, { ChangeEventHandler, FC, useState, ReactElement, useRef, useEffect } from 'react';
import fontTheme from '../styles/base';
import colorPalette from '../styles/colorPalette';
import closed_eye from '../assets/icons/closed-eye.png';
import eye from '../assets/icons/eye.png'
import TermsPolicyModal from './modals/TermsPolicyModal/TermsPolicyModal';
import TermsOfUse from './modals/TermsPolicyModal/TermsComponent/TermsOfUse';
import PrivacyPolicy from './modals/TermsPolicyModal/TermsComponent/PrivacyPolicy';

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
    hasTerms?: boolean;
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
    loading,
    hasTerms
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalBody, setModalBody] = useState<ReactElement>();
    const inputRef = useRef<HTMLInputElement>(null);
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputElement = event.target as HTMLInputElement;
            inputElement.blur();
            handleNextStep();
        }
    }

    const focusOnFirstInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
          }
    }

    const handleNextStep = () => {
        nextStep();
        focusOnFirstInput();
    }

    useEffect(() => {
        focusOnFirstInput();
      }, []);

    const renderPassword = (
        placeholder: string,
        type: string,
        value: string,
        onChange: VoidFunction,
        loading: boolean,
        onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void,
        isFirstInput?: boolean
    ) => (
            <InputGroup display="flex" alignItems="center" w="60%" minWidth="250px" position="relative">
                <Input
                    ref={isFirstInput ? inputRef : null}
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
                    focusBorderColor={hasValidationError && isFirstInput ? "#F47070" : "#4161ed"}
                />
                {
                    type === 'password' &&
                    <InputRightElement right="8px" top="auto">
                        <Image
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            zIndex={10000}
                            _hover={{ cursor: 'pointer' }}
                            width="28px"
                            src={isPasswordVisible ? eye : closed_eye}
                            alt="Mostrar senha"
                        />
                    </InputRightElement>
                }

            </InputGroup>
        )
    
    const handleTermsOfUse = () => {
        setModalTitle('Termos de Uso');
        setModalBody(<TermsOfUse />);
        setIsOpen(true);
    }

    const handlerPrivacyPolicy = () => {
        setModalTitle('Política de Privacidade');
        setModalBody(<PrivacyPolicy />);
        setIsOpen(true);
    }

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
                        handleKeyPress,
                        true
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
                    
                    {
                        hasTerms ? (
                            <Flex
                                flexDirection='column'
                                alignSelf='flex-start'
                                textAlign='justify'
                                fontFamily={fontTheme.fonts}
                                fontSize='14px'
                                marginTop='16px'
                            >
                                <Text>
                                    Ao clicar em Continuar, você concorda com nossos <Link
                                        color={colorPalette.linkTextColor}
                                        textDecoration='underLine'
                                        onClick={handleTermsOfUse}
                                    >Termos de uso</Link> e <Link
                                        color={colorPalette.linkTextColor}
                                        textDecoration='underLine'
                                        onClick={handlerPrivacyPolicy}
                                    >Política de Privacidade</Link>
                                </Text>
                            </Flex>
                        ) :
                        null
                    }
                </Box>
            </Flex>

            <Box w='70%' h='fit-content'>
                <Center 
                    marginTop='1rem'
                    flexDirection='column'
                >
                    <Button
                        width='100%'
                        height='50px'
                        background={loading ? colorPalette.neutralGray : colorPalette.primaryColor}
                        color={colorPalette.buttonTextColor}
                        fontSize='1.7rem'
                        onClick={handleNextStep}
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
            <TermsPolicyModal 
                isOpen={isOpen}
                modalSize='md'
                onClose={()=>{setIsOpen(false)}}
                modalTitle={modalTitle}
                modalBody={modalBody}
            />
        </Flex >
    );
}

export default LoginRegister;
