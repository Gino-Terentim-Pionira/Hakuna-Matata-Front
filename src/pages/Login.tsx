import React, { BaseSyntheticEvent, useEffect, useState, useRef } from 'react';
import LoginRegister from '../components/LoginRegister';
import { useHistory } from 'react-router-dom';
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
import "./styles/Login.css";

// Images
import monkey from '../assets/sprites/monkey/new_monkey_happy.webp';
import { GENERIC_MODAL_TEXT, CREATE_PASSAPORT, AGREE } from '../utils/constants/buttonConstants';
import { validateEmail } from "../utils/validates";
import { NavSoundtrackIcon } from "../components/NavigationComponents/NavSoundtrackIcon";
import { screenInfoType } from './Register';
import RenderConfirmationComponents from '../components/RenderConfirmationComponent';
import { UserServices } from '../services/UserServices';

const Login = () => {
	const [email, setEmail] = useState<string>('');
	const [emailError, setEmailError] = useState('');
	const [password, setPassword] = useState<string>('');
	const history = useHistory();
	const { handleLogin, authenticated } = useAuth();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [step, setStep] = useState(1);
	const userService = new UserServices();

	const [alertModal, setAlertModal] = useState({
		alertAnswer: '',
		buttonLabel: '',
		isOpen: false,
		action: () => console.log()
	});

	const onClose = () => setAlertModal({
		...alertModal,
		isOpen: false
	});
	const cancelRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (authenticated) {
			history.replace('/mainPage');
		}
	}, [authenticated]);

	const handleConfirmateEmail = async () => {
		setStep(2);
		onClose();
		try {
			await userService.resendConfirmation(email);
		} catch (error) {
			const errorMessage = error.response?.data.error || 'SERVER_ERROR';
			handleAlertModal(errorMessage);
		}
	}

	const ERROR_TYPES: {
		[key: string]: {
			label: string,
			buttonLabel: string,
			action: VoidFunction
		}
	} = {
		'MISSING_FIELDS_ERROR': {
			label: errorCases.MISSING_FIELDS_ERROR,
			buttonLabel: GENERIC_MODAL_TEXT,
			action: onClose
		},
		'SERVER_ERROR': {
			label: errorCases.SERVER_ERROR,
			buttonLabel: GENERIC_MODAL_TEXT,
			action: () => window.location.reload()
		},
		'NON_EXISTING_EMAIL_ERROR': {
			label: errorCases.NON_EXISTING_EMAIL_ERROR,
			buttonLabel: CREATE_PASSAPORT,
			action: () => goToPassaport()
		},
		'WRONG_PASSWORD_ERROR': {
			label: errorCases.WRONG_PASSWORD_ERROR,
			buttonLabel: GENERIC_MODAL_TEXT,
			action: onClose
		},
		'USER_IS_NOT_CONFIRMED_ERROR': {
			label: errorCases.USER_IS_NOT_CONFIRMED_ERROR,
			buttonLabel: AGREE,
			action: handleConfirmateEmail
		},
		'FAILED_LOGIN_ERROR': {
			label: errorCases.FAILED_LOGIN_ERROR,
			buttonLabel: GENERIC_MODAL_TEXT,
			action: onClose
		},
		'INVALID_EMAIL': {
			label: errorCases.INVALID_EMAIL_ERROR,
			buttonLabel: GENERIC_MODAL_TEXT,
			action: onClose
		}
	}

	const handleAlertModal = (erroTypes: string) => {
		setAlertModal({
			alertAnswer: ERROR_TYPES[erroTypes].label,
			buttonLabel: ERROR_TYPES[erroTypes].buttonLabel,
			isOpen: true,
			action: ERROR_TYPES[erroTypes].action
		});
	}

	const _handleLogin = async () => {
		if (step === 1) {
			if (email && password) {
				try {
					if (emailError) {
						handleAlertModal('INVALID_EMAIL');
						return
					}

					setIsLoading(true);
					await handleLogin(email, password);
				} catch (error) {
					const errorMessage = error.response?.data.error || 'SERVER_ERROR';
					handleAlertModal(errorMessage);
					setIsLoading(false);
				}
			} else {
				handleAlertModal('MISSING_FIELDS_ERROR');
			}
		} else {
			setStep(1);
		}
	};

	const goToPassaport = () => {
		history.push('/register');
	}

	const previousStep = () => {
		history.push('/');
	};

	const goToForgotPassword = () => {
		history.push('/forgotPassword');
	};

	const handleEmailChanges = (event: { target: { value: React.SetStateAction<string> } }) => {
		setEmailError('');
		setEmail(event.target.value);
	}

	const isValidEmail = () => {
		const valid = validateEmail(email);
		if (!valid) {
			setEmailError("Formato de email inválido");
			return true;
		} else {
			setEmailError('')
		}
	}

	const renderConfirmationComponents = () => (
		<RenderConfirmationComponents />
	)

	const screenInfo: { [key: number]: screenInfoType } = {
		1: {
			mainText: 'Seja bem vindo de volta ao Pionira. Para entrar na Savana preciso que você me fale seu e-mail e sua senha.',
			firstText: '”Qual é o seu e-mail, viajante?”',
			secondText: '”E qual a sua senha?”',
			firstPlaceholder: 'E-mail',
			secondPlaceholder: 'Senha',
			firstInputType: 'email',
			secondInputType: 'password',
			firstValue: email,
			firstChange: (e: BaseSyntheticEvent) => handleEmailChanges(e),
			onBlur: isValidEmail,
			secondValue: password,
			secondChange: (e: BaseSyntheticEvent) => setPassword(e.target.value),
			buttonText: "Próximo",
			forgetPassword: 'Esqueci minha senha',
			forgetPasswordLink: () => goToForgotPassword()

		},
		2: {
			mainText: <>Tudo certo! <strong>Enviamos um “email” para você!</strong> Agora você só precisa <strong>entrar no seu email</strong> para <strong>confirmar o passaporte</strong>. Não sei o que significa, mas a sabedoria da savana me pediu para lhe dizer isso.</>,
			tip: 'Acesse o seu email para confirmar sua conta e completar o seu cadastro!',
			buttonText: "Confirmei minha conta!",
			noInput: true,
			additionalComponents: renderConfirmationComponents(),
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
					firstValue={screenInfo[step].firstValue}
					firstChange={screenInfo[step].firstChange}
					onBlur={screenInfo[step].onBlur}
					secondValue={screenInfo[step].secondValue}
					secondChange={screenInfo[step].secondChange}
					firstInputType={screenInfo[step].firstInputType}
					secondInputType={screenInfo[step].secondInputType}
					nextStep={() => _handleLogin()}
					previousStep={() => previousStep()}
					forgetPassword={screenInfo[step].forgetPassword}
					forgetPasswordLink={screenInfo[step].forgetPasswordLink}
					buttonText={screenInfo[step].buttonText}
					loading={isLoading}
					validationError={emailError}
					hasValidationError={!!emailError}
					additionalComponents={screenInfo[step].additionalComponents}
					tip={screenInfo[step].tip}
					noInput={screenInfo[step].noInput}
				/>

				<Image className="register_container_image" zIndex="1" width="25%" src={monkey} maxW="400px" minW="300px" alt='Image' ml="8px" mr="24px" />
				<Box className="register_container_bar" w="27%" bg={colorPalette.primaryColor} h="100vh" position="absolute" zIndex='0' right="0" />
			</Center>

			<AlertModal
				isOpen={alertModal.isOpen}
				onClose={onClose}
				alertTitle='Entrada da Savana'
				alertBody={alertModal.alertAnswer}
				buttonBody={
					<Box>
						<Button
							ref={cancelRef}
							color='white'
							_hover={{ bg: colorPalette.closeButton }}
							bg={colorPalette.closeButton}
							onClick={onClose}
							marginRight='8px'
						>
							Cancelar
						</Button>
						<Button
							ref={cancelRef}
							color='white'
							_hover={{ bg: colorPalette.primaryColor }}
							bg={colorPalette.primaryColor}
							onClick={alertModal.action}
						>
							{alertModal.buttonLabel}
						</Button>
					</Box>
				}
			/>
		</Flex>
	);
};

export default Login;
