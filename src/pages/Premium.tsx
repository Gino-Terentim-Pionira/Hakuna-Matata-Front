import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Button, Image } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

// styles
import fontTheme from '../styles/base';
import colorPalette from '../styles/colorPalette';

// Images
import blinkCheatah from '../assets/icons/cheetahblink.svg';
import certificadoPremium from '../assets/icons/certificadoPremium.svg';
import mentorshipPremium from '../assets/icons/mentorshipPremium.svg';
import contentPremium from '../assets/icons/contentPremium.svg';
import planetEarthPremium from '../assets/icons/planetEarthPremium.svg';
import icon_membership from '../assets/icons/icon_membership.svg';

const Premium = () => {
	const history = useHistory();

	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			bg={colorPalette.backgroundColor}
			h='100vh'
		// overflow='hidden'
		>
			<Box
				w='40%'
				bg={colorPalette.primaryColor}
				h='100vh'
				position='absolute'
				zIndex='0'
				right='0'
				top='0'
				clipPath='polygon(70% 0%, 100% 0%, 100% 85%)'
			/>
			<Flex w='100%' flexDirection='row'>
				<Box
					display='flex'
					flexDirection='row'
					justifyContent='space-between'
					borderBottom='5px'
					borderBottomStyle='solid'
					borderColor={colorPalette.primaryColor}
					minWidth='1050px'
					position='relative'
					left='5%'
					mt='2.5rem'
					paddingBottom='1.5rem'
				>
					<Text
						fontFamily={fontTheme.fonts}
						fontSize='80px'
						// textDecoration='underline'
						color={colorPalette.secondaryColor}
						fontWeight='semibold'
						alignSelf='center'
					>
						Pionira Passaport Premium
					</Text>
					<Image src={blinkCheatah} />
				</Box>
			</Flex>

			<Box
				display='flex'
				flexDirection='row'
				justifyContent='center'
				width='90%'
			>
				<Text
					paddingBottom='3rem'
					fontFamily={fontTheme.fonts}
					fontSize='60px'
					mt='75px'
					color={colorPalette.detailsPremium}
					fontWeight='semibold'
					alignSelf='center'
				>
					Benefícios Premium
				</Text>
			</Box>
			<Box
				display='flex'
				flexDirection='row'
				justifyContent='space-between'
				width='90%'
			>
				<Box
					display='flex'
					flexDirection='column'
					w='300px'
					alignItems='center'
				>
					<Image
						src={certificadoPremium}
						boxSize='200px'
						alignSelf='center'
					/>
					<Text
						width='340px'
						height='72px'
						fontWeight='semibold'
						fontSize='36px'
						fontFamily={fontTheme.fonts}
						textAlign='center'
						color={colorPalette.descriptionText}
					>
						Certificados assinados por Gino Terentim.
					</Text>
				</Box>
				<Box
					display='flex'
					flexDirection='column'
					w='300px'
					alignItems='center'
				>
					<Image
						src={mentorshipPremium}
						boxSize='200px'
						alignSelf='center'
					/>
					<Text
						w='291px'
						fontWeight='semibold'
						fontSize='36px'
						fontFamily={fontTheme.fonts}
						textAlign='center'
						color={colorPalette.descriptionText}
					>
						Mentorias exclusivas com Gino Terentim.
					</Text>
				</Box>
				<Box
					display='flex'
					flexDirection='column'
					w='300px'
					alignItems='center'
				>
					<Image
						src={contentPremium}
						boxSize='200px'
						alignSelf='center'
					/>
					<Text
						width='199px'
						fontWeight='semibold'
						fontSize='36px'
						fontFamily={fontTheme.fonts}
						textAlign='center'
						color={colorPalette.descriptionText}
					>
						Conteúdos extras
					</Text>
				</Box>
			</Box>
			<Box
				display='flex'
				flexDirection='row'
				justifyContent='center'
				width='90%'
			>
				<Box
					display='flex'
					flexDirection='column'
					w='300px'
					mt='1.5rem'
					alignItems='center'
				>
					<Image src={planetEarthPremium} alignSelf='center' />
					<Text
						width='490px'
						fontWeight='semibold'
						fontSize='36px'
						fontFamily={fontTheme.fonts}
						textAlign='center'
						color={colorPalette.descriptionText}
					>
						Apoiar na preservação do meio ambiente
					</Text>
					<Text
						width='679px'
						fontWeight='semibold'
						fontSize='22px'
						mt='2rem'
						fontFamily={fontTheme.fonts}
						textAlign='center'
						color={colorPalette.inactiveButton}
					>
						*Parte do lucro do Pionira vai ser investido em ONGs de
						preservação ambiental*
					</Text>
				</Box>
			</Box>
			<Box
				border='3px'
				display='flex'
				borderStyle='solid'
				borderColor={colorPalette.primaryColor}
				borderRadius='10px'
				paddingY='25'
				paddingInline='36'
				mt='3rem'
				mb='3rem'
				flexDirection='column'
				alignItems='center'
				justifyContent='space-between'
			>
				<Image src={icon_membership} w='160px' h='160px' />
				<Text
					fontFamily={fontTheme.fonts}
					color={colorPalette.secondaryColor}
					fontWeight='semibold'
					fontSize='40px'
					mt='2rem'
				>
					Passaporte Premium Anual
				</Text>
				<Box display='flex' flexDirection='row' h='85px'>
					<Text
						fontFamily={fontTheme.fonts}
						fontWeight='semibold'
						fontSize='70px'
						color='#3A3A3A'
					>
						R$ 800.00
					</Text>
					<Text
						fontFamily={fontTheme.fonts}
						fontWeight='semibold'
						fontSize='30px'
						color='#787878'
						ml='1rem'
						display='flex'
						flexDirection='column'
						justifyContent='flex-end'
					>
						anual
					</Text>
				</Box>
				<Text
					fontFamily={fontTheme.fonts}
					color='#3F3F3F'
					fontWeight='semibold'
					fontSize='30px'
					mt='3rem'
				>
					Todos os benefícios inclusos
				</Text>
				<Button
					w='25rem'
					h='4rem'
					background={colorPalette.confirmButton}
					onClick={() => history.push('/payment')}
					mt='2rem'
				>
					<Text
						fontSize='35px'
						color={colorPalette.buttonTextColor}
						fontFamily={fontTheme.fonts}
						fontWeight='bold'
					>
						Assinar passaporte
					</Text>
				</Button>
			</Box>
			<Text
				marginTop='1rem'
				paddingBottom='2.8rem'
				fontFamily={fontTheme.fonts}
				color={colorPalette.subtitleColor}
				fontWeight='semibold'
				textAlign='center'
				fontSize='2rem'
				textDecoration='underline'
				_hover={{
					cursor: 'pointer',
				}}
				onClick={() => {
					history.push("/mainpage")
				}}
			>
				Voltar para a plataforma
			</Text>
		</Box>
	);
};

export default Premium;
