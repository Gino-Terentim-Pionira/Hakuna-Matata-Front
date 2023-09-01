import React, { useEffect, useState } from 'react';
import { Box, Flex, Spacer, Text } from '@chakra-ui/layout';
import { Button, Center, Image, SimpleGrid } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import usePath from '../hooks/usePath';

// Components
import AlertModal from '../components/modals/AlertModal';
import PurchasedItems from '../components/PurchasedItems';

// Requisitions
import api from '../services/api';
import { useUser } from '../hooks';

// Styles
import fontTheme from '../styles/base';
import colorPalette from '../styles/colorPalette';

// Images
import icon_shop from '../assets/icons/icon_shop.svg';
import { errorCases } from '../utils/errors/errorsCases';
import LoadingOverlay from '../components/LoadingOverlay';
import BackButton from '../components/BackButton';


const Shop = () => {
	const { getNewUserInfo, userData } = useUser();
	const { path } = usePath();
	const [shopItem, setShopItem] = useState([]);
	const [onError, setOnError] = useState(false);
	const history = useHistory();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const getShopItens = async () => {
		try {
			if (Object.keys(userData).length == 0)
				getNewUserInfo();
			
			const res = await api.get('/shopItem/');
			setShopItem(res.data);
			setIsLoading(false);
		} catch (error) {
			setOnError(true);
		}
	};

	const goBackShop = async () => {
		history.push(`/shop`);
	};

	const goBack = () => {
		history.push(path);
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
				<BackButton 
					onClick={goBack}
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
			{userData?.items_id?.length > 0 ? (
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
								id_link,
							}: {
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
										items_id={userData.items_id}
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
			{
				isLoading && <LoadingOverlay />
			}
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
		</Box>
	);
};

export default Shop;
