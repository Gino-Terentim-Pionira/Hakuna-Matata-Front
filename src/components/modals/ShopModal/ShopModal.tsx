import React, { useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Text,
	SimpleGrid, Flex, Button,
} from '@chakra-ui/react';
import colorPalette from '../../../styles/colorPalette';
import fontTheme from '../../../styles/base';
import { ShopItem } from './components/ShopItem';
import { ShopItemDetailed } from './components/ShopItemDetailed';
import AlertModal from '../AlertModal';
import { OracleServices } from '../../../services/OracleServices';
import { useUser } from '../../../hooks';

type ShopModalType = {
	isOpen: boolean;
	onClose: VoidFunction;
	packages: ShopItemInfoType[] | undefined;
}

export type ShopItemInfoType = {
	title: string;
	description: string;
	price: string;
	messages?: string;
	type: string;
	image: string;
}

type AlertModalInfoType = {
	isOpen: boolean,
	alertBody?: string,
	alertTitle?: string,
}

export const ShopModal = ({isOpen, onClose, packages} : ShopModalType) => {
	const {userData,getNewUserInfo} = useUser();
	const oracleService = new OracleServices();
	const [isAlertLoading, setIsAlertLoading] = useState(false);
	const [shopItemInfo, setShopItemInfo] = useState<ShopItemInfoType | undefined>();
	const [alertModalInfo, setAlertModalInfo] = useState<AlertModalInfoType>({
		isOpen: false,
		alertBody: '',
		alertTitle: '',
	});

	const handleShopItemInfo = (item: ShopItemInfoType) => {
		setShopItemInfo({
			title: item.title,
			description: item.description,
			price: item.price,
			type: item.type,
			image: item.image,
		})
	}

	const closeShopItemInfo = () => {
		setShopItemInfo(undefined)
	}

	const openAlertModalInfo = () => {
		setAlertModalInfo({
			isOpen: true,
			alertBody: 'Certeza que deseja comprar esse pacotes de perguntas?',
			alertTitle: shopItemInfo?.title,
		})
	}

	const closeAlertModal = () => {
		setAlertModalInfo({
			isOpen: false,
			alertBody: '',
			alertTitle: '',
		})
	}

	const buyItem = async () => {
		const package_name = shopItemInfo ? shopItemInfo?.title : ''
		try {
			setIsAlertLoading(true);
			await oracleService.buyOracleMessages(userData._id, package_name);
			await getNewUserInfo();
			closeAlertModal();
		} catch (e) {
			console.log(e);
			// TODO: handle error
		}
		setIsAlertLoading(false);
	}

	return (
		<Modal isCentered isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
			<ModalOverlay />
			<ModalContent background={colorPalette.oracleWhite} paddingX="48px" fontFamily={fontTheme.fonts}>
				<ModalHeader width="100%" borderBottom={`2px solid ${colorPalette.primaryColor}`}>
					<Text width="fit-content" margin="auto" fontSize="40px" color={colorPalette.textColor}
						  fontWeight="semibold">Loja</Text>
					<ModalCloseButton color={colorPalette.closeButton} size="48px" mr="8px" mt="8px" />
				</ModalHeader>

				<ModalBody width="100%">
					<SimpleGrid mt="16px" mb="16px" minChildWidth="130px" spacingX="48px" spacingY="32px"
								height="432px">
						{
							packages && packages.map((item) =>
								<ShopItem
									key={item.title}
									onClick={() => handleShopItemInfo(item)}
									image={item.image}
									title={item.title}
									type={item.type}
									value={item.price}
								/>
							)
						}
						<Flex w="130px" h="1px" />
						<Flex w="130px" h="1px" />
						<Flex w="130px" h="1px" />
					</SimpleGrid>
				</ModalBody>
			</ModalContent>
			<ShopItemDetailed onClick={openAlertModalInfo} shopItemInfo={shopItemInfo} isOpen={!!shopItemInfo} onClose={closeShopItemInfo}/>
			<AlertModal
				isOpen={alertModalInfo.isOpen}
				onClose={closeAlertModal}
				closeOnOverlayClick={false}
				buttonBody={ <>
					<Button
						onClick={closeAlertModal}
						isDisabled={isAlertLoading}
					>
						Cancel
					</Button>
					<Button
						color='white'
						bg={colorPalette.primaryColor}
						onClick={buyItem}
						ml={3}
						isLoading={isAlertLoading}
					>
						Comprar
					</Button>
				</>}
				alertTitle={alertModalInfo.alertTitle}
				alertBody={alertModalInfo.alertBody}
			/>
		</Modal>
	);
};