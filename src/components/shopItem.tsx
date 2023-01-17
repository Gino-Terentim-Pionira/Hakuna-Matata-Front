import React, { useRef, FC, useState } from 'react';
import {
	Flex,
	Button,
	Box,
	Image,
	Text,
	Slide,
	useDisclosure,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

// Components
import AlertModal from './modals/AlertModal';

// Requisitions
import api from '../services/api';

// Styles
import fontTheme from '../styles/base';
import colorPalette from '../styles/colorPalette';

// Images
import bookicon from '../assets/icons/shop1.svg';
import hourglassicon from '../assets/icons/hourglass_icon.png';
import cardicon from '../assets/icons/shop2.svg';
import coinicon from '../assets/icons/coinicon.svg';
import confirmicon from '../assets/icons/confirmicon.png';

type ShopItemProps = {
	current_user_id: string;
	users_id: Array<string>;
	_id: string;
	name: string;
	value: number;
	description: string;
	type: string;
};

const ShopItem: FC<ShopItemProps> = ({
	_id,
	name,
	value,
	description,
	type,
	users_id,
	current_user_id,
}) => {
	const { isOpen, onToggle } = useDisclosure();
	const [show, setShow] = useState(false);

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isAlert, setIsAlert] = useState(false);
	const [onError, setOnError] = useState(false);

	const onClose = () => {
		setIsConfirmOpen(false);
	};
	const cancelRef = useRef<HTMLButtonElement>(null);
	const [alertAnswer, setAlertAnswer] = useState('');

	const history = useHistory();

	const changeShow = () => {
		setShow(!show);
	};

	const showDescription = () => {
		setTimeout(changeShow, 100);
		onToggle();
	};

	const buyItem = async () => {
		setIsConfirmOpen(false);
		// then make buying logic
		try {
			const user = await api.get(`/user/${current_user_id}`);
			const userCoins = user.data.coins;
			if (!users_id.includes(current_user_id) && userCoins >= value) {
				users_id.push(current_user_id);
				const newCoins = userCoins - value;

				if (type === "item3") {
					try {

						await api.patch(`/user/loadingQuiz/${current_user_id}`, {
							quiz_loading: "",
						});

						await api.patch(`/user/coins/${current_user_id}`, {
							coins: newCoins,
						});

						setAlertAnswer('Parabéns! Seu tempo de espera foi zerado!');
						setIsConfirmOpen(true);
						setIsAlert(true);
					} catch (error) {
						setOnError(true);
					}
				} else {
					try {

						await api.patch(`/shopitem/${_id}`, {
							user_id: users_id,
						});

						await api.patch(`/user/coins/${current_user_id}`, {
							coins: newCoins,
						});

						setAlertAnswer('Parabéns! Seu item foi comprado com sucesso!');
						setIsConfirmOpen(true);
						setIsAlert(true);
					} catch (error) {
						setOnError(true);
					}
				}
			}

			if (userCoins < value) {
				setAlertAnswer('Poxa! Parece que você não tem moedas suficientes!');
				setIsAlert(true);
				setIsConfirmOpen(true);
			}
		} catch (error) {
			setOnError(true);
		}
	};

	return (
		<Box>
			<Flex
				_hover={{
					cursor: 'pointer',
					transform: 'scale(1.05)',
				}}
				onClick={showDescription}
				flexDirection='column'
				alignItems='center'
				key={_id}
				mb='2rem'
				mr='1rem'
				borderRadius='7.5%'
				transform={show ? `scale(1.05)` : ' '}
				transition='150ms cubic-bezier(.38, .5, .5, 1.5)'
			>
				<Box 
					maxHeight='300px' 
					justifySelf='flex-start'
					maxWidth='300px'
				>
					{type === 'item3' ? (
						<Box w='100%'>
							<Image
								maxWidth='300px'
								transition='50ms'
								bg={show ? '#00000012' : colorPalette.backgroundHighlight}								
								w='100%'
								h='18.75rem'
								mt='0.5rem'
								src={hourglassicon}
								alt='hourglassicon'
								padding='5rem 4.7rem'
								mb='1rem'
								borderRadius='7.5%'
							/>
						</Box>
					) : (
						type === 'item2' ? (
							<Image
								maxWidth='300px'
								transition='50ms'
								bg={show ? '#00000012' : colorPalette.backgroundHighlight}								
								w='100%'
								h='18.75rem'
								mt='0.5rem'
								src={bookicon}
								alt='bookicon'
								padding='5rem 3.5rem'
								mb='1rem'
								borderRadius='7.5%'
							/>
						) : (
							<Image
								maxWidth='300px'
								transition='50ms'
								bg={show ? '#00000012' : colorPalette.backgroundHighlight}
								w='100%'
								h='18.75rem'
								mt='0.5rem'
								src={cardicon}
								alt='cardicon'
								padding='5rem 5rem'
								mb='1rem'
								borderRadius='7.5%'
							/>
						)
					)}
				</Box>
				<Flex
					flexDirection='column'
					maxWidth='300px'
					w='90%'
					alignItems='right'
					ml='1rem'
					mt='1rem'
				>
					<Text
						fontFamily={fontTheme.fonts}
						fontWeight='semibold'
						mb='0.3rem'
					>
						{name}
					</Text>
					<Text
						fontFamily={fontTheme.fonts}
						fontWeight='regular'
						color={colorPalette.infoTextColor}
						mb='0.3rem'
					>
						Tipo: {type}
					</Text>
					<Box display='flex' flexDirection='row'>
						<Text
							fontFamily={fontTheme.fonts}
							fontWeight='regular'
							color={colorPalette.infoTextColor}
						>
							Valor: {value}
						</Text>
						<Image
							w='10%'
							src={coinicon}
							alt='coinicon'
							ml='0.3rem'
						/>
					</Box>
				</Flex>
			</Flex>
			{show ? (
				<Slide direction='bottom' in={isOpen} style={{ zIndex: 10 }}>
					<Box onClick={showDescription} w='100%' h='100vh' />
					<Flex
						w='100%'
						h='16rem'
						bg={colorPalette.slideBackground}
						rounded='md'
						shadow='md'
						flexDirection='column'
						justifyContent='space-between'
						border='4px solid'
						borderColor={colorPalette.secondaryColor}
					>
						<Flex
							justifyContent='flex-end'
							paddingRight='20px'
							paddingTop='9px'
							fontSize='2rem'
							fontWeight='bold'
							color={colorPalette.closeButton}
						>
							<Text
								onClick={showDescription}
								transition='all 0.2s'
								_hover={{
									cursor: 'pointer',
									opacity: '80%',
								}}
								_active={{
									opacity: '50%',
								}}
								w='2.5rem'
							>
								X
							</Text>
						</Flex>
						<Flex
							w='92%'
							marginTop='2rem'
							position='absolute'
							marginLeft='1.5rem'
							justifyContent='space-between'
						>
							<Flex flexDirection='column' w='60%'>
								<Text
									fontSize={['0.5rem', '1.2rem', '1.5rem']}
									w='60%'
									fontWeight='semibold'
									textAlign='left'
									mb='0.5rem'
								>
									{name}
								</Text>
								<Text
									fontSize={['0.3rem', '0.8rem', '1rem']}
									fontWeight='regular'
									textAlign='left'
								>
									{description}
								</Text>
							</Flex>
							<Flex flexDirection='column' alignSelf='flex-end'>
								<Box display='flex' flexDirection='row'>
									<Text
										fontFamily={fontTheme.fonts}
										fontSize='1.5rem'
										fontWeight='semibold'
										color={colorPalette.infoTextColor}
									>
										Valor: {value}
									</Text>
									<Image
										w='15%'
										src={coinicon}
										alt='coinicon'
										ml='0.3rem'
									/>
								</Box>
								{users_id.includes(current_user_id) ? (
									<>
										<Box
											width='100%'
											height='3.5rem'
											background={colorPalette.secondaryColor}
											color={colorPalette.buttonTextColor}
											fontSize='1.5rem'
											display='flex'
											borderRadius='8px'
											justifyContent='center'
											alignItems='center'
											mt='2rem'
										>
											<Image
												src={confirmicon}
												padding='1rem 1rem' />
											<Text mr='1rem'>Comprado</Text>
										</Box>
									</>
								) : (
									<Button
										mt='2rem'
										width='100%'
										height='3.5rem'
										background={colorPalette.primaryColor}
										color={colorPalette.buttonTextColor}
										fontSize='1.5rem'
										borderRadius='8px'
										onClick={() => {
											setIsConfirmOpen(true);
											setAlertAnswer(
												'Ei, viajante! Você tem certeza que deseja comprar esse item?',
											);
										}}
									>
										Comprar
									</Button>
								)}

								<AlertModal
									isOpen={isConfirmOpen}
									onClose={onClose}
									alertTitle='Loja'
									alertBody={alertAnswer}
									onClickClose={
										() => {
											history.go(0);
										}
									}
									buttonBody={
										isAlert ? (
											<Button
												color='white'
												bg={colorPalette.primaryColor}
												onClick={() => {
													history.go(0);
												}}
												ml={3}
											>
												Continuar
											</Button>
										) : (
											<>
												<Button
													ref={cancelRef}
													onClick={onClose}
												>
													Cancel
												</Button>
												<Button
													color='white'
													bg={colorPalette.primaryColor}
													onClick={buyItem}
													ml={3}
												>
													Comprar
												</Button>
											</>
										)
									}
								/>

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
						</Flex>
					</Flex>
				</Slide>
			) : null}
		</Box>
	);
};

export default ShopItem;
