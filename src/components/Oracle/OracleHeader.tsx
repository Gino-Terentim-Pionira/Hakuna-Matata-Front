import React from 'react';
import colorPalette from '../../styles/colorPalette';
import { Center, Flex, Image, Text } from '@chakra-ui/react';
import SideArrow from '../../assets/icons/sidearrow.png';
import { useHistory } from 'react-router-dom';
import { getStatusColor } from '../../utils/statusUtils';

export const OracleHeader = ({
	oracleName
}: {
	oracleName: string
}) => {
	const history = useHistory();

	return (
		<Flex
			width="100%"
			background={colorPalette.textColor}
			height="95px"
			alignItems="center"
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

			<Center display="flex" flexDirection="column" alignSelf="center" flexGrow={1}>
				<Text fontSize="32px" height="35px" color={colorPalette.whiteText}>
					Oráculo
				</Text>
				<Text marginBottom="4px" fontSize="18px" mt="4px" color={getStatusColor(oracleName.toLowerCase())}>
					{oracleName}
				</Text>
			</Center>
		</Flex>
	);
};