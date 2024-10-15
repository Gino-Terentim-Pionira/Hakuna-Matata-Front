import React from 'react';
import { Box, Button, Flex, Image, Slide, Text, Tooltip } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import { ShopItemInfoType } from '../ShopModal';
import fontTheme from '../../../../styles/base';
import Coinicon from '../../../../assets/icons/coinicon.svg';
import { useUser } from '../../../../hooks';
import { NOT_ENOUGHT_COINS } from '../../../../utils/constants/mouseOverConstants';
import { BiSolidCheckCircle } from 'react-icons/bi';
import { IoMdCloseCircle } from 'react-icons/io';

type ShopItemDetailedTypes = {
	isOpen: boolean;
	onClose: VoidFunction;
	shopItemInfo: ShopItemInfoType | undefined;
	onClick: VoidFunction;
}


export const ShopItemDetailed = ({ isOpen, onClose, shopItemInfo, onClick }: ShopItemDetailedTypes) => {
	const { userData } = useUser();
	const IS_USE_HAS_ENOUGHT_COINS = userData.coins >= Number(shopItemInfo?.price);
	const IS_ITEM_CERTIFICATE = (shopItemInfo &&
		shopItemInfo.isBlocked !== undefined &&
		shopItemInfo.isEnoughVideo !== undefined &&
		shopItemInfo.isEnoughQuestion !== undefined &&
		shopItemInfo.isEnoughFinalQuiz !== undefined &&
		shopItemInfo.trail !== undefined);

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
					<Text fontFamily={fontTheme.fonts} fontWeight="bold">
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
						<Box>
							<Text
								fontSize={['0.5rem', '1rem', '1.2rem']}
								fontWeight='regular'
								textAlign='left'
								overflowY="auto"
								maxH="260px"
								paddingBottom="16px"
							>
								{shopItemInfo && shopItemInfo.description}
							</Text>
							{
								IS_ITEM_CERTIFICATE && renderCertificateDescription()
							}
						</Box>


						<Flex flexDir="column" marginTop="1px">
							<Flex>
								<Text
									fontFamily={fontTheme.fonts}
									fontSize="24px"
									fontWeight="semibold"
									color={colorPalette.secundaryGrey}
								>
									Suas joias: {userData.coins}
								</Text>
								<Image
									w='28px'
									src={Coinicon}
									alt='coinicon'
									ml='4px'
								/>
							</Flex>
							<Flex marginBottom="16px">
								<Text
									fontFamily={fontTheme.fonts}
									fontSize='28px'
									fontWeight='semibold'
									color={colorPalette.closeButton}
								>
									Valor: {shopItemInfo && shopItemInfo.price}
								</Text>
								<Image
									w='32px'
									src={Coinicon}
									alt='coinicon'
									ml='4px'
								/>
							</Flex>

							<Tooltip
								label={IS_USE_HAS_ENOUGHT_COINS ? '' : NOT_ENOUGHT_COINS}
								placement='bottom'
								hasArrow
								isDisabled={IS_USE_HAS_ENOUGHT_COINS}
								closeOnClick={false}
							>
								<Button
									w="200px"
									height='3.5rem'
									background={IS_USE_HAS_ENOUGHT_COINS ? colorPalette.primaryColor : colorPalette.grayBackground}
									color={colorPalette.buttonTextColor}
									fontSize='1.5rem'
									borderRadius='8px'
									_hover={{
										opacity: 0.7
									}}
									onClick={IS_USE_HAS_ENOUGHT_COINS ? onClick : undefined}
									cursor={'pointer'}
								>
									Comprar
								</Button>
							</Tooltip>
						</Flex>
					</Flex>
				</Flex>

			</Flex>
		</Slide>
	)
}