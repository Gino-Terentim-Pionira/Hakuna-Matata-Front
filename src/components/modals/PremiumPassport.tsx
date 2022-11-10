import React, { FC } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	Box,
	ModalBody,
	Flex,
	Text,
	Image,
	UnorderedList,
	ListItem,
	Button,
} from '@chakra-ui/react';

// Styles
import fontTheme from '../../styles/base';
import colorPalette from '../../styles/colorPalette';

//Assets
import mamba_negra_happy from '../../assets/sprites/blackMamba/mamba_negra_happy.png';
import passport from '../../assets/icons/passport.svg';

//utils
import { useHistory } from 'react-router-dom';

type IPremiumPassport = {
	isOpen: boolean;
	onClose: VoidFunction;
	onToggle: VoidFunction;
};

const PremiumPassport: FC<IPremiumPassport> = ({ isOpen, onClose }) => {
	const history = useHistory();

	const goToPremium = () => {
		history.push('/premium');
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='4xl'>
			<ModalOverlay />
			<ModalContent height='34rem'>
				<Box
					w='25%'
					bg={colorPalette.primaryColor}
					h='55vh'
					position='absolute'
					zIndex='-1'
					right='-0.3'
					top='0'
					borderTopRightRadius='5px'
					clipPath='polygon(0% 0%, 100% 0%, 100% 85%)'
				/>
				<ModalBody padding='0'>
					<Flex w='100%' h='100%'>
						<Box
							width='60%'
							marginLeft='3.5rem'
							position='relative'
						>
							<Flex
								display='flex'
								z-index='5'
								marginTop='2.2rem'
								position='relative'
							>
								<Text
									fontFamily={fontTheme.fonts}
									width='120%'
									fontWeight='semibold'
									fontSize='3.5rem'
									color={colorPalette.secondaryColor}
									textAlign='center'
								>
									Passaporte Premium
								</Text>
								<Image src={passport} marginLeft='0.6rem' />
							</Flex>
							<Text
								display='flex'
								w='120%'
								marginTop='0.4rem'
								textAlign='left'
								fontFamily={fontTheme.fonts}
								fontWeight='semibold'
								fontSize='2rem'
								color={colorPalette.subtitleColor}
							>
								Aproveite o melhor da sua{' '}
								<Text
									color={colorPalette.inactiveButton}
									marginLeft='0.4rem'
								>
									{' '}
									viagem na savana!
								</Text>
							</Text>
							<Text
								marginTop='1.2rem'
								fontFamily={fontTheme.fonts}
								fontWeight='semibold'
								fontSize='1.4rem'
								color={colorPalette.subtitleColor}
							>
								Vire membro agora e tenha acesso há:
								<UnorderedList>
									<ListItem marginLeft='1.5rem'>
										Certificados exclusivos do Gino
										Terentim!
									</ListItem>
									<ListItem marginLeft='1.5rem'>
										Acesso a conteúdos exclusivos!
									</ListItem>
									<ListItem marginLeft='1.5rem'>
										Mentorias privadas!
									</ListItem>
								</UnorderedList>
							</Text>
							<Text
								w='100%'
								fontFamily={fontTheme.fonts}
								color={colorPalette.secondaryColor}
								fontWeight='semibold'
								fontSize='1.2rem'
								marginTop='1rem'
							>
								*Parte do lucro será doado para ONGs de
								preservação ambiental!*
							</Text>
							<Box w='50%' marginTop='1.7rem'>
								<Button
									color='white'
									fontSize='1.7rem'
									fontWeight='regular'
									fontFamily={fontTheme.fonts}
									bg={colorPalette.primaryColor}
									width='100%'
									h='3rem'
									onClick={() => {
										goToPremium();
									}}
								>
									Saiba mais!
								</Button>
								<Text
									marginTop='1rem'
									fontFamily={fontTheme.fonts}
									color={colorPalette.subtitleColor}
									fontWeight='semibold'
									textAlign='center'
									fontSize='1.2rem'
									textDecoration='underline'
									_hover={{
										cursor: 'pointer',
									}}
									onClick={() => {
										onClose();
									}}
								>
									Voltar para a plataforma
								</Text>
							</Box>
						</Box>
						<Box width='40%' overflow='hidden' position='relative'>
							<Image
								src={mamba_negra_happy}
								w='100%'
								position='absolute'
								z-zIndex='5'
								objectFit='cover'
								boxSize='110%'
								ml='2rem'
							/>
						</Box>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default PremiumPassport;
