import { Box, Button, Flex, Slide, Text, Tooltip } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import fontTheme from '../../../../styles/base';
import React from 'react';
import rarityEnum from '../../../../utils/enums/rarity';
import { getRelicColor } from '../../../../utils/relicsUtil';

type RelicInfoModalType = {
	isOpen: boolean;
	onClose: VoidFunction;
	isHaveNoButton?: boolean;
	title?: string;
	rarity: rarityEnum,
	description?: string,
	discoveredTrail?: string,
	hint: string,
	isEquiped?: boolean,
	button?: {
		backgroundColor: string;
		onClick: VoidFunction;
		label: string;
		disabledLabel?: string;
	}
}

export const RelicInfoSlide = ({ isOpen, onClose, isHaveNoButton, title, rarity, description, discoveredTrail, hint, isEquiped, button }: RelicInfoModalType) => {
	const relicColor = getRelicColor(rarity);
	return (
		<Slide direction="bottom" in={isOpen} style={{ zIndex: 10 }} >
			<Box onClick={onClose} width="100vw" height="100vh" top="0" bg={"transparent"} />
			<Flex
				width="100%"
				height="230px"
				alignItems="center"
				border={`4px solid ${colorPalette.secondaryColor}`}
				rounded="md"
				shadow="md"
				background={colorPalette.slideBackground}
				position="relative"
				paddingLeft="40px"
				paddingRight="40px"
				flexDirection="column"
				zIndex={10000}
			>
				<Flex marginTop="24px" fontFamily={fontTheme.fonts} color={colorPalette.textColor} justifyContent="space-between" alignItems="flex-start" width="100%" maxWidth="1500px">
					<Flex justifyContent="center" alignItems="center">
						<Flex display="flex" fontSize="24px" fontWeight="semibold" >
							{
								!isHaveNoButton ? <>{title} (<Text color={relicColor}>{rarity}</Text>)</> : 'Não identificado'
							}

						</Flex>
						{
							isEquiped && <Flex fontSize="14px" fontWeight="bold" color={colorPalette.correctAnswer} marginLeft="8px">
								Reliquía equipada
							</Flex>
						}
					</Flex>

					<Text
						justifyContent='flex-end'
						fontSize='32px'
						fontFamily="system-ui"
						fontWeight='bold'
						marginTop="-16px"
						color={colorPalette.closeButton}
						onClick={onClose}
						transition='all 0.2s'
						_hover={{
							cursor: 'pointer',
							opacity: '80%'
						}}
						_active={{
							opacity: '50%'
						}}
					>
						X
					</Text>

				</Flex>

				<Flex marginTop="8px" gap="32px" fontFamily={fontTheme.fonts} color={colorPalette.textColor} justifyContent="space-between" alignItems="center" width="100%" maxWidth="1500px">
					<Flex flexDirection="column">
						<Flex display="flex" fontSize="18px">
							{!isHaveNoButton ? description : <>Aparentemente essa é uma relíquia de nível (<Text color={relicColor} fontWeight="semibold" >{rarity}</Text>), Viajante!</> }
						</Flex>
						<Flex display="flex" marginTop="16px" fontSize="18px">
							<Text marginRight="4px" fontWeight="semibold">{!isHaveNoButton ? 'Encontrada:' : 'Dica para encontrar a relíquia:'}</Text> {!isHaveNoButton ? discoveredTrail : hint}.
						</Flex>
					</Flex>

					{
						!isHaveNoButton && <Flex flexDirection="column" marginRight='24px'>
						<Tooltip
							placement="left"
							gutter={10}
							label={button?.disabledLabel && button?.disabledLabel}
						>
							<Button 
								onClick={button?.disabledLabel ? undefined : button?.onClick}
								width="203px" 
								minHeight="45px" 
								background={button?.disabledLabel ? colorPalette.neutralGray : button?.backgroundColor}
								color={colorPalette.whiteText}
								cursor={button?.disabledLabel ? 'not-allowed' : 'pointer'}
							>
								{button?.label}
							</Button>
						</Tooltip>

							<Button marginTop="16px" width="203px" minHeight="45px" colorScheme='linkedin' color={colorPalette.whiteText} cursor='pointer'>
								Compartilhar
							</Button>
						</Flex>
					}
				</Flex>
			</Flex>
		</Slide>
	);
}