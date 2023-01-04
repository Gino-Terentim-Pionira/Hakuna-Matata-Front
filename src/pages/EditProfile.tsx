import React, {
	BaseSyntheticEvent,
	useEffect,
	useState,
	useMemo,
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
import { editProfileErrorCases, errorCases } from '../utils/errors/errorsCases';

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

	const [userInfo, setUserInfo] = useState({
		userName: '',
		name: '',
		birthday_date: '',
	});

	const [alertModalInfo, setAlertModalInfo] = useState({
		isOpen: false,
		onClose: () => console.log(),
		alertTitle: '',
		alertBody: '',
		buttonOnClick: () => console.log(),
		buttonLabel: '',
	});

	const onClose = () => {
		setAlertModalInfo({
			...alertModalInfo,
			isOpen: false
		});
		setLoading(false);
	};
	const [userPhoto, setUserPhoto] = useState(null);
	const [newPhoto, setNewPhoto] = useState<IImage>({} as IImage);
	const [isLoading, setLoading] = useState(false);

	const preview = useMemo(() => {
		try {
			return newPhoto
				? URL.createObjectURL(newPhoto as Blob)
				: userPhoto
					? userPhoto
					: null;
		} catch (error) {
			return userPhoto ? userPhoto : null;
		}
	}, [userPhoto, newPhoto]);


	const verifyErrorType = (erroType: string) => {
		const ERROR_TYPES: {
			[key: string]: {
				onClose: VoidFunction,
				alertTitle: string,
				alertBody: string,
				buttonOnClick: VoidFunction,
				buttonLabel: string,
			}
		} = {
			'SUCCES_CASE_EDIT': {
				alertTitle: 'Editar perfil',
				alertBody: editProfileErrorCases.SUCCES_CASE_EDIT,
				buttonOnClick: () => history.push('/mainPage'),
				onClose: () => history.push('/mainPage'),
				buttonLabel: 'Continuar'
			},
			'IMAGE_FORMAT_ERROR': {
				alertTitle: 'Editar perfil - Ops!',
				alertBody: editProfileErrorCases.IMAGE_FORMAT_ERROR,
				buttonOnClick: onClose,
				onClose: onClose,
				buttonLabel: 'Tentar novamente'
			},
			'SERVER_SENDING_IMAGE_ERROR': {
				alertTitle: 'Editar perfil - Ops!',
				alertBody: editProfileErrorCases.SERVER_SENDING_IMAGE_ERROR,
				buttonOnClick: onClose,
				onClose: onClose,
				buttonLabel: 'Tentar novamente'
			},
			'SERVER_EDIT_ERRORS': {
				alertTitle: 'Editar perfil - Ops!',
				alertBody: editProfileErrorCases[erroType],
				buttonOnClick: onClose,
				onClose: onClose,
				buttonLabel: 'Tentar novamente'
			},
			'SERVER_ERROR': {
				alertTitle: 'Ops!',
				alertBody: errorCases.SERVER_ERROR,
				buttonOnClick: () => window.location.reload(),
				onClose: () => window.location.reload(),
				buttonLabel: 'Recarregar',
			}
		};
		switch (erroType) {
			case 'SUCCES_CASE_EDIT':
				handleAlertModal(ERROR_TYPES[erroType]);
				return
			case 'IMAGE_FORMAT_ERROR':
				handleAlertModal(ERROR_TYPES[erroType]);
				return
			case 'SERVER_SENDING_IMAGE_ERROR':
				handleAlertModal(ERROR_TYPES[erroType]);
				return
			case 'SERVER_ERROR':
				handleAlertModal(ERROR_TYPES[erroType]);
				return
			default:
				handleAlertModal(ERROR_TYPES['SERVER_EDIT_ERRORS']);
				return
		}
	};

	const handleAlertModal = (errorObject: {
		onClose: VoidFunction,
		alertTitle: string,
		alertBody: string,
		buttonOnClick: VoidFunction,
		buttonLabel: string,
	}) => {
		const { alertTitle, alertBody, onClose, buttonLabel, buttonOnClick } = errorObject
		setAlertModalInfo({
			...alertModalInfo,
			isOpen: !alertModalInfo.isOpen,
			alertTitle,
			alertBody,
			onClose,
			buttonLabel,
			buttonOnClick
		})
	}

	const getUser = async () => {
		try {
			const userId = sessionStorage.getItem('@pionira/userId');
			const res = await api.get(`/user/${userId}`);
			const birthday_date = moment(res.data.birthday_date)
				.add(1, 'days')
				.format('YYYY-MM-DD');
			setUserInfo({
				...userInfo,
				userName: res.data.userName,
				name: `${res.data.first_name} ${res.data.last_name}`,
				birthday_date
			});
			setUserPhoto(res.data?.profileImage?.url);
		} catch (error) {
			verifyErrorType('SERVER_ERROR');
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
			const { userName, name, birthday_date } = userInfo;
			const firstName = name.split(' ');
			const last_name = lastIndexValidation(firstName) as string;
			const first_name = firstName[0];
			setLoading(true);
			await api.patch(`/user/${userId}`, {
				userName,
				first_name,
				last_name,
				birthday_date
			});
			setLoading(false);
			verifyErrorType('SUCCES_CASE_EDIT');
		} catch (error) {

			verifyErrorType(error.response.data.message);
			setLoading(false);
		}
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

					verifyErrorType('IMAGE_FORMAT_ERROR');
					return;
				}
			}

			await api.patch(`/user/image/${userId}`, data);
			setLoading(false);
		} catch (error) {
			verifyErrorType('SERVER_SENDING_IMAGE_ERROR');
			setNewPhoto({} as IImage);
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
								value={userInfo.userName}
								onChange={(e: BaseSyntheticEvent) =>
									setUserInfo({
										...userInfo,
										userName: e.target.value
									})
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
								value={userInfo.name}
								onChange={(e: BaseSyntheticEvent) =>
									setUserInfo({
										...userInfo,
										name: e.target.value
									})
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
								value={userInfo.birthday_date}
								onChange={(e: BaseSyntheticEvent) =>
									setUserInfo({
										...userInfo,
										birthday_date: e.target.value
									})
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
									onClick={() => history.push('/mainPage')}
								>
									Voltar
								</Link>
							</Box>
						</Box>
					</Flex>
				</Center>
			)}
			<AlertModal
				isOpen={alertModalInfo.isOpen}
				onClose={alertModalInfo.onClose}
				alertTitle={alertModalInfo.alertTitle}
				alertBody={alertModalInfo.alertBody}

				buttonBody={
					<Button
						color='white'
						bg={colorPalette.primaryColor}
						onClick={alertModalInfo.buttonOnClick}
					>
						{alertModalInfo.buttonLabel}
					</Button>
				}
			/>
		</Flex>
	);
};

export default EditProfile;
