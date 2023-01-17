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
import monkey from '../assets/sprites/monkey/monkeyHappy.png';

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

	const ERROR_TYPES: {[key: string]: {
		label: string,
		action: VoidFunction
	}} = {
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
			<Box
				w='40%'
				bg={colorPalette.primaryColor}
				h='100vh'
				position='absolute'
				zIndex='0'
				left='0'
				top='0'
				clipPath='polygon(0% 0%, 85% 0, 40% 100%, 0 100%)'
			></Box>
			<Center width='100%'>
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
				<LoginRegister
					firstText='Seja bem vindo de volta ao Pionira, para entrar na savana preciso que você me fale seu e-mail e sua senha secreta.'
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
			</Center>
		</Flex>
	);
};

export default Login;
