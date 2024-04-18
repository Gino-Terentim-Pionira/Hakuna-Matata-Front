import React from 'react';
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
import OracleItem from '../../../assets/shop/oracleItem.jpg';
import { ShopItem } from './components/ShopItem';

type ShopModalType = {
	isOpen: boolean;
	onClose: VoidFunction;
}

export const ShopModal = ({isOpen, onClose} : ShopModalType) => (
	<Modal isCentered isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside" >
		<ModalOverlay />
		<ModalContent background={colorPalette.oracleWhite} paddingX="48px" fontFamily={fontTheme.fonts} >
			<ModalHeader width="100%" borderBottom={`2px solid ${colorPalette.primaryColor}`}>
				<Text width="fit-content" margin="auto" fontSize="40px" color={colorPalette.textColor} fontWeight="semibold" >Loja</Text>
				<ModalCloseButton color={colorPalette.closeButton}  size="48px" mr="8px" mt="8px" />
			</ModalHeader>

			<ModalBody width="100%">
				<SimpleGrid mt="16px" mb="16px" minChildWidth='130px' spacingX="48px" spacingY="32px" height="432px">
					<ShopItem onClick={() => console.log('teste')} image={OracleItem} title="Pacote Pequeno - Oraculo" type="Perguntas oraculo" value={50}/>
					<Flex w="130px" h="1px" />
					<Flex w="130px" h="1px" />
					<Flex w="130px" h="1px" />
				</SimpleGrid>
			</ModalBody>
		</ModalContent>
	</Modal>
);