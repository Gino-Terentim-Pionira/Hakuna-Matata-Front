import { Center, Flex, Image, Text, Box } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import Coins from '../../../../assets/icons/coinicon.svg';
import PremiumCoins from '../../../../assets/icons/premiumCoins.svg';
import PremiumStamp from '../../../../assets/icons/premiumCoinStamp.svg';
import React from 'react';

type ShopItemTypes = {
	image: string;
	title: string;
	type: string;
	value: number;
	premiumValue?: number;
	onClick: VoidFunction;
}

export const ShopItem = ({ image, title, type, value, premiumValue, onClick }: ShopItemTypes) => (
	<Flex _hover={{ cursor: 'pointer' }} w="148px" h="fit-content" flexDir="column" onClick={onClick} >
		<Center position="relative" padding="16px" borderRadius="8px" h="162px" border={`2px solid ${colorPalette.primaryColor}`} background={colorPalette.whiteText}>
			<Image
				src={image}
				alt={title}
				w="116px"
				h="126px"
			/>
			{premiumValue && (
				<Box
					position="absolute"
					right={0}
					top={0}
					zIndex={1}
				>
					<Image
						src={PremiumStamp}
						alt="Selo de Essência"
						w="26px"
						h="26px"
					/>
				</Box>
			)}
		</Center>

		<Text mt="8px" fontSize="16px" fontWeight="medium" color={colorPalette.textColor}>
			{title}
		</Text>
		<Text fontSize="15px" color="#757575">
			{`Tipo: ${type}`}
		</Text>
		<Flex
			mt="2px"
		>
			<Text fontSize="15px" color="#757575">
				Valor:
			</Text>
			<Flex
				alignItems="center"
				position="relative"
			>
				<Text ml='2px' fontSize="15px" color="#757575">
					{value}
				</Text>
				<Image
					w="20px"
					ml="1px"
					src={Coins}
					alt="icone de Joias"
				/>
				{premiumValue && (
					<Box
						position="absolute"
						left={0}
						right={0}
						top="50%"
						height="2px"
						bg={colorPalette.closeButton}
						opacity={0.7}
						zIndex={1}
					/>
				)}
			</Flex>
			{
				premiumValue ? (
					<Flex
						alignItems="center"
					>
						<Text ml='4px' fontSize="15px" color="#757575">
							{premiumValue}
						</Text>
						<Image
							w="15px"
							ml="1px"
							src={PremiumCoins}
							alt="icone de Essências"
						/>
					</Flex>
				) : null
			}
		</Flex>
	</Flex>
);