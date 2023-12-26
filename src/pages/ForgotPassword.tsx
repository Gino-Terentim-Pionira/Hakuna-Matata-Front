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
import monkey from '../assets/sprites/monkey/new_monkey_happy.webp';
import { GENERIC_MODAL_TEXT } from '../utils/constants/buttonConstants';

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
			setAlertAnswer('Para recuperar sua senha, olhe esse tal de "e-mail". Um passarinho me contou que isso é bem famoso no lugar de onde você veio.');
			setIsLoading(false);
		} catch (error) {
			setAlertAnswer('Parece que esse email não existe na Savana!');
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
		<Center width='100%'>
			<LoginRegister
				mainText='Pelo visto você não consegue mais lembrar sua senha. Você pode me passar o e-mail que usou para criar o passaporte? Não sei o que é um e-mail, foram as vozes da Savana que me pediram isso.'
				firstText='”Qual é o seu e-mail, jovem?”'
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
			<Image zIndex="1" width="25%" src={monkey} maxW="400px" minW="300px" alt='Image' ml="8px" mr="24px" />
			<Box w="27%" bg={colorPalette.primaryColor} h="100vh" position="absolute" zIndex='0' right="0" />

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
						{GENERIC_MODAL_TEXT}
					</Button>
				}
			/>
		</Center>
	</Flex>

	);
};

export default ForgotPassword;
