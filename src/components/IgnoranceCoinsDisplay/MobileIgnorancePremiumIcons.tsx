import { Flex } from '@chakra-ui/react';
import IgnoranceProgress from './IgnoranceProgress';
import React from 'react';
import CoinsDisplay from './CoinsDisplay';
import { useUser } from '../../hooks';
import "./styles/MobileIgnorancePremiumIcons.css";

const MobileIgnorancePremiumIcons = () => {
	const { userData } = useUser();

	return (
		<Flex
			className="mobile_ignorance_premium_icons_container"
			position="fixed"
			bottom="24px"
			right="16px"
			width="55%"
			flexDirection='column'
			alignItems='flex-end'
		>
			<CoinsDisplay
				value={userData.coins}
				position='bottom'
			/>
			<IgnoranceProgress
				width="100%"
				position='bottom'
				ignorance={userData.ignorance}
			/>
		</Flex>
	)
}

export { MobileIgnorancePremiumIcons };