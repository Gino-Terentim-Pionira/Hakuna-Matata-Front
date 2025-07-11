import React, { useState } from 'react';
import { Box, Button, Flex, Slide, Text, Tooltip, useMediaQuery } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import fontTheme from '../../../../styles/base';
import { OwnedItemInfoType } from '../InventoryModal';
import MediaQueriesEnum from '../../../../utils/enums/mediaQueries';

type InventoryItemDetailedTypes = {
	isOpen: boolean;
	onClose: VoidFunction;
	shopItemInfo: OwnedItemInfoType | undefined;
	onClick: VoidFunction;
}


export const InventoryItemDetailed = ({ isOpen, onClose, shopItemInfo, onClick }: InventoryItemDetailedTypes) => {
	const [startY, setStartY] = useState<number | null>(null);
	const [translateY, setTranslateY] = useState(0);
	const [closing, setClosing] = useState(false);
	const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

	const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
		setStartY(e.touches[0].clientY);
	};

	const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
		if (startY === null) return;
		const currentY = e.touches[0].clientY;
		const diff = currentY - startY;
		if (diff > 0) setTranslateY(diff);
	};

	const handleTouchEnd = () => {
		if (translateY > 100) {
			setClosing(true);
			onClose();
			setTimeout(() => {
				setClosing(false);
				setTranslateY(0);
			}, 100);
		} else {
			setTranslateY(0);
		}
	};

	return (
		<Slide direction='bottom' in={isOpen} style={{ zIndex: 1900 }}>
			<Box onClick={onClose} w='100%' h='100vh' />
			<Flex
				position='relative'
				w='100%'
				h={{ base: 'fit-content', md: '360px' }}
				bg={colorPalette.slideBackground}
				rounded='md'
				shadow='md'
				flexDirection='column'
				border='4px solid'
				borderColor={colorPalette.secondaryColor}
				fontFamily={fontTheme.fonts}
				color={colorPalette.textColor}
				style={{
					transform: `translateY(${translateY}px)`,
					transition: closing ? 'transform 0.3s ease-in-out' : '',
				}}
			>
				<Flex
					display={{ base: 'flex', md: 'none' }}
					width='100%'
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
					height='fit-content'
					paddingBottom='8px'
					paddingTop='12px'
				>
					<Flex
						width='50px'
						height='6px'
						borderRadius='1000px'
						backgroundColor={colorPalette.neutralGray}
						margin='auto'
					/>
				</Flex>
				<Text
					display={{ base: 'none', md: 'block' }}
					alignItems='flex-start'
					position='absolute'
					onClick={onClose}
					transition='all 0.2s'
					_hover={{
						cursor: 'pointer',
						opacity: '80%',
					}}
					w='fit-content'
					height='36px'
					color={colorPalette.closeButton}
					fontWeight='bold'
					fontSize='32px'
					right='16px'
					top='4px'
				>
					X
				</Text>
				<Flex
					paddingX={{ base: '16px', md: '24px' }}
					paddingTop={{ base: '8px', md: '16px' }}
					flexDir='column'
					top={{ base: 0, md: '32px' }}
					position={{ base: 'relative', md: 'absolute' }}
					w={{ base: '100%', md: '95%' }}
					height={{ base: '100%', md: 'auto' }}
				>
					<Text
						fontSize={{ base: '18px', md: '28px' }}
						fontWeight='semibold'
						textAlign='left'
						mb={{ base: '16px', md: '8px' }}
					>
						{shopItemInfo && shopItemInfo.title}
					</Text>
					<Flex
						flexDirection={{ base: 'column', md: 'row' }}
						alignItems='flex-start'
						justifyContent='space-between'
						columnGap='24px'
						height={{ base: '100%', md: 'auto' }}
					>
						<Box
							maxHeight={{ base: '60dvh', md: 'auto' }}
							overflowY='auto'
							width={{ base: '100%', md: '80%' }}
						>
							<Text
								fontSize={{ base: '16px', md: '18px' }}
								fontWeight='regular'
								textAlign='justify'
							>
								{shopItemInfo && shopItemInfo.description} 
							</Text>
						</Box>

						<Tooltip
							isDisabled={!isDesktop}
							label={'Baixar Item'}
							placement='bottom'
							hasArrow
							closeOnClick={false}
						>
							<Button
								w={{ base: "100%", md: '200px' }}
								height='3.5rem'
								marginTop={{ base: "24px", md: "4px" }}
								marginBottom={{ base: '24px', md: '4px' }}
								background={colorPalette.secondaryColor}
								color={colorPalette.buttonTextColor}
								fontSize={{ base: '20px', md: '1.5rem' }}
								borderRadius='8px'
								_hover={{
									opacity: 0.7,
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
	);
}
