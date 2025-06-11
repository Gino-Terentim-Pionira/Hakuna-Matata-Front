import React, { useState } from 'react';
import { Box, Button, Flex, Image, Slide, Text, Tooltip, useMediaQuery } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import { ShopItemInfoType } from '../ShopModal';
import fontTheme from '../../../../styles/base';
import Coinicon from '../../../../assets/icons/coinicon.svg';
import PremiumCoin from '../../../../assets/icons/premiumCoins.svg'
import { useUser } from '../../../../hooks';
import { NOT_ENOUGHT_COINS, NOT_ENOUGHT_PREMIUM_COINS } from '../../../../utils/constants/mouseOverConstants';
import { BiSolidCheckCircle } from 'react-icons/bi';
import { IoMdCloseCircle } from 'react-icons/io';
import MediaQueriesEnum from '../../../../utils/enums/mediaQueries';

type ShopItemDetailedTypes = {
	isOpen: boolean;
	onClose: VoidFunction;
	shopItemInfo: ShopItemInfoType | undefined;
	onClick: (usePremium: boolean) => void;
}


export const ShopItemDetailed = ({ isOpen, onClose, shopItemInfo, onClick }: ShopItemDetailedTypes) => {
	const { userData } = useUser();
	const [startY, setStartY] = useState<number | null>(null);
	const [translateY, setTranslateY] = useState(0);
	const [closing, setClosing] = useState(false);
	const IS_USER_HAS_ENOUGHT_COINS = userData.coins >= Number(shopItemInfo?.price);
	const HAS_PREMIUM = shopItemInfo?.premiumPrice;
	const IS_USER_HAS_ENOUGHT_PREMIUM = userData.premiumCoins >= Number(shopItemInfo?.premiumPrice);
	const IS_ITEM_CERTIFICATE = (shopItemInfo &&
		shopItemInfo.isBlocked !== undefined &&
		shopItemInfo.isEnoughVideo !== undefined &&
		shopItemInfo.isEnoughQuestion !== undefined &&
		shopItemInfo.isEnoughFinalQuiz !== undefined &&
		shopItemInfo.trail !== undefined);
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

	const certificateRequirementsLabel = (count: number, singular: string, plural: string): string => {
		return !count ? 'Finalizado!' : `Falta ${count > 1 ? plural : singular}`;
	};

	const RequirementItem = ({ isCompleted, label, requirementText }: { isCompleted: boolean; label: string; requirementText: string }) => (
		<Flex
			fontFamily={fontTheme.fonts}
			color={isCompleted ? colorPalette.correctAnswer : colorPalette.alertText}
			alignItems='center'
		>
			{isCompleted ? <BiSolidCheckCircle size='20px' /> : <IoMdCloseCircle size='20px' />}
			<Text marginLeft='4px'>{requirementText} ({label})</Text>
		</Flex>
	);

	const renderCertificateDescription = () => {
		if (shopItemInfo) {
			const videoLabel = certificateRequirementsLabel(
				shopItemInfo.isEnoughVideo ?? 0,
				'assistir 1 vídeo',
				`assistir ${shopItemInfo.isEnoughVideo ?? 0} vídeos`
			);
			const questionLabel = certificateRequirementsLabel(
				shopItemInfo.isEnoughQuestion ?? 0,
				'acertar 1 questão',
				`acertar ${shopItemInfo.isEnoughQuestion ?? 0} questões`
			);
			const finalQuizLabel = certificateRequirementsLabel(
				shopItemInfo.isEnoughFinalQuiz ?? 0,
				'acertar 1 questão',
				`acertar ${shopItemInfo.isEnoughFinalQuiz ?? 0} questões`
			);

			return (
				<>
					<Text fontFamily={fontTheme.fonts} fontWeight="bold" mt="16px">
						Requisitos para a compra, na Trilha do {shopItemInfo.trail}:
					</Text>
					<RequirementItem
						isCompleted={!shopItemInfo.isEnoughVideo}
						label={videoLabel}
						requirementText="Assistir 80% dos vídeos"
					/>
					<RequirementItem
						isCompleted={!shopItemInfo.isEnoughQuestion}
						label={questionLabel}
						requirementText="Acertar 80% dos desafios"
					/>
					<RequirementItem
						isCompleted={!shopItemInfo.isEnoughFinalQuiz}
						label={finalQuizLabel}
						requirementText="Acertar 80% do desafio final"
					/>
				</>
			);
		}
	}

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
					paddingLeft={{ base: '16px', md: '24px' }}
					paddingRight={{ base: '16px', md: '24px' }}
					paddingTop={{ base: '8px', md: '24px' }}
					flexDir='column'
					top={{ base: '0', md: '32px' }}
					position={{ base: 'relative', md: 'absolute' }}
					w={{ base: '100&', md: '95%' }}
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
					>
						<Box overflowY='auto' width={{ base: '100%', md: '75%' }}>
							<Text
								fontSize={{ base: '16px', md: '18px' }}
								maxHeight={{ base: 'none', md: 'auto' }}
								fontWeight='regular'
								textAlign='left'
								maxH='260px'
							>
								{shopItemInfo && shopItemInfo.description}
							</Text>
							{IS_ITEM_CERTIFICATE &&
								renderCertificateDescription()}
						</Box>

						<Flex
							width={{ base: '100%', md: 'auto' }}
							flexDir='column'
							marginTop='16px'
						>
							<Flex>
								<Text
									fontFamily={fontTheme.fonts}
									fontSize={{ base: '18px', md: '24px' }}
									fontWeight='semibold'
									color={colorPalette.secundaryGrey}
								>
									Seu Saldo:
								</Text>
								<Flex
									alignItems="center"
								>
									<Text ml='4px' fontFamily={fontTheme.fonts}
										fontSize={{ base: '18px', md: '24px' }}
										fontWeight='semibold'
										color={colorPalette.secundaryGrey}>
										{userData.coins}
									</Text>
									<Image
										w="28px"
										ml="1px"
										src={Coinicon}
										alt="icone de Joias"
									/>
								</Flex>
								<Flex
									alignItems="center"
								>
									<Text ml='4px' fontFamily={fontTheme.fonts}
										fontSize={{ base: '18px', md: '24px' }}
										fontWeight='semibold'
										color={colorPalette.secundaryGrey}>
										{userData.premiumCoins}
									</Text>
									<Image
										w="20px"
										ml="1px"
										src={PremiumCoin}
										alt="icone de Essências"
									/>
								</Flex>
							</Flex>

							<Tooltip
								label={
									IS_USER_HAS_ENOUGHT_COINS
										? ''
										: NOT_ENOUGHT_COINS
								}
								placement='bottom'
								hasArrow
								isDisabled={IS_USER_HAS_ENOUGHT_COINS || !isDesktop}
								closeOnClick={false}
							>
								<Button
									mt='8px'
									w='100%'
									height='3.5rem'
									background={
										IS_USER_HAS_ENOUGHT_COINS
											? colorPalette.primaryColor
											: colorPalette.grayBackground
									}
									color={colorPalette.buttonTextColor}
									fontSize='20px'
									borderRadius='8px'
									_hover={{
										opacity: 0.7,
									}}
									onClick={
										IS_USER_HAS_ENOUGHT_COINS
											? () => onClick(false)
											: undefined
									}
									cursor={'pointer'}
									marginBottom={HAS_PREMIUM ? { base: '8px', md: '8px' } : { base: '24px', md: '0' }}
								>
									{`Comprar com ${shopItemInfo?.price}`}
									<Image
										w="28px"
										ml="4px"
										src={Coinicon}
										alt="icone de Joias"
									/>
								</Button>
							</Tooltip>

							{
								HAS_PREMIUM ? (
									<Tooltip
										label={
											IS_USER_HAS_ENOUGHT_PREMIUM
												? ''
												: NOT_ENOUGHT_PREMIUM_COINS
										}
										placement='bottom'
										hasArrow
										isDisabled={IS_USER_HAS_ENOUGHT_PREMIUM || !isDesktop}
										closeOnClick={false}
									>
										<Button
											w='100%'
											height='3.5rem'
											background={
												IS_USER_HAS_ENOUGHT_PREMIUM
													? colorPalette.correctAnswer
													: colorPalette.grayBackground
											}
											color={colorPalette.buttonTextColor}
											fontSize='20px'
											borderRadius='8px'
											_hover={{
												opacity: 0.7,
											}}
											onClick={
												IS_USER_HAS_ENOUGHT_PREMIUM
													? () => onClick(true)
													: undefined
											}
											cursor={'pointer'}
											marginBottom={{ base: '24px', md: '0' }}
										>
											{`Comprar com ${shopItemInfo?.premiumPrice}`}
											<Image
												w="20px"
												ml="4px"
												src={PremiumCoin}
												alt="icone de Essências"
											/>
										</Button>
									</Tooltip>
								) : null
							}
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Slide>
	);
}