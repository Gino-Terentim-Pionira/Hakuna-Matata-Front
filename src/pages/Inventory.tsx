import React, { useEffect, useState } from 'react';
import { Box, Flex, Spacer, Text } from '@chakra-ui/layout';
import { Button, Center, Image, SimpleGrid } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

// Components
import AlertModal from '../components/modals/AlertModal';
import LoadingState from '../components/LoadingState';
import PurchasedItems from '../components/PurchasedItems';

// Requisitions
import api from '../services/api';

// Styles
import fontTheme from '../styles/base';
import colorPalette from '../styles/colorPalette';

// Images
import sidearrow from '../assets/icons/sidearrow.png';
import icon_shop from '../assets/icons/icon_shop.svg';


const Shop = () => {
	const [shopItem, setShopItem] = useState([]);
	const [currentUserId, setCurrentUserId] = useState('');
	const [validation, setValidation] = useState(false);
	const [onError, setOnError] = useState(false);
	const history = useHistory();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const getShopItens = async () => {
		try {
			const res = await api.get('/shopItem/');
			const userId = sessionStorage.getItem('@pionira/userId');
			const userIdString = '' + userId;
			setShopItem(res.data);
			setCurrentUserId(userIdString);
			res.data.map(({ user_id }: { user_id: [string] }) => {
				user_id.includes(userId as string) ? setValidation(true) : null;
			});
			setIsLoading(false);
		} catch (error) {
			setOnError(true);
		}
	};

	const goBackShop = async () => {
		try {
			history.push(`/shop`);
		} catch (error) {
			setOnError(true);
		}
	};

	const goBack = () => {
		history.goBack();
	};

	useEffect(() => {
		getShopItens();
	}, []);
	return (
		<Box
			display='flex'
			flexDirection='column'
			bg={colorPalette.backgroundColor}
			alignItems='center'
			h='100vh'
			overflow='hidden'
		>
			<Box
				w='40%'
				bg={colorPalette.secondaryColor}
				h='100vh'
				position='absolute'
				zIndex='0'
				left='0'
				top='0'
				clipPath='polygon(0% 0%, 45% 0%, 0% 35%, 0 10%)'
			/>
			<Flex
				w='100%'
				flexDirection='row'
				alignItems='center'
				justifyContent='flex-start'
			>
				<Image
					w='3rem'
					_hover={{
						cursor: 'pointer',
					}}
					onClick={goBack}
					src={sidearrow}
					alt='sidearrow'
					zIndex='2'
					ml='2rem'
				/>
				<Spacer />
				<Text
					mt='1.5rem'
					fontSize='80px'
					color={colorPalette.linkTextColor}
					zIndex='2'

					fontFamily={fontTheme.fonts}
					width='120%'
					fontWeight='semibold'
					textAlign='center'
				>
					Inventário
				</Text>
				<Spacer />
				<Box display='flex' flexDirection='column' justifyContent='flex-end' mr='2rem' mt='1rem'>
					<Center
						_hover={{
							cursor: 'pointer',
							transform: 'scale(1.1)',
						}}
						transition='all 200ms cubic-bezier(.38, .5, .5, 1.5)'
						border='2px solid black'
						borderRadius='4.5rem'
						width='5rem'
						height='5rem'
						bg='white'
						onClick={() => goBackShop()}
					>
						<Image src={icon_shop} marginBottom='.1rem' />
					</Center>
					<Text
						color={colorPalette.primaryColor}
						fontFamily={fontTheme.fonts}
						fontSize='20px'
						fontWeight='medium'
						alignSelf='center'
					>
						LOJA
					</Text>
				</Box>
			</Flex>
			{validation ? (
				shopItem.length > 0 ? (
					<>
						<SimpleGrid
							zIndex='2'
							w='70%'
							columns={3}
							overflowY='auto'
							mt='2.5rem'
						>
							{shopItem.map(
								({
									_id,
									name,
									value,
									description,
									type,
									user_id,
									id_link,
								}: {
									user_id: Array<string>;
									_id: string;
									name: string;
									value: number;
									description: string;
									type: string;
									id_link: string;
								}) => {
									return (
										<PurchasedItems
											key={_id}
											_id={_id}
											current_user_id={currentUserId}
											users_id={user_id}
											name={name}
											value={value}
											description={description}
											type={type}
											id_link={id_link}
										/>
									);
								},
							)}
						</SimpleGrid>
					</>
				) : (
					<LoadingState />
				)
			) : (
				<Text
					mt='2.6rem'
					mr='3.4rem'
					fontFamily={fontTheme.fonts}
					fontSize='2.5rem'
					textDecoration='underline'
					color={colorPalette.infoTextColor}
					fontWeight='regular'
					zIndex='2'
				>
					Você ainda não possui nenhum item!
				</Text>
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
			{
				isLoading ? (
					<Box 
					position='fixed'
					zIndex='10' 
					top='0' 
					left='0' 
					right='0' 
					bottom='0' 
					backgroundColor={colorPalette.primaryColor}>
						<LoadingState />
					</Box>
				) : (null)
			}
		</Box>
	);
};

export default Shop;
