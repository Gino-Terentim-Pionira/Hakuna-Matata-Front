import React, { useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Text,
	SimpleGrid, Flex,
} from '@chakra-ui/react';
import colorPalette from '../../../styles/colorPalette';
import fontTheme from '../../../styles/base';
import { ShopItem } from './components/ShopItem';
import { ShopItemDetailed } from './components/ShopItemDetailed';

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

export const ShopModal = ({isOpen, onClose, packages} : ShopModalType) => {
	const [shopItemInfo, setShopItemInfo] = useState<ShopItemInfoType | undefined>();

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
			<ShopItemDetailed shopItemInfo={shopItemInfo} isOpen={!!shopItemInfo} onClose={closeShopItemInfo}/>
		</Modal>
	);
};