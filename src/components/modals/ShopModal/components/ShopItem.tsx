import { Center, Flex, Image, Text } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import React from 'react';

type ShopItemTypes = {
	image: string;
	title: string;
	type: string;
	value: string;
	onClick: VoidFunction;
}

export const ShopItem = ({ image, title, type, value, onClick } : ShopItemTypes) => (
	<Flex _hover={{cursor: 'pointer'}} w="148px" h="fit-content"  flexDir="column" onClick={onClick} >
		<Center padding="16px" borderRadius="8px" h="162px" border={`2px solid ${colorPalette.primaryColor}`} background={colorPalette.whiteText}>
			<Image
				src={image}
				alt={title}
				w="116px"
				h="126px"
			/>
		</Center>

		<Text mt="8px" fontSize="16px" fontWeight="medium" color={colorPalette.textColor}>
			{title}
		</Text>
		<Text fontSize="15px" color="#757575">
			{`Tipo: ${type}`}
		</Text>
		<Text mt="2px" fontSize="15px" color="#757575">
			{`Valor: ${value}`}
		</Text>
	</Flex>
);