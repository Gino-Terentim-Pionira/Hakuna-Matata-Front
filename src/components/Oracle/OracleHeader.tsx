import React from 'react';
import colorPalette from '../../styles/colorPalette';
import { Center, Flex, Image, Text } from '@chakra-ui/react';
import SideArrow from '../../assets/icons/sidearrow.png';
import CoinIcon from '../../assets/icons/coinicon.svg';
import NavIcon from '../NavigationComponents/NavIcon';
import icon_shop from '../../assets/icons/icon_shop.svg';
import { STORE } from '../../utils/constants/mouseOverConstants';
import { useHistory } from 'react-router-dom';
import { useUser } from '../../hooks';

type OracleHeaderType = {
	onOpen: VoidFunction;
}

export const OracleHeader = ({onOpen}: OracleHeaderType) => {
	const history = useHistory();
	const { userData } = useUser();

	return (
		<Flex
			width="100%"
			background={colorPalette.textColor}
			height="95px"
			alignItems="center"
			justifyContent="space-between"
			color={colorPalette.whiteText}
			paddingX="44px"
			paddingY="16px"
		>
			<Image
				_hover={{ cursor: 'pointer', transform: 'scale(1.1)' }}
				transition="all 0.2s ease"
				width="44px"
				src={SideArrow}
				alt="Voltar para página anterior"
				onClick={() => history.goBack()}
			/>

			<Center display="flex" flexDirection="column">
				<Text fontSize="32px" height="35px" color={colorPalette.whiteText}>
					Oráculo
				</Text>
				<Text marginBottom="4px" fontSize="18px" mt="4px" color={colorPalette.primaryColor}>
					Agilidade
				</Text>
			</Center>

			<Center>
				<Flex alignItems="flex-end" flexDirection="column" color={colorPalette.oracleWhite}>
					<Center mt="6px" height="25px">
						<Text mr="4px" fontWeight="medium" fontSize="24px">{userData.coins}</Text>
						<Image width="44px" src={CoinIcon} alt="Icone Moeda" />
					</Center>
					<Center>
						<Text fontWeight="medium" fontSize="24px">
							{userData.oracle_messages || "0"}
						</Text>
						<Text ml="4px" fontSize="26px">Perguntas</Text>
					</Center>
				</Flex>
				<Flex ml="16px">
					<NavIcon
						image={icon_shop}
						onClick={onOpen}
						size="normal"
						marginTop="0"
						isMap={false}
						position="bottom"
						mouseOver={STORE}
					/>
				</Flex>
			</Center>
		</Flex>
	);
};