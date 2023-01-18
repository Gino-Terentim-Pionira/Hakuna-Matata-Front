import React, { BaseSyntheticEvent, useEffect, useState, useRef } from 'react';
import { Flex, Center, Box, Image, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

// Components
import LoginRegister from '../components/LoginRegister';
import AlertModal from '../components/modals/AlertModal';

// Requisitions
import api from '../services/api';
import { useAuth } from '../contexts/authContext';

// Styles
import fontTheme from '../styles/base';
import colorPalette from "../styles/colorPalette";

// Images
import monkey from '../assets/sprites/monkey/monkey.png';

const ForgotPassword = () => {
	const history = useHistory();
	const { authenticated } = useAuth();
	const [email, setEmail] = useState<string>('');

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const onClose = () => setIsConfirmOpen(false);
	const cancelRef = useRef<HTMLButtonElement>(null);

	const [alertAnswer, setAlertAnswer] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (authenticated) {
			history.replace('/');
		}
	}, [authenticated]);

	const goToLogin = () => {
		history.push('/login');
	};

	const sendEmail = async () => {
		try {
			setIsLoading(true);
			await api.post('/user/forgotPassword', { email });
			setAlertAnswer('Para recuperar sua senha, olhe esse tal de "email". Um passarinho me contou que é bem famoso no lugar que você veio.');
			setIsLoading(false);
		} catch (error) {
			setAlertAnswer('Parece que esse email não existe na savana!');
			setIsLoading(false);
		}
		setIsConfirmOpen(true);
	};

	return (
		<Flex
			h='100vh'
			backgroundColor={colorPalette.buttonTextColor}
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
					<Image w='90%' src={monkey} alt='Image' />
				</Box>

				<LoginRegister
					firstText="Pelo visto, você não consegue mais lembrar sua senha, tem como me passar o 'e-mail' que usou para criar o passaporte? Não sei o que é 'e-mail', são as vozes da Savana que me pediram isso."
					firstPlaceholder='E-mail'
					firstValue={email}
					firstChange={(e: BaseSyntheticEvent) =>
						setEmail(e.target.value)
					}
					firstInputType='text'
					nextStep={() => sendEmail()}
					buttonText='Enviar'
					previousStep={() => goToLogin()}
					loading={isLoading}
				/>

				<AlertModal
					isOpen={isConfirmOpen}
					onClose={onClose}
					alertTitle='Senha Esquecida'
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
		</Flex>
	);
};

export default ForgotPassword;
