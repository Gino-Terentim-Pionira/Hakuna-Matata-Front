import React, {
	BaseSyntheticEvent,
	useEffect,
	useState,
	useMemo,
	useRef,
} from 'react';
import fontTheme from '../styles/base';
import colorPalette from '../styles/colorPalette';
import {
	Flex,
	Center,
	Box,
	Text,
	Input,
	Button,
	Link,
	Image,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

// Components
import LoadingState from '../components/LoadingState';
import AlertModal from '../components/modals/AlertModal';

// Requisitions
import api from '../services/api';
import moment from 'moment';

// Images
import profilePlaceholder from '../assets/icons/profilePlaceholder.png';

interface IImage {
	size: number;
	type: string;
}

const EditProfile = () => {
	const history = useHistory();

	const [userName, setUserName] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [date, setDate] = useState('');

	const [correctUpdate, setCorrectUpdate] = useState(false);

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isNaviPhoto, setIsNaviPhoto] = useState(false);
	const onClose = () => {
		setIsConfirmOpen(false);
		setIsNaviPhoto(false);
	};
	const cancelRef = useRef<HTMLButtonElement>(null);
	const [alertAnswer, setAlertAnswer] = useState('');
	const [userPhoto, setUserPhoto] = useState(null);
	const [newPhoto, setNewPhoto] = useState<IImage>({} as IImage);
	const [isLoading, setLoading] = useState(false);
	const [onError, setOnError] = useState(false);

	const preview = useMemo(() => {
		try {
			return newPhoto
				? URL.createObjectURL(newPhoto)
				: userPhoto
					? userPhoto
					: null;
		} catch (error) {
			return userPhoto ? userPhoto : null;
		}
	}, [userPhoto, newPhoto]);

	const goToHome = () => {
		history.push('/mainPage');
	};

	const getUser = async () => {
		try {
			const userId = sessionStorage.getItem('@pionira/userId');
			const res = await api.get(`/user/${userId}`);
			const birthday_date = moment(res.data.birthday_date)
				.add(1, 'days')
				.format('YYYY-MM-DD');
			setDate(birthday_date);
			setUserName(res.data.userName);
			setName(`${res.data.first_name} ${res.data.last_name}`);
			setEmail(res.data.email);
			setUserPhoto(res.data?.profileImage?.url);
		} catch (error) {
			setOnError(true);
			// ALTERAR
		}
	};

	const lastIndexValidation = (name: string[]) => {
		for (let i = 1; i <= name.length; i++) {
			const last = name.length - i;
			if (name[last] !== '') {
				return name[last];
			}
		}
	};

	const submitChange = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		try {
			const userId = sessionStorage.getItem('@pionira/userId');
			const firstName = name.split(' ');
			const last_name = lastIndexValidation(firstName) as string;
			const first_name = firstName[0];
			const birthday_date = date;

			setLoading(true);

			await api.patch(`/user/${userId}`, {
				userName,
				first_name,
				last_name,
				email,
				birthday_date,
			});
			setLoading(false);

			setAlertAnswer('Suas informações foram atualizadas, viajante!');
			setCorrectUpdate(true);
		} catch (error) {
			// ALTERAR
			setAlertAnswer(error.response.data.message);
			setLoading(false);
		}
		setIsConfirmOpen(true);
	};

	const changeImage = async (e: BaseSyntheticEvent) => {
		const photo = e.target.files[0];
		try {
			const userId = sessionStorage.getItem('@pionira/userId');
			const data = new FormData();

			if (photo) {
				if (
					photo.type == 'image/jpeg' ||
					(photo.type == 'image/png' && photo.size < 5 * 1024 * 1024)
				) {
					data.append('file', photo as string | Blob);
					setNewPhoto(e.target.files[0]);
					setLoading(true);
				} else {
					//ALTERAR
					setAlertAnswer(
						'Ops! É só permitido imagens menores que 5Mb. \n E que sejam jpeg, jpg ou png!',
					);
					setIsNaviPhoto(true);
					setIsConfirmOpen(true);
					return;
				}
			}

			await api.patch(`/user/image/${userId}`, data);
			setLoading(false);
		} catch (error) {
			//ALTERAR
			alert(error);
		}
	};

	useEffect(() => {
		getUser();
	}, []);

	return (
		<Flex
			h='100vh'
			backgroundColor={colorPalette.backgroundColor}
			fontFamily={fontTheme.fonts}
			fontWeight='regular'
		>
			<Box
				w='38%'
				bg={colorPalette.secondaryColor}
				h='100vh'
				position='absolute'
				zIndex='0'
				left='0'
				top='0'
				clipPath='polygon(0% 0%, 85% 0, 40% 100%, 0 100%)'
			></Box>
			{isLoading ? (
				<>
					<Center w='100%'>
						<LoadingState />
					</Center>
				</>
			) : (
				<Center width='100%'>
					<Box
						display='flex'
						alignItems='flex-start'
						justifyContent='flex-start'
						w='35%'
						h='100%'
						zIndex='1'
						backgroundColor='transparent'
						padding='3%'
					>
						<Box display='flex' flexDirection='column'>
							<Box
								bg='white'
								borderRadius='50%'
								height='100%'
								width='100%'
								display='flex'
								justifyContent='center'
								alignItems='center'
								marginBottom='1rem'
							>
								{newPhoto ? (
									<label
										id='photo'
										style={{
											cursor: 'pointer',
										}}
									>
										<Image
											borderRadius='full'
											boxSize='15rem'
											minHeight='5px'
											objectFit='cover'
											src={`${preview}`}
										/>

										<Input
											w='50%'
											hidden
											marginTop='1rem'
											type='file'
											onChange={(
												e: BaseSyntheticEvent,
											) => changeImage(e)}
										/>
									</label>
								) : (
									<label
										id='photo'
										style={{
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<Image
											borderRadius='full'
											boxSize='100%'
											objectFit='cover'
											src={`${preview}`}
										/>

										<Input
											hidden
											type='file'
											onChange={(
												e: BaseSyntheticEvent,
											) => changeImage(e)}
										/>
										<Image
											src={profilePlaceholder}
											alt='Image'
											cursor='pointer'
											w='100%'
											padding='20%'
										/>
									</label>
								)}
							</Box>
							<label>
								<Input
									hidden
									type='file'
									onChange={(e: BaseSyntheticEvent) =>
										changeImage(e)
									}
								/>
								<Box
									boxShadow='xl'
									cursor='pointer'
									margin='0 auto'
									width='90%'
									padding='2%'
									bg={colorPalette.primaryColor}
									color={colorPalette.textColor}
									fontSize='1.5rem'
									borderRadius='50px'
									textAlign='center'
								>
									Escolher Imagem
								</Box>
							</label>
						</Box>
					</Box>

					<Flex
						w='65%'
						h='90%'
						border='1px solid'
						borderColor={colorPalette.inputBoder}
						color='Black'
						borderRadius='8px'
						flexDirection='column'
						align='center'
						justifyContent='space-between'
						marginRight='3rem'
					>
						<Box
							width='90%'
							h='93%'
							marginTop='2.2rem'
							fontSize={['0.8rem', '1rem', '1.5rem']}
						>
							<Text w='100%' color={colorPalette.textColor}> Qual nome você gostaria de usar na nossa jornada?</Text>
							<Input
								marginTop='0.5rem'
								marginBottom='0.5rem'
								h='13%'
								w='95%'
								color={colorPalette.textColor}
								borderColor={colorPalette.inputBoder}
								placeholder='Nome de usuário'
								value={userName}
								onChange={(e: BaseSyntheticEvent) =>
									setUserName(e.target.value)
								}
							/>
							<Text w='100%' color={colorPalette.textColor}>Qual o seu nome completo?</Text>
							<Input
								marginTop='0.5rem'
								marginBottom='0.5rem'
								h='13%'
								w='95%'
								color={colorPalette.textColor}
								borderColor={colorPalette.inputBoder}
								placeholder='Nome Completo'
								value={name}
								onChange={(e: BaseSyntheticEvent) =>
									setName(e.target.value)
								}
							/>
							<Text w='100%' color={colorPalette.textColor}> Qual a sua data de nascimento?</Text>
							<Input
								marginTop='0.5rem'
								marginBottom='0.5rem'
								h='13%'
								w='95%'
								color={colorPalette.textColor}
								borderColor={colorPalette.inputBoder}
								type='date'
								value={date}
								onChange={(e: BaseSyntheticEvent) =>
									setDate(e.target.value)
								}
							/>
						</Box>
						<Box w='70%' h='30%'>
							<Center marginTop='2rem'>
								<Button
									width='80%'
									height='3rem'
									background={colorPalette.primaryColor}
									color={colorPalette.buttonTextColor}
									fontSize='1.7rem'
									onClick={(e) => {
										submitChange(e);
									}}
								>
									Salvar
								</Button>
							</Center>

							<Box
								w='90%'
								display='flex'
								justifyContent='flex-end'
							>
								<Link
									marginTop='0.3rem'
									color={colorPalette.linkTextColor}
									textDecoration='underLine'
									onClick={() => goToHome()}
								>
									Voltar
								</Link>
							</Box>
						</Box>
					</Flex>
				</Center>
			)}
{/* ALTERAR */}
			{isNaviPhoto ? (
				<AlertModal
					isOpen={isConfirmOpen}
					onClose={onClose}
					alertTitle='Editar Perfil'
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
			) : (
				<AlertModal
					isOpen={isConfirmOpen}
					onClose={onClose}
					alertTitle='Editar Perfil'
					alertBody={alertAnswer}
					onClickClose={() => {
						if (correctUpdate)
							history.push('/mainPage');
						else history.go(0);
					}}
					buttonBody={
						<Button
							color='white'
							bg={colorPalette.primaryColor}
							ref={cancelRef}
							onClick={() => {
								onClose();
								if (correctUpdate)
									history.push('/mainPage');
								else history.go(0);
							}}
						>
							Continuar
						</Button>
					}
				/>
			)}
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

export default EditProfile;
