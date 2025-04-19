import React, {useState, BaseSyntheticEvent, useEffect, useRef, ReactElement} from 'react';
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
import {validateEmail, validatePassword} from '../utils/validates';

// Components
import AlertModal from '../components/modals/AlertModal';

// Styles
import fontTheme from '../styles/base';
import colorPalette from '../styles/colorPalette';

// Images
import monkey from '../assets/sprites/monkey/new_monkey_happy.webp';
import axios from 'axios';
import { GENERIC_MODAL_TEXT } from '../utils/constants/buttonConstants';
import {NavSoundtrackIcon} from "../components/NavigationComponents/NavSoundtrackIcon";
import RenderConfirmationComponents from '../components/RenderConfirmationComponent';

export type screenInfoType = {
    mainText: string | ReactElement,
    firstText?: string,
    secondText?: string,
    firstPlaceholder?: string,
    secondPlaceholder?: string,
    firstInputType?: string,
    secondInputType?: string,
    firstValue?: string,
    firstChange?: (e: BaseSyntheticEvent) => void,
    onBlur?: (() => boolean) | (() => void),
    secondValue?: string,
    secondChange?: (e: BaseSyntheticEvent) => void,
    buttonText: string,
    tip?: string,
    noInput?: boolean,
    additionalComponents?: ReactElement,
    forgetPassword?: string,
    forgetPasswordLink?: VoidFunction
}

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
            action: () => { setStep(2); onClose() }
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

    const isValidName = () => {
        const firstname = formName.split(' ');
        const lastname = lastIndexValidation(firstname) as string;

        if (!formName || firstname[0] === lastname || lastname === ' ') {
            setValidationError("Preencha com seu nome completo");
            return true;
        } else {
            setValidationError('');
            return false;
        }
    }

    const isValidEmail = () => {
        if (formEmail.length > 254) {
            setValidationError("Email muito extenso");
            return true;
        }

        const valid = validateEmail(formEmail);
        if (!valid) {
            setValidationError("Formato de email inválido");
            return true;
        }

        const parts = formEmail.split("@");
        if (parts[0].length > 64) {
            setValidationError("Email muito extenso");
            return true;
        }
        setValidationError('');
        return false;

    }
    // controlar funcs de validacao

    const handleNameChanged = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setValidationError('');
        setFormName(event.target.value);
    }

    const handleEmailChanged = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setValidationError('');
        setFormEmail(event.target.value);
    }

    const handlePasswordChanged = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setValidationError('');
        setFormPassword(event.target.value);
    }

    const isValidPassword = () => {
        const IS_VALID_PASSWORD = validatePassword(formPassword);
        setValidationError(IS_VALID_PASSWORD.message);
    }

    const nextStep = async () => {
        if (step == 4) {
          history.push("/")
        } else if (step == 3) {
            if (formConfirmPassword && formPassword && !validationError) {
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

                        setStep(4);
                        setIsLoading(false);
                    } catch (err) {
                        if (axios.isAxiosError(err)) {
                            if (err.response) {
                                handleAlertModal(err.response.data.message);
                                setIsLoading(false);
                            }
                        }
                    }
                } else {
                    handleAlertModal('DIFFERENT_PASSWORDS_ERROR');
                }
            } else {
                handleAlertModal('MISSING_FIELDS_ERROR');
            }

        } else if (step == 2) {

            const invalidName = isValidEmail();

            if (formEmail && formDate && !invalidName) {
                setStep(step + 1);
            } else {
                handleAlertModal('MISSING_FIELDS_ERROR');
            }

        } else if (step == 1) {

            const invalidName = isValidName();

            if (formName && formUserName && !invalidName) {
                setStep(step + 1);
            } else {
                handleAlertModal('MISSING_FIELDS_ERROR');
            }

        }
    }

    const renderConfirmationComponents = () => (
        <RenderConfirmationComponents />
    )

    const screenInfo: {[key: number]: screenInfoType} = {
        1: {
            mainText: 'Vejo que temos um novo viajante por aqui. Antes de começarmos nossa aventura, gostaria de saber algumas coisas sobre você, viajante.',
            firstText: "”Qual é o seu nome, viajante?”",
            secondText: "”E como você gostaria de ser chamado dentro da savana?”",
            firstPlaceholder: "Nome Completo",
            secondPlaceholder: "Nome de Usuário",
            firstInputType: "text",
            secondInputType: "text",
            firstValue: formName,
            firstChange: (e: BaseSyntheticEvent) => handleNameChanged(e),
            onBlur: isValidName,
            secondValue: formUserName,
            secondChange: (e: BaseSyntheticEvent) => setFormUserName(e.target.value),
            buttonText: "Próximo"
        },
        2: {
            mainText: 'Agora preciso de outras informações adicionais. Não sei o que é isso, mas a sabedoria da Savana está me pedindo o seu e-mail.',
            firstText: "”Qual é o seu e-mail, viajante?”",
            secondText: "”Queria saber também qual a sua data de nascimento?”",
            firstPlaceholder: "Endereço de e-mail",
            secondPlaceholder: "Data de Nascimento",
            firstInputType: "email",
            secondInputType: "date",
            firstValue: formEmail,
            firstChange: (e: BaseSyntheticEvent) => handleEmailChanged(e),
            onBlur: isValidEmail,
            secondValue: formDate,
            secondChange: (e: BaseSyntheticEvent) => setFormDate(e.target.value),
            buttonText: "Próximo"
        },
        3: {
            mainText: 'Por último, precisamos definir uma senha para permitir a sua entrada na Savana. Lembre-se que não pode ser uma senha fácil de adivinhar, não queremos invasores na Savana.',
            firstText: "”Qual é a sua senha, viajante?”",
            secondText: "”Não entendi muito bem, poderia repeti-la?”",
            firstPlaceholder: "Senha",
            secondPlaceholder: "Confirmar senha",
            firstInputType: "password",
            secondInputType: "password",
            firstValue: formPassword,
            firstChange: (e: BaseSyntheticEvent) => handlePasswordChanged(e),
            onBlur: isValidPassword,
            secondValue: formConfirmPassword,
            secondChange: (e: BaseSyntheticEvent) => setFormConfirmPassword(e.target.value),
            buttonText: "Próximo"
        },
        4: {
            mainText: <>Tudo certo! <strong>Enviamos um “email” para você!</strong> Agora você só precisa <strong>entrar no seu email</strong> para <strong>confirmar o passaporte</strong>. Não sei o que significa, mas a sabedoria da savana me pediu para lhe dizer isso.</>,
            tip: 'Acesse o seu email para confirmar sua conta e completar o seu cadastro!',
            buttonText: "Confirmei minha conta!",
            noInput: true,
            additionalComponents: renderConfirmationComponents(),
        }
    }

    const previousStep = () => {
        if (step == 1) {
            history.push('/');
        } else {
            setStep(step - 1);
            setValidationError('');
        }
    }

    return (
        <Flex
            h='100vh'
            backgroundColor={colorPalette.backgroundColor}
            fontFamily={fontTheme.fonts}
            fontWeight='regular'
        >
            <NavSoundtrackIcon position="absolute" left="16px" top="12px" />
            <Center width='100%'>
                <LoginRegister
                    mainText={screenInfo[step].mainText}
                    firstText={screenInfo[step].firstText}
                    secondText={screenInfo[step].secondText}
                    firstPlaceholder={screenInfo[step].firstPlaceholder}
                    secondPlaceholder={screenInfo[step].secondPlaceholder}
                    nextStep={() => nextStep()}
                    previousStep={step === 4 ? undefined : () => previousStep()}
                    firstInputType={screenInfo[step].firstInputType}
                    secondInputType={screenInfo[step].secondInputType}
                    firstValue={screenInfo[step].firstValue}
                    firstChange={screenInfo[step].firstChange}
                    onBlur={screenInfo[step].onBlur}
                    secondValue={screenInfo[step].secondValue}
                    secondChange={screenInfo[step].secondChange}
                    buttonText={screenInfo[step].buttonText}
                    validationError={validationError}
                    hasValidationError={!!validationError}
                    loading={isLoading}
                    hasTerms={step === 3}
                    additionalComponents={screenInfo[step].additionalComponents}
                    tip={screenInfo[step].tip}
                    noInput={screenInfo[step].noInput}
                />

                {(step === 3 && !!validationError) ? (
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
                                _hover={{ bg: colorPalette.primaryColor }}
                                bg={colorPalette.primaryColor}
                                onClick={alertModal.action}
                            >
                                {GENERIC_MODAL_TEXT}
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
                                _hover={{ bg: colorPalette.primaryColor }}
                                bg={colorPalette.primaryColor}
                                onClick={alertModal.action}
                            >
                                {GENERIC_MODAL_TEXT}
                            </Button>
                        }
                    />
                )}
                <Image
                    display={{ base: "none", md: "block" }}
                    zIndex="1"
                    width="25%"
                    src={monkey}
                    maxW="400px"
                    minW="300px"
                    alt='Image'
                    ml="8px"
                    mr="24px"
                />
                <Box
                    display={{ base: "none", md: "block" }}
                    w="27%"
                    bg={colorPalette.primaryColor}
                    h="100vh"
                    position="absolute"
                    zIndex='0'
                    right="0"
                />
            </Center>
        </Flex>

    );
}

export default Register;
