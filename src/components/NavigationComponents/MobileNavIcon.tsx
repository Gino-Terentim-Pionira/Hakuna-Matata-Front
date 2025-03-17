import { Center } from '@chakra-ui/react';
import colorPalette from '../../styles/colorPalette';
import React from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import "./styles/MobileNavIcon.css";

type MobileNavIconTypes = {
	marginTop?: string;
	onClick: VoidFunction;
}

const MobileNavIcon = ({ marginTop, onClick }: MobileNavIconTypes) => (
	<Center
		position="fixed"
		className="mobile_nav_icon_container"
		transition='all 0.2s ease'
		top={marginTop || '24px'}
		left="16px"
		border={`3px solid ${colorPalette.blackBorder}`}
		borderRadius='999px'
		width="53px"
		height="53px"
		bg='white'
		onClick={onClick}
		zIndex={9}
	>
		<GiHamburgerMenu
			size={32}
		/>
	</Center>
)

export { MobileNavIcon }
