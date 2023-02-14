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

// Images
import monkey from '../assets/sprites/monkey/newMonkeyHappy.png';

const Login = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const history = useHistory();
	const { handleLogin, authenticated } = useAuth();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [alertModal, setAlertModal] = useState({
		alertAnswer: '',
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

	const ERROR_TYPES: {
		[key: string]: {
			label: string,
			action: VoidFunction
		}
	} = {
		'MISSING_FIELDS_ERROR': {
			label: errorCases.MISSING_FIELDS_ERROR,
			action: onClose
		},
		'SERVER_ERROR': {
			label: errorCases.SERVER_ERROR,
			action: () => window.location.reload()
		},
		'NON_EXISTING_EMAIL_ERROR': {
			label: errorCases.NON_EXISTING_EMAIL_ERROR,
			action: onClose
		},
		'WRONG_PASSWORD_ERROR': {
			label: errorCases.WRONG_PASSWORD_ERROR,
			action: onClose
		},
		'USER_IS_NOT_CONFIRMED_ERROR': {
			label: errorCases.USER_IS_NOT_CONFIRMED_ERROR,
			action: onClose
		},
		'FAILED_LOGIN_ERROR': {
			label: errorCases.FAILED_LOGIN_ERROR,
			action: onClose
		}
	}

	const handleAlertModal = (erroTypes: string) => {
		setAlertModal({
			alertAnswer: ERROR_TYPES[erroTypes].label,
			isOpen: true,
			action: ERROR_TYPES[erroTypes].action
		});
	}

	const _handleLogin = async () => {
		if (email && password) {
			try {
				setIsLoading(true);
				const res = await handleLogin(email, password);
				if (typeof res == 'string') {
					handleAlertModal(res);
					setIsLoading(false);
				}
			} catch (erro) {
				handleAlertModal('SERVER_ERROR');
				setIsLoading(false);
			}
		} else {
			handleAlertModal('MISSING_FIELDS_ERROR');
		}
	};

	const previousStep = () => {
		history.push('/');
	};

	const goToForgotPassword = () => {
		history.push('/forgotPassword');
	};

	return (
		<Flex
			h='100vh'
			backgroundColor={colorPalette.backgroundColor}
			fontFamily={fontTheme.fonts}
			fontWeight='regular'
		>
			<Center width='100%'>
				<LoginRegister
					mainText='Seja bem vindo de volta ao Pionira. Para entrar na Savana preciso que você me fale seu e-mail e sua senha.'
					firstText='”Qual é o seu e-mail, jovem?”'
					secondText='”E qual a sua senha?”'
					firstPlaceholder='E-mail'
					secondPlaceholder='Senha'
					firstValue={email}
					firstChange={(e: BaseSyntheticEvent) =>
						setEmail(e.target.value)
					}
					secondValue={password}
					secondChange={(e: BaseSyntheticEvent) =>
						setPassword(e.target.value)
					}
					firstInputType='email'
					secondInputType='password'
					nextStep={() => _handleLogin()}
					previousStep={() => previousStep()}
					forgetPassword='Esqueci minha senha'
					forgetPasswordLink={() => goToForgotPassword()}
					buttonText='Próximo'
					loading={isLoading}
				/>

				<Image zIndex="1" width="25%" src={monkey} maxW="400px" minW="300px" alt='Image' ml="8px" mr="24px" />
				<Box w="27%" bg={colorPalette.primaryColor} h="100vh" position="absolute" zIndex='0' right="0" />
			</Center>

			<AlertModal
				isOpen={alertModal.isOpen}
				onClose={onClose}
				alertTitle='Entrada da Savana'
				alertBody={alertModal.alertAnswer}
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
		</Flex>
	);
};

export default Login;
