import React, {FC, useState} from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	Flex,
	Text,
	ModalHeader, useMediaQuery,
} from '@chakra-ui/react';
import ReactPlayer from 'react-player';

// Styles
import fontTheme from '../../styles/base';
import colorPalette from '../../styles/colorPalette';
import LoadingState from "../LoadingState";
import MediaQueriesEnum from '../../utils/enums/mediaQueries';

type IWelcomeVideoModal =
 {
    isOpen: boolean,
    onClose: VoidFunction,
}

const WelcomeVideoModal: 
FC<IWelcomeVideoModal> 
= ({ isOpen, onClose}) => {
    const [isLoad, setIsLoad] = useState(true);
    const handleCloseModal = () => {
            setIsLoad(true);
            onClose()
    }
	const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP)

	return (
		<Modal isOpen={isOpen} onClose={handleCloseModal} size='5xl'>
			<ModalOverlay />
			<ModalContent
				paddingX={{ base: '16px', md: '24px' }}
				margin={{ base: '0', md: '40px 0' }}
				paddingTop='24px'
				paddingBottom={{ base: '24px', md: '48px' }}
				background={colorPalette.oracleWhite}
				height={{ base: "100dvh", md: 'fit-content' }}
			>
				<ModalHeader paddingTop='0' paddingBottom='0px'>
					<Text
						fontFamily={fontTheme.fonts}
						fontWeight='semibold'
						color={colorPalette.primaryColor}
						fontSize='40px'
					>
						Seja bem vindo!
					</Text>
					<Text
						ml='4px'
						mt='-2px'
						fontFamily={fontTheme.fonts}
						fontWeight='medium'
						color={colorPalette.secundaryGrey}
						fontSize='18px'
					>
						Antes de começar sua jornada, algumas palavras de boas
						vindas do idealizador Gino Terentim!
					</Text>
				</ModalHeader>
				<ModalCloseButton
					size='lg'
					color={colorPalette.closeButton}
					onClick={handleCloseModal}
				/>
				<ModalBody mt='24px' padding={{base: "8px 16px", md: "8px 24px"}}>
					<Flex
						direction='column'
						alignItems='center'
						paddingTop='0px'
					>
						{isLoad && (
							<Flex height='450px'>
								<LoadingState />
							</Flex>
						)}
						<ReactPlayer
							url='https://www.youtube.com/watch?v=NPcGhuJ_zXk'
							controls={true}
							playing={true}
							width='100%'
							height={isDesktop ? '450px' : '350px'}
							onReady={() => setIsLoad(false)}
							style={{
								display: isLoad ? 'none' : 'block',
							}}
						/>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default WelcomeVideoModal;
