import React, {useEffect, useState} from 'react';
import {Box, Flex, Spacer, Text} from '@chakra-ui/layout';
import {Button, Center, Image, SimpleGrid} from '@chakra-ui/react';
import {useHistory} from 'react-router-dom';
import {useUser} from '../hooks';
import usePath from '../hooks/usePath';

// Components
import ShopItem from '../components/shopItem';
import AlertModal from '../components/modals/AlertModal';
import LoadingOverlay from '../components/LoadingOverlay';

// Requisitions
import api from '../services/api';

// styles
import fontTheme from '../styles/base';
import colorPalette from '../styles/colorPalette';

// Images
import icon_inventory from '../assets/icons/icon_inventory.svg';
import {errorCases} from '../utils/errors/errorsCases';
import BackButton from '../components/BackButton';
import {getStatusPoints} from '../utils/statusUtils';
import {useSoundtrack} from "../hooks/useSoundtrack";

const Shop = () => {
	const { handleBack } = usePath();
	const { getNewUserInfo, userData } = useUser();
	const { soundtrackData, audio } = useSoundtrack();
	const [shopItem, setShopItem] = useState([]);
	const [currentUserId, setCurrentUserId] = useState('');
	const [onError, setOnError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const history = useHistory();

	const getShopItens = async () => {
		try {
			if (Object.keys(userData).length == 0) {
				await getNewUserInfo();
			}
			const res = await api.get('/shopItem/');
			const userId = sessionStorage.getItem('@pionira/userId');
			const userIdString = '' + userId;
			setShopItem(res.data);
			setCurrentUserId(userIdString);
			setIsLoading(false);
		} catch (error) {
			setOnError(true);
		}
	};

	const goToInventory = async () => {
		const userId = sessionStorage.getItem('@pionira/userId');
		history.push(`/inventory/${userId}`);
	}

	const goBack = () => {
		handleBack();
	};

	useEffect(() => {
		if(!soundtrackData.isPlaying) {
			audio.src = sessionStorage.getItem("lastSoundtrack") as string;
		}

		getShopItens();
	}, []);
	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			bg={colorPalette.backgroundColor}
			h='100vh'
			overflow='hidden'
		>
			<Box
				w='40%'
				bg={colorPalette.primaryColor}
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
				justifyContent='center'
			>
				<BackButton 
					onClick={goBack}
				/>
				<Spacer />
				<Text
					fontFamily={fontTheme.fonts}
					mt='1.5rem'
					fontSize='80px'
					color={colorPalette.primaryColor}
					fontWeight='semibold'
					alignSelf='center'
				>
					LOJA
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
						onClick={() => goToInventory()}
					>
						<Image width='3.5rem' src={icon_inventory} marginBottom='.1rem' />
					</Center>
					<Text
						color={colorPalette.linkTextColor}
						fontFamily={fontTheme.fonts}
						fontSize='20px'
						fontWeight='regular'
						alignSelf='center'
					>
						Inventário
					</Text>
				</Box>
			</Flex>
			{isLoading ? (
				<LoadingOverlay />
			) : (
				<>
					<SimpleGrid w='72%' columns={3} overflowY='auto' mt='2rem'>
						{shopItem.map(
							({
								_id,
								name,
								value,
								description,
								type,
								status_requirement
							}: {
								_id: string;
								name: string;
								value: number;
								description: string;
								type: string;
								status_requirement: {
									status_name: string;
									points: number;
								}
							}) => {
								if (!userData?.items_id?.includes(_id)) {
									return (
										<ShopItem
											key={_id}
											_id={_id}
											current_user_id={currentUserId}
											items_id={userData.items_id}
											userCoins={userData.coins}
											name={name}
											value={value}
											description={description}
											type={type}
											userStatus={getStatusPoints(userData, status_requirement.status_name)}
											itemStatus={status_requirement}
										/>
									);
								}
							},
						)}
					</SimpleGrid>
				</>
			)}
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
