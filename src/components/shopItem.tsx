import React, { useRef, FC, useState } from 'react';
import {
	Flex,
	Button,
	Box,
	Image,
	Text,
	Slide,
	useDisclosure,
	Tooltip,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

// Components
import AlertModal from './modals/AlertModal';

// Requisitions
import api from '../services/api';
import { resetAllCooldown } from '../services/moduleCooldown';

// Styles
import fontTheme from '../styles/base';
import colorPalette from '../styles/colorPalette';

// Images
import bookicon from '../assets/icons/shop1.svg';
import hourglassicon from '../assets/icons/hourglass_icon.png';
import cardicon from '../assets/icons/shop2.svg';
import coinicon from '../assets/icons/coinicon.svg';
import confirmicon from '../assets/icons/confirmicon.png';
import { errorCases } from '../utils/errors/errorsCases';
import { GENERIC_MODAL_TEXT } from '../utils/constants/buttonConstants';
import { NOT_ENOUGH_STATUS } from '../utils/constants/mouseOverConstants';
import { getStatusNick, getStatusColor } from '../utils/statusUtils';

type ShopItemProps = {
	current_user_id: string;
	_id: string;
	name: string;
	value: number;
	description: string;
	type: string;
	items_id: string[];
	userCoins: number;
	userStatus: number;
	itemStatus: {
		status_name: string;
		points: number;
	};
};

const ShopItem: FC<ShopItemProps> = ({
	_id,
	name,
	value,
	description,
	type,
	current_user_id,
	items_id,
	userCoins,
	userStatus,
	itemStatus
}) => {
	const { isOpen, onToggle } = useDisclosure();
	const [show, setShow] = useState(false);

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isAlert, setIsAlert] = useState(false);
	const [onError, setOnError] = useState(false);
	const [loading, setLoaging] = useState(false);

	const IS_USER_HAS_STATUS_REQUIREMENT = userStatus >= itemStatus.points;

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

	const itemType: { [key: string]: string } = {
		"item1": "E-books",
		"item2": "Utilitários",
		"item3": "Especiais"
	}

	const confirmBuyItem = () => {
		if (IS_USER_HAS_STATUS_REQUIREMENT) {
			setIsConfirmOpen(true);
			setAlertAnswer(
				'Ei, viajante! Você tem certeza que deseja comprar esse item?',
			);
		}
	}

	const buyItem = async () => {
		setLoaging(true);
		// then make buying logic
		try {
			if (!items_id.includes(_id) && userCoins >= value) {
				const newCoins = userCoins - value;

				if (type === "item3") {
					try {

						await resetAllCooldown(current_user_id);

						await api.patch(`/user/coins/${current_user_id}`, {
							coins: newCoins,
						});

						setLoaging(false);
						setAlertAnswer('Parabéns! Seu tempo de espera foi zerado!');
						setIsAlert(true);
					} catch (error) {
						setOnError(true);
					}
				} else {
					try {

						await api.patch(`/user/additem/${current_user_id}`, {
							item_id: _id,
						});

						await api.patch(`/user/coins/${current_user_id}`, {
							coins: newCoins,
						});

						setLoaging(false);
						setAlertAnswer('Parabéns! Seu item foi comprado com sucesso!');
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
								minW="190px"
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
									minW="190px"
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
										minW="190px"
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
						Tipo: {itemType[type as string]}
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
			{show && (
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
							<Flex flexDirection='column' w='80%'>
								<Text
									fontSize={['0.5rem', '1.2rem', '1.5rem']}
									w='60%'
									fontWeight='semibold'
									textAlign='left'
									mb='8px'
								>
									{name}
								</Text>
								<Text
									fontSize={['0.3rem', '0.8rem', '1rem']}
									fontWeight='regular'
									textAlign='left'
									overflow="auto"
									maxH="160px"
								>
									{description}
								</Text>
							</Flex>
							<Flex flexDirection='column' alignSelf='flex-end'>
								<Box display='flex' flexDirection='row' marginBottom="4px">
									<Text
										fontFamily={fontTheme.fonts}
										fontSize="24px"
										fontWeight="semibold"
										color={colorPalette.secundaryGrey}
									>
										Suas joias: {userCoins}
									</Text>
									<Image
										w='20px'
										src={coinicon}
										alt='coinicon'
										ml='4px'
									/>
								</Box>
								<Box display='flex' flexDirection='row' marginBottom="16px">
									<Text
										fontFamily={fontTheme.fonts}
										fontSize='28px'
										fontWeight='semibold'
										color={colorPalette.closeButton}
									>
										Valor: {value}
									</Text>
									<Image
										w='32px'
										src={coinicon}
										alt='coinicon'
										ml='0.3rem'
									/>
								</Box>

								<Flex
									justifyContent='center'
								>
									{items_id.includes(_id) ? (
										<>
											<Box
												width='180px'
												height='3.5rem'
												background={colorPalette.secondaryColor}
												color={colorPalette.buttonTextColor}
												fontSize='1.5rem'
												display='flex'
												borderRadius='8px'
												justifyContent='center'
												alignItems='center'
												marginBottom="24px"
											>
												<Image
													src={confirmicon}
													padding='1rem 1rem' />
												<Text mr='1rem'>Comprado</Text>
											</Box>
										</>
									) : (
											<Tooltip
												label={NOT_ENOUGH_STATUS(itemStatus.status_name)}
												placement='bottom'
												hasArrow
												isDisabled={IS_USER_HAS_STATUS_REQUIREMENT}
												closeOnClick={false}
											>
												<Button
													width='150px'
													height='3.5rem'
													background={IS_USER_HAS_STATUS_REQUIREMENT ? colorPalette.primaryColor : colorPalette.grayBackground}
													color={colorPalette.buttonTextColor}
													marginBottom="24px"
													fontSize='1.5rem'
													borderRadius='8px'
													_hover={{}}
													onClick={confirmBuyItem}
													cursor={IS_USER_HAS_STATUS_REQUIREMENT ? 'pointer' : 'help'}
												>
													{IS_USER_HAS_STATUS_REQUIREMENT ? 'Comprar': 'Bloqueado'}
											</Button>
											</Tooltip>
										)}
									<Box
										marginLeft='15px'
										fontFamily={fontTheme.fonts}
										fontSize="18px"
										fontWeight="bold"
										color={getStatusColor(itemStatus.status_name)}
										textAlign='center'
									>
										<Text> {userStatus}/{itemStatus.points}</Text>
										<Text>
											{getStatusNick(itemStatus.status_name)}
										</Text>
									</Box>
								</Flex>



								<AlertModal
									isOpen={isConfirmOpen}
									onClose={() => { if (!loading) history.go(0) }}
									alertTitle='Loja'
									alertBody={alertAnswer}
									onClickClose={() => { if (!loading) history.go(0) }}
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
												{GENERIC_MODAL_TEXT}
											</Button>
										) : (
												<>
													<Button
														ref={cancelRef}
														onClick={onClose}
														isDisabled={loading}
													>
														Cancel
												</Button>
													<Button
														color='white'
														bg={colorPalette.primaryColor}
														onClick={buyItem}
														ml={3}
														isLoading={loading}
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
									alertBody={errorCases.SERVER_ERROR}

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
			)}
		</Box>
	);
};

export default ShopItem;
