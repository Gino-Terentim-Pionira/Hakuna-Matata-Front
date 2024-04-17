import React from 'react';
import { Flex, Image } from '@chakra-ui/react';
import fontTheme from '../styles/base';
import OracleBackground from '../assets/scenerys/oracle/oracleBackground.webp';
import CheetahOracle from '../assets/sprites/oracle/cheetahOracle.png';
import { OracleHeader } from '../components/Oracle/OracleHeader';
import { OracleChat } from '../components/Oracle/OracleChat/OracleChat';

export const Oracle = () => {
	return (
		<Flex
			height="100vh"
			width="100%"
			flexDirection="column"
			alignItems="center"
			fontFamily={fontTheme.fonts}
		>
			<OracleHeader />

			<Flex
				backgroundImage={`url(${OracleBackground})`}
				backgroundSize="cover"
				backgroundPosition="top"
				backgroundRepeat="no-repeat"
				height="calc(100vh - 95px)"
				width="100%"
				justifyContent="center"
				alignItems="flex-end"
				columnGap={{ sm: '24px', md: '34px', '2xl': '112px' }}
				paddingX="16px"
			>
				<Image width="30%" minW="320px" maxWidth="537px" height="70%" minHeight="485px" maxHeight="800px" src={CheetahOracle} />
				<OracleChat />
			</Flex>
		</Flex>
	);
}