import React from 'react';
import { Box, Button, Flex, Slide, Text, Tooltip } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import fontTheme from '../../../../styles/base';
import { OwnedItemInfoType } from '../InventoryModal';

type InventoryItemDetailedTypes = {
	isOpen: boolean;
	onClose: VoidFunction;
	shopItemInfo: OwnedItemInfoType | undefined;
	onClick: VoidFunction;
}


export const InventoryItemDetailed = ({ isOpen, onClose, shopItemInfo, onClick }: InventoryItemDetailedTypes) => {

	return (
		<Slide direction="bottom" in={isOpen} style={{ zIndex: 1900 }}>
			<Box onClick={onClose} w='100%' h='100vh' />
			<Flex
				position="relative"
				w='100%'
				h='360px'
				bg={colorPalette.slideBackground}
				rounded='md'
				shadow='md'
				flexDirection='column'
				border='4px solid'
				borderColor={colorPalette.secondaryColor}
				fontFamily={fontTheme.fonts}
			>
				<Text
					alignItems="flex-start"
					position="absolute"
					onClick={onClose}
					transition='all 0.2s'
					_hover={{
						cursor: 'pointer',
						opacity: '80%',
					}}
					w='fit-content'
					height="36px"
					color={colorPalette.closeButton}
					fontWeight='bold'
					fontSize='32px'
					right='16px'
					top='4px'
				>
					X
				</Text>
				<Flex paddingLeft="24px" flexDir="column" top="32px" position="absolute" w="95%">
					<Text
						fontSize={['0.7rem', '1.5rem', '1.7rem']}
						fontWeight='semibold'
						textAlign='left'
						mb='8px'
					>
						{shopItemInfo && shopItemInfo.title}
					</Text>
					<Flex alignItems="flex-start" justifyContent="space-between" columnGap="24px">
						<Text
							width='80%'
							fontSize={['0.5rem', '1rem', '1.2rem']}
							fontWeight='regular'
							textAlign='left'
							overflowY="auto"
							maxH="260px"
							paddingBottom="16px"
						>
							{shopItemInfo && shopItemInfo.description}
						</Text>

						<Tooltip
							label={'Baixar Item'}
							placement='bottom'
							hasArrow
							closeOnClick={false}
						>
							<Button
								w="200px"
								height='3.5rem'
								background={colorPalette.secondaryColor}
								color={colorPalette.buttonTextColor}
								fontSize='1.5rem'
								borderRadius='8px'
								_hover={{
									opacity: 0.7
								}}
								onClick={onClick}
								cursor={'pointer'}
							>
								Baixar
								</Button>
						</Tooltip>
					</Flex>
				</Flex>
			</Flex>

		</Slide>
	)
}
