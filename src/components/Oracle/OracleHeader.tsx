import React from 'react';
import colorPalette from '../../styles/colorPalette';
import { Center, Flex, Text } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { getStatusColor } from '../../utils/statusUtils';
import { useWindowSize } from '../../hooks/useWindowSize';
import { FaArrowLeft } from 'react-icons/fa';

export const OracleHeader = ({
	oracleName
}: {
	oracleName: string
}) => {
	const history = useHistory();
	const { isDesktop } = useWindowSize();

	return (
		<Flex
			width="100%"
			background={colorPalette.textColor}
			height="95px"
			alignItems="center"
			color={colorPalette.whiteText}
			paddingX={isDesktop ? "44px" : "16px"}
			paddingY="16px"
		>
			<FaArrowLeft size={isDesktop ? "44px" : "32px"} color={colorPalette.whiteText} onClick={() => history.goBack()} />
			<Center display="flex" flexDirection="column" alignSelf="center" flexGrow={1} mr={isDesktop ? 0 : "32px"}>
				<Text fontSize={isDesktop ? "32px" : "28px"} height="35px" color={colorPalette.whiteText}>
					Oráculo
				</Text>
				<Text marginBottom="4px" fontSize="18px" mt="4px" color={getStatusColor(oracleName.toLowerCase())}>
					{oracleName}
				</Text>
			</Center>
		</Flex>
	);
};