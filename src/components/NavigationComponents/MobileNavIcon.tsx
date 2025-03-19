import { Center, Flex, Slide, Text } from '@chakra-ui/react';
import colorPalette from '../../styles/colorPalette';
import React, { useState } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import "./styles/MobileNavIcon.css";
import fontTheme from '../../styles/base';
import { IoCloseSharp } from "react-icons/io5";
import TutorialTopicBackground from '../../assets/modal/tutorial_topic.png';

type MobileNavIconTypes = {
	marginTop?: string;
}

const MobileNavIcon = ({ marginTop }: MobileNavIconTypes) => {
	const [isOpen, setIsOpen] = useState(false);

	const renderItem = () => (
		<Flex
			width="100%"
			height="69px"
			border={`2px solid ${colorPalette.textColor}`}
			justifyContent="space-between"
			alignItems="center"
			padding="12px 16px"
			borderRadius="8px"
			backgroundColor="#FBEFC9"
		>
			<Text>
				Perfil de Usuário
			</Text>

			<GiHamburgerMenu
				size={32}
			/>
		</Flex>
	)

	return (
		<>
			<Center
				position='fixed'
				className='mobile_nav_icon_container'
				transition='all 0.2s ease'
				top={marginTop || '24px'}
				left='16px'
				border={`3px solid ${colorPalette.blackBorder}`}
				borderRadius='999px'
				width='53px'
				height='53px'
				bg='white'
				onClick={() => setIsOpen(!isOpen)}
				zIndex={9}
			>
				<GiHamburgerMenu size={32} />
			</Center>

			<Slide direction='left' in={isOpen} style={{ zIndex: 1900 }}>
				<Flex
					w='100%'
					h='105vh'
					flexDirection='column'
					justifyContent='flex-start'
					alignItems='center'
					overflowY='auto'
					bgImage={`url(${TutorialTopicBackground})`}
					backgroundPosition="center"
					backgroundRepeat="no-repeat"
					backgroundSize='cover'
					fontFamily={fontTheme.fonts}
					paddingX='16px'
					paddingTop='16px'
					paddingBottom='24px'
				>
					<Flex
						alignSelf='flex-end'
						onClick={() => setIsOpen(!isOpen)}
						transition='all 0.2s'
						_hover={{
							cursor: 'pointer',
							opacity: '80%',
						}}
						w='fit-content'
						color={colorPalette.closeButton}
						fontWeight='bold'
						fontSize='32px'
						marginBottom='24px'
					>
						<IoCloseSharp size={40} />
					</Flex>

					{renderItem()}
				</Flex>
			</Slide>
		</>
	);
}

export { MobileNavIcon }
