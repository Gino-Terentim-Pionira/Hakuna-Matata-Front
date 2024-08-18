import React, { BaseSyntheticEvent, useEffect, useState, useRef } from 'react';
import monkey from '../assets/sprites/monkey/new_monkey_happy.webp';
import fontTheme from '../styles/base';
import {
	Flex,
	Center,
	Box,
	Button,
	Image
} from '@chakra-ui/react';
import { useHistory, useParams, withRouter } from 'react-router-dom';
import { validatePassword } from '../utils/validates';

// Components
import AlertModal from '../components/modals/AlertModal';

//styles
import colorPalette from "../styles/colorPalette";

// Requisitions
import api from '../services/api';
import { useAuth } from '../contexts/authContext';
import LoginRegister from '../components/LoginRegister';
import axios from 'axios';
import { GENERIC_MODAL_TEXT } from '../utils/constants/buttonConstants';

interface IUser {
	id: string;
}

const ResetPassword = () => {
	const history = useHistory();
	const { id } = useParams<IUser>();

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState('');

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const onClose = () => setIsConfirmOpen(false);
	const cancelRef = useRef<HTMLButtonElement>(null);

	const [alertAnswer, setAlertAnswer] = useState('');
	const [correctPassword, setCorrectPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { authenticated } = useAuth();

	const handlePasswordChanged = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setValidationError('');
		setPassword(event.target.value);
    }

	const isValidPassword = () => {
		const {message} = validatePassword(password);
		setValidationError(message);
	}

	useEffect(() => {
		if (authenticated) {
			history.replace('/');
		}
	}, [authenticated]);

	const goToLogin = () => {
		history.push('/login');
	};

	const submitChange = async () => {
		if (password === confirmPassword) {
			try {
				setIsLoading(true);
				await api.patch(`/user/resetPassword/${id}`, { password });
				setAlertAnswer('Sua senha foi alterada com sucesso!');
				setCorrectPassword(true);
				setIsLoading(false);

			} catch (error) {
				if (axios.isAxiosError(error)) {
					if (error.response) {
						setIsLoading(false);
						setAlertAnswer(error.response.data.error);
					}
				}
			}
		} else {
			setAlertAnswer('Ops, parece que a senha não é igual à confirmação!');
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
			<Box w="27%" bg={colorPalette.primaryColor} h="100vh" position="absolute" zIndex='0' right="0" />
			<Center width='100%'>
				<LoginRegister
					mainText='Parece que vocês esqueceu a sua senha. Sem problemas, só colocar uma outra que não seja a mesma para redefiní-la.'
					firstText='”Qual é a sua nova senha, viajante?”'
					secondText='”Não entendi muito bem, poderia repeti-la”'
					firstChange={(e: BaseSyntheticEvent) => {
						handlePasswordChanged(e);
					}}
					firstInputType='password'
					firstValue={password}
					validationError={validationError}
					hasValidationError={!!validationError}
					onBlur={isValidPassword}
					firstPlaceholder='Nova senha'
					secondChange={(e: BaseSyntheticEvent) => {
						setConfirmPassword(e.target.value);
					}}
					secondInputType="password"
					secondValue={confirmPassword}
					secondPlaceholder="Confirmar nova senha"
					nextStep={() => {
						submitChange();
					}}
					previousStep={() => goToLogin()}
					buttonText='Enviar'
					loading={isLoading}
				/>
				<Image zIndex="1" width="25%" src={monkey} maxW="400px" minW="300px" alt='Image' ml="8px" mr="24px" />

				<AlertModal
					isOpen={isConfirmOpen}
					onClose={onClose}
					alertTitle='Redefinir Senha'
					alertBody={alertAnswer}
					buttonBody={
						<Button
							ref={cancelRef}
							color='white'
							_hover={{ bg: colorPalette.primaryColor }}
							bg={colorPalette.primaryColor}
							onClick={() => {
								onClose();
								if (correctPassword) {
									history.push('/');
								}
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

export default withRouter(ResetPassword);
