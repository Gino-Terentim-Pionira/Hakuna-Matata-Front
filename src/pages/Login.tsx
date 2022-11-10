import React, { BaseSyntheticEvent, useEffect, useState, useRef } from 'react';
import LoginRegister from '../components/LoginRegister';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
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

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [alertAnswer, setAlertAnswer] = useState<string>('');
	const [onError, setOnError] = useState(false);

	const onClose = () => setIsConfirmOpen(false);
	const cancelRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (authenticated) {
			history.replace('/mainPage');
		}
	}, [authenticated]);

	const _handleLogin = async () => {
		if (email && password) {
			try {
				const res = await handleLogin(email, password);
				if (typeof res == 'string') {
					setAlertAnswer(res);
					setIsConfirmOpen(true);
				}
			} catch (erro) {
				setOnError(true);
			}
		} else {
			setAlertAnswer('Ei, viajante! Para entrar na savana todos os campos precisam ser preenchidos!');
			setIsConfirmOpen(true);
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
				/>

				<AlertModal
					isOpen={isConfirmOpen}
					onClose={onClose}
					alertTitle='Login'
					alertBody={alertAnswer}

					buttonBody={
						<Button
							ref={cancelRef}
							color='white'
							bg={colorPalette.primaryColor}
							onClick={() => {
								onClose();
							}}
						>
							Continuar
						</Button>
					}
				/>

			</Center>
			<AlertModal
				isOpen={onError}
				onClose={() => window.location.reload()}
				alertTitle='Ops!'
				alertBody='Parece que ocorreu um erro durante a nossa viagem, Jovem! tente recarregar!'

				buttonBody={
					<Button
						color='white'
						bg={colorPalette.primaryColor}
						onClick={() => window.location.reload()}
					>
						Recarregar
					</Button>
				}
			/>
		</Flex>
	);
};

export default Login;
