import React, { BaseSyntheticEvent, useEffect, useState, useRef } from 'react';
import monkey from '../assets/sprites/monkey/monkey.png';
import fontTheme from '../styles/base';
import {
	Flex,
	Center,
	Box,
	Text,
	Input,
	Button,
	Link,
	Image
} from '@chakra-ui/react';
import { useHistory, useParams, withRouter } from 'react-router-dom';

// Components
import AlertModal from '../components/modals/AlertModal';

//styles
import colorPalette from "../styles/colorPalette";

// Requisitions
import api from '../services/api';
import { useAuth } from '../contexts/authContext';

interface IUser {
	id: string;
}

const ResetPassword = () => {
	const history = useHistory();
	const { id } = useParams<IUser>();

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const onClose = () => setIsConfirmOpen(false);
	const cancelRef = useRef<HTMLButtonElement>(null);

	const [alertAnswer, setAlertAnswer] = useState('');
	const [correctPassword, setCorrectPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { authenticated } = useAuth();

	useEffect(() => {
		if (authenticated) {
			history.replace('/');
		}
	}, [authenticated]);

	const goToLogin = () => {
		history.push('/login');
	};

	const submitChange = async (e: BaseSyntheticEvent) => {
		e.preventDefault();
		if (password === confirmPassword) {
			try {
				setIsLoading(true);
				await api.patch(`/user/resetPassword/${id}`, { password });
				setAlertAnswer('Sua senha foi alterada com sucesso!');
				setCorrectPassword(true);
				setIsLoading(false);
			} catch (error) {
				setIsLoading(false);
				setAlertAnswer(error.response.data.error);
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

				<Flex
					w='35%'
					h='80%'
					border='1px solid'
					borderColor={colorPalette.primaryColor}
					color='Black'
					borderRadius='8px'
					flexDirection='column'
					align='center'
					justifyContent='space-between'
					marginLeft='1rem'
				>
					<Box
						width='90%'
						h='93%'
						marginTop='2.2rem'
						fontSize={['0.8rem', '1rem', '1.5rem']}
					>
						<Text w='100%'>
							{' '}
							Parece que vocês esqueceu a sua senha. Sem
							problemas, só colocar uma outra que não seja a mesma
							para redefiní-la.
						</Text>
						<Input
							marginTop='1rem'
							h='13%'
							placeholder='Digite sua senha nova'
							type='password'
							isDisabled={isLoading}
							onChange={(e: BaseSyntheticEvent) => {
								setPassword(e.target.value);
							}}
						/>
						<Text w='100%'>
							{' '}
							Não ouvi muito bem, poderia repeti-lá?
						</Text>
						<Input
							marginTop='1rem'
							h='13%'
							placeholder='Confirme a sua senha'
							type='password'
							isDisabled={isLoading}
							onChange={(e: BaseSyntheticEvent) => {
								setConfirmPassword(e.target.value);
							}}
						/>
					</Box>
					<Box w='70%' h='30%'>
						<Center marginTop='1rem'>
							<Button
								width='100%'
								height='2.5rem'
								background={colorPalette.primaryColor}
								color={colorPalette.buttonTextColor}
								fontSize='1.7rem'
								isLoading={isLoading}
								loadingText="Enviando"
								spinnerPlacement='end'
								_hover={{}}
								onClick={(e) => {
									submitChange(e);
								}}
							>
								Enviar
							</Button>
						</Center>

						<Box display='flex' justifyContent='flex-end'>
							<Link
								marginTop='0.3rem'
								color={colorPalette.secondaryColor}
								textDecoration='underLine'
								onClick={isLoading ? () => {return null} : goToLogin}
								_hover={isLoading ? { cursor: 'not-allowed'} : { cursor: 'pointer'}}
							>
								Voltar
							</Link>
						</Box>
					</Box>
				</Flex>

				<AlertModal
					isOpen={isConfirmOpen}
					onClose={onClose}
					alertTitle='Redefinir Senha'
					alertBody={alertAnswer}
					buttonBody={
						<Button
							ref={cancelRef}
							color='white'
							bg={colorPalette.primaryColor}
							onClick={() => {
								onClose();
								if (correctPassword) {
									history.push('/');
								}
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

export default withRouter(ResetPassword);
