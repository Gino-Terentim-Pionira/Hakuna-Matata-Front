import React from 'react';
import colorPalette from '../../styles/colorPalette';
import { Box, Center, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { getStatusColor } from '../../utils/statusUtils';
import { FaArrowLeft } from 'react-icons/fa';
import MediaQueriesEnum from '../../utils/enums/mediaQueries';

export const OracleHeader = ({
	oracleName
}: {
	oracleName: string
}) => {
	const history = useHistory();
	const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

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
			<Box
				_hover={{ transform: 'scale(1.1)', cursor: 'pointer' }}
				transition="all 0.2s ease"
				width={isDesktop ? "44px" : "32px"}
				onClick={() => history.goBack()}
			>
				<FaArrowLeft
					size="100%"
					color={colorPalette.whiteText}
				/>
			</Box>
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