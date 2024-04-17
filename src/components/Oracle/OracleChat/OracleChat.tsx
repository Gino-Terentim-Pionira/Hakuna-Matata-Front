import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import { OracleInput } from './components/OracleInput';
import colorPalette from '../../../styles/colorPalette';

export const OracleChat = () => (
	<Flex
		flexDir="column"
		justifyContent="flex-end"
		paddingX="24px"
		paddingBottom="32px"
		width="700px"
		overflowX="auto"
		overflowY="auto"
		height="90%"
		maxHeight="880px"
		margin="auto"
		marginLeft="0"
		marginRight="8px"
		background="rgba(240, 240, 240, 0.95)"
		borderRadius="8px"
		boxShadow="0 4px 4px rgba(0, 0, 0, 0.25), inset 0 4px 4px rgba(0, 0, 0, 0.25)"
	>
		<Box
			display="flex"
			flexDir="column"
			justifyContent="flex-end"
			width="100%"
			height="calc(100% - 55px)"
			background="transparent"
			overflowY="auto"
			paddingBottom="40px"
			rowGap="32px"
		>
			<Text
				color={colorPalette.oracleWhite}
				alignSelf="end"
				width="100%"
				maxWidth="297px"
				height="fit-content"
				background={colorPalette.primaryColor}
				paddingX="12px"
				paddingY="8px"
				borderRadius="8px 8px 0px 8px"
			>
				ndqwkndjkqwnkjdwqnjkdnqwkjndkjqnwkjdnjkwqndjkqwnjkndqwkdnqwkjdnsjankjdwqjk
			</Text>

			<Text
				color={colorPalette.textColor}
				alignSelf="start"
				width="100%"
				maxWidth="297px"
				height="fit-content"
				background={colorPalette.whiteText}
				paddingX="12px"
				paddingY="8px"
				borderRadius="8px 8px 8px 0px"
			>
				ndqwkndjkqwnkjdwqnjkdnqwkjndkjqnwkjdnjkwqndjkqwnjkndqwkdnqwkjdnsjankjdwqjk
			</Text>
		</Box>
		<OracleInput />
	</Flex>
);