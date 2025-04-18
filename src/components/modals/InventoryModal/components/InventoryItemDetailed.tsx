import React, { useState } from 'react';
import { Box, Button, Flex, Slide, Text, Tooltip } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import fontTheme from '../../../../styles/base';
import { OwnedItemInfoType } from '../InventoryModal';
import "./styles/InventoryIteDetailed.css";

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
		<Slide direction="bottom" in={isOpen} style={{ zIndex: 1900 }}>
			<Box onClick={onClose} w='100%' h='100vh' />
			<Flex
				className="inventory_item_detailed_container"
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
				color={colorPalette.textColor}
				style={{
					transform: `translateY(${translateY}px)`,
					transition: closing ? 'transform 0.3s ease-in-out' : '',
				}}
			>
				<Flex
					className="iventory_item_detailed_container_close_bar"
					width="100%"
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
					height='fit-content'
					paddingBottom="8px"
					paddingTop="12px"
				>
					<Flex
						width="50px"
						height="6px"
						borderRadius="1000px"
						backgroundColor={colorPalette.neutralGray}
						margin="auto"
					/>
				</Flex>
				<Text
					className="inventory_item_detailed_container_close_button"
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
				<Flex className="inventory_item_detailed_body_container" paddingLeft="24px" flexDir="column" top="32px" position="absolute" w="95%">
					<Text
						className="inventory_item_detailed_body_container_title"
						fontSize={['0.7rem', '1.5rem', '1.7rem']}
						fontWeight='semibold'
						textAlign='left'
						mb='8px'
					>
						{shopItemInfo && shopItemInfo.title}
					</Text>
					<Flex className="inventory_item_detailed_body_container_items_container" alignItems="flex-start" justifyContent="space-between" columnGap="24px">
						<Text
							className="inventory_item_detailed_body_container_items_container_description"
							width='80%'
							fontSize={['0.5rem', '1rem', '1.2rem']}
							fontWeight='regular'
							textAlign='left'
							overflowY="auto"
							maxH="260px"
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
								className="inventory_item_detailed_body_container_items_container_button"
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
