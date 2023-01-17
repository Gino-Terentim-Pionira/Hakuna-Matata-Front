import React, { useState, BaseSyntheticEvent, useEffect, useRef } from 'react';
import LoginRegister from '../components/LoginRegister';
import { useHistory } from 'react-router-dom';
import { CreateUser } from '../services/createUser';
import { useAuth } from '../contexts/authContext';
import { errorCases } from '../utils/errors/errorsCases';
import {
    Flex,
    Center,
    Box,
    Image,
    Button,
} from '@chakra-ui/react';

// Components
import AlertModal from '../components/modals/AlertModal';

// Styles
import fontTheme from '../styles/base';
import colorPalette from '../styles/colorPalette';

// Images
import monkey from '../assets/sprites/monkey/monkeyHappy.png';

const Register = () => {

    // Declara os field e step do formulário 
    const [step, setStep] = useState(1);

    const [formName, setFormName] = useState('');
    const [formUserName, setFormUserName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formDate, setFormDate] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [formConfirmPassword, setFormConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState('');
    const [hasValidationError, setHasValidationError] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [alertModal, setAlertModal] = useState({
        isOpen: false,
        alertAnswer: '',
        action: () => console.log(),
    });
    const cancelRef = useRef<HTMLButtonElement>(null);
    const onClose = () => setAlertModal({
        ...alertModal,
        isOpen: false
    });

    const history = useHistory();

    const { authenticated } = useAuth();

    useEffect(() => {
        if (authenticated) {
            history.replace('/mainPage');
        }
    }, [authenticated]);

    const ERROR_TYPES: {
        [key: string]: {
            label: string,
            action: VoidFunction
        }
    } = {
        'SMALL_PASSWORD_ERROR': {
            label: errorCases.SMALL_PASSWORD_ERROR,
            action: onClose
        },
        'INVALID_NAME_ERROR': {
            label: errorCases.INVALID_NAME_ERROR,
            action: onClose
        },
        'INVALID_EMAIL_ERROR': {
            label: errorCases.INVALID_EMAIL_ERROR,
            action: onClose,
        },
        'DIFFERENT_PASSWORDS_ERROR': {
            label: errorCases.DIFFERENT_PASSWORDS_ERROR,
            action: onClose
        },
        'MISSING_FIELDS_ERROR': {
            label: errorCases.MISSING_FIELDS_ERROR,
            action: onClose
        },
        'SENDING_EMAIL_PROBLEM_ERROR': {
            label: errorCases.SENDING_EMAIL_PROBLEM_ERROR,
            action: onClose
        },
        'DUPLICATE_EMAIL_ERROR': {
            label: errorCases.DUPLICATE_EMAIL_ERROR,
            action: () => {setStep(2); onClose()}
        },
        'SUCCESS_CASE_REGISTER': {
            label: errorCases.SUCCESS_CASE_REGISTER,
            action: () => history.push('/login')
        }
    };

    const handleAlertModal = (erroType: string) => {
        setAlertModal({
            ...alertModal,
            isOpen: !alertModal.isOpen,
            alertAnswer: ERROR_TYPES[erroType].label,
            action: ERROR_TYPES[erroType].action
        })
    }

    const lastIndexValidation = (name: string[]) => {
        for (let i = 1; i <= name.length; i++) {
            const last = name.length - i;
            if (name[last] !== '') {
                return (name[last]);
            }
        }
    }
    // Declara os metodos que vai rotacionar os steps
    const validatePassword = () => {
        if (formPassword.length < 6) {
            setValidationError("Senha muito pequena");
            setHasValidationError(true);
            return true;
        } else {
            setValidationError('');
            setHasValidationError(false);
            return false;
        }
    }

    const validateName = () => {
        const firstname = formName.split(' ');
        const lastname = lastIndexValidation(firstname) as string;

        if (firstname[0] === lastname || lastname === ' ') {
            setValidationError("Escreva um nome válido");
            setHasValidationError(true);
            return true;
        } else {
            setValidationError('');
            setHasValidationError(false);
            return false;
        }
    }

    const validateEmail = () => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (formEmail.length > 254) {
            setValidationError("Email muito extenso");
            setHasValidationError(true);
            return true;
        }

        const valid = emailRegex.test(formEmail);
        if (!valid) {
            setValidationError("Formato de email inválido");
            setHasValidationError(true);
            return true;
        }

        const parts = formEmail.split("@");
        if (parts[0].length > 64) {
            setValidationError("Email muito extenso");
            setHasValidationError(true);
            return true;
        }
        setHasValidationError(false);
        setValidationError('');
        return false;

    }
    // controlar funcs de validacao

    const handleNameChanged = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setFormName(event.target.value);
        validateName();
    }

    const handleEmailChanged = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setFormEmail(event.target.value);
        validateEmail();
    }

    const handlePasswordChanged = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setFormPassword(event.target.value);
        validatePassword();
    }

    const nextStep = async () => {
        if (step == 3) {
            const invalidPassword = validatePassword();
            if (formConfirmPassword && formPassword && !invalidPassword) {
                if (formPassword === formConfirmPassword) {
                    try {
                        setIsLoading(true);
                        const name = formName.split(' ');
                        let lastName = name[1];

                        if (name.length > 2) {
                            for (let i = 2; i < name.length; i++) {
                                lastName = lastName + " " + name[i];
                            }
                        }

                        await CreateUser(name[0], lastName, formEmail, formPassword, formDate, formUserName);

                        handleAlertModal('SUCCESS_CASE_REGISTER');

                    } catch (err) {
                        handleAlertModal(err.response.data.message);
                        setIsLoading(false);
                    }
                } else {
                    handleAlertModal('DIFFERENT_PASSWORDS_ERROR');
                }
            } else {
                handleAlertModal('MISSING_FIELDS_ERROR');
            }

        } else if (step == 2) {

            const invalidName = validateEmail();

            if (formEmail && formDate && !invalidName) {
                setStep(step + 1);
            } else {
                handleAlertModal('MISSING_FIELDS_ERROR');
                setHasValidationError(true);
            }

        } else if (step == 1) {

            const invalidName = validateName();

            if (formName && formUserName && !invalidName) {
                setStep(step + 1);
            } else {
                handleAlertModal('MISSING_FIELDS_ERROR');
                setHasValidationError(true);
            }

        }
    }

    const previousStep = () => {
        if (step == 1) {
            history.push('/');
        } else {
            setStep(step - 1);
        }
    }

    return (
        <Flex
            h='100vh'
            backgroundColor={colorPalette.backgroundColor}
            fontFamily={fontTheme.fonts}
            fontWeight='regular'
        >
            <Box w="40%" bg={colorPalette.primaryColor} h="100vh" position="absolute" zIndex='0' left="0" top="0" clipPath="polygon(0% 0%, 85% 0, 40% 100%, 0 100%)"></Box>
            <Center width='100%' >
                <Box
                    display='flex'
                    alignItems='center'
                    w='40%'
                    h='90%'
                    zIndex='1'
                    backgroundColor='transparent'
                    marginLeft='3rem'
                >
                    <Image w='100%' src={monkey} alt='Image' />
                </Box>

                {step === 1 ? (
                    <LoginRegister
                        firstText="Vejo que temos um novo aventureiro por aqui, antes de começarmos nossa aventura, gostaria de saber quem é você, caro viajante?"
                        secondText="E como você gostaria de ser chamado?"
                        firstPlaceholder="Nome Completo"
                        secondPlaceholder="Nome de Usuário"
                        nextStep={() => nextStep()}
                        previousStep={() => previousStep()}
                        firstInputType="text"
                        secondInputType="text"
                        firstValue={formName}
                        firstChange={(e: BaseSyntheticEvent) => handleNameChanged(e)}
                        secondValue={formUserName}
                        secondChange={(e: BaseSyntheticEvent) => setFormUserName(e.target.value)}
                        buttonText="Próximo"
                        validationError={validationError}
                        hasValidationError={hasValidationError}
                        loading={false}
                    />

                ) : step === 2 ? (
                    <LoginRegister
                        firstText="Aqui no formulário está dizendo que preciso do seu 'e-mail'. Não sei o que é isso, mas você deve saber!"
                        secondText="Queria saber também, que ano e dia você nasceu?"
                        firstPlaceholder="Endereço de e-mail"
                        secondPlaceholder="Data de Nascimento"
                        nextStep={() => nextStep()}
                        previousStep={() => previousStep()}
                        firstInputType="email"
                        secondInputType="date"
                        firstValue={formEmail}
                        firstChange={(e: BaseSyntheticEvent) => handleEmailChanged(e)}
                        secondValue={formDate}
                        secondChange={(e: BaseSyntheticEvent) => setFormDate(e.target.value)}
                        buttonText="Próximo"
                        validationError={validationError}
                        hasValidationError={hasValidationError}
                        loading={false}
                    />
                ) : step === 3 ? (
                    <LoginRegister
                        firstText="Agora vamos colocar uma senha secreta para permitir sua entrada na savana"
                        secondText="Não ouvi muito bem, poderia repeti-lá?"
                        firstPlaceholder="Senha"
                        secondPlaceholder="Confirmar senha"
                        nextStep={() => nextStep()}
                        previousStep={() => previousStep()}
                        firstInputType="password"
                        secondInputType="password"
                        firstValue={formPassword}
                        firstChange={(e: BaseSyntheticEvent) => handlePasswordChanged(e)}
                        secondValue={formConfirmPassword}
                        secondChange={(e: BaseSyntheticEvent) => setFormConfirmPassword(e.target.value)}
                        buttonText="Próximo"
                        validationError={validationError}
                        hasValidationError={hasValidationError}
                        loading={isLoading}
                    />
                ) : (
                    <div>Você não devia estar aqui, chapa!</div>
                )}

                {(step === 3 && !hasValidationError) ? (
                    <AlertModal
                        isOpen={alertModal.isOpen}
                        onClose={onClose}
                        alertTitle='Criação do Passaporte'
                        alertBody={alertModal.alertAnswer}
                        onClickClose={() => onClose()}
                        buttonBody={
                            <Button
                                ref={cancelRef}
                                color='white'
                                bg={colorPalette.primaryColor}
                                onClick={alertModal.action}
                            >
                                Continuar
                            </Button>
                        }
                    />
                ) : (

                    <AlertModal
                        isOpen={alertModal.isOpen}
                        onClose={onClose}
                        alertTitle='Criação do Passaporte'
                        alertBody={alertModal.alertAnswer}
                        onClickClose={() => onClose()}
                        buttonBody={
                            <Button
                                ref={cancelRef}
                                color='white'
                                bg={colorPalette.primaryColor}
                                onClick={alertModal.action}
                            >
                                Continuar
                            </Button>
                        }
                    />
                )}

            </Center>
        </Flex>
    );
}

export default Register;
