import React, { ReactElement, useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Text,
	SimpleGrid, Flex, Button,
} from '@chakra-ui/react';
import colorPalette from '../../../styles/colorPalette';
import fontTheme from '../../../styles/base';
import { ShopItem } from './components/ShopItem';
import { ShopItemDetailed } from './components/ShopItemDetailed';
import AlertModal from '../AlertModal';
import { OracleServices } from '../../../services/OracleServices';
import { useUser } from '../../../hooks';
import shopService from "../../../services/ShopService";
import { CertificateService } from "../../../services/CertificateService";
import useShopItems from "../../../hooks/useShopItems";
import { ItemType } from "../../../recoil/shopItemsRecoil";
import { CERTIFICATE, ESPECIAL, NORMAL, ORACLE } from "../../../utils/constants/textConstants";
import { ShopQuickFilter } from "./components/ShopQuickFilter";
import LoadingState from '../../LoadingState';
import trailEnum from '../../../utils/enums/trail';
import { useOwnedItems } from '../../../hooks/useOwnedItems';

type ShopModalType = {
	isOpen: boolean;
	onClose: VoidFunction;
	shopItems?: ShopItemInfoType[];
	certificates?: ShopItemInfoType[];
	oraclePackages?: ShopItemInfoType[]
	showQuickFilters?: boolean;
	isLoading?: boolean
}

export type ShopItemInfoType = {
	title: string;
	description: string;
	price: string;
	messages?: string;
	type: string;
	image: string;
	itemType: 'certificate' | 'oracle' | 'normal';
	id: string;
	isBlocked?: boolean;
	isEnoughVideo?: number;
	isEnoughQuestion?: number;
	isEnoughFinalQuiz?: number;
	trail?: trailEnum;
}

type AlertModalInfoType = {
	isOpen: boolean,
	alertBody?: string,
	alertTitle?: string,
	buttonBody?: ReactElement,
}

export const ShopModal = ({ isOpen, onClose, shopItems, certificates, oraclePackages, showQuickFilters, isLoading }: ShopModalType) => {
	const ALL_ITEMS_AVAILABLE = certificates?.length || oraclePackages?.length || shopItems?.length;
	const { userData, getNewUserInfo } = useUser();
	const oracleService = new OracleServices();
	const certificateService = new CertificateService();
	const [isAlertLoading, setIsAlertLoading] = useState(false);
	const [shopItemInfo, setShopItemInfo] = useState<ShopItemInfoType | undefined>();
	const [alertModalInfo, setAlertModalInfo] = useState<AlertModalInfoType>({
		isOpen: false,
		alertBody: '',
		alertTitle: '',
	});
	const [quickFilterSelected, setQuickFilterSelected] = useState<'all' | 'certificate' | 'oracle' | 'normal'>('all');
	const { getNewShopItems, getNewCertificateItems } = useShopItems();
	const { getNewOwnedItems, getNewOwnedCertificateItems } = useOwnedItems();
	const handleShopItemInfo = (item: ShopItemInfoType) => {
		setShopItemInfo({
			title: item.title,
			description: item.description,
			price: item.price,
			type: item.type,
			image: item.image,
			id: item.id,
			itemType: item.itemType,
			isBlocked: item.isBlocked,
			isEnoughVideo: item.isEnoughVideo,
			isEnoughQuestion: item.isEnoughQuestion,
			isEnoughFinalQuiz: item.isEnoughFinalQuiz,
			trail: item.trail
		})
	}

	const closeShopItemInfo = () => {
		setShopItemInfo(undefined)
	}

	const openAlertModalInfo = () => {
		setAlertModalInfo({
			isOpen: true,
			alertBody: 'Certeza que deseja comprar esse pacotes de perguntas?',
			alertTitle: shopItemInfo?.title,
			buttonBody: undefined
		})
	}

	const closeAlertModal = () => {
		setAlertModalInfo({
			isOpen: false,
			alertBody: '',
			alertTitle: '',
			buttonBody: undefined
		})
	}

	const successShopMessage = {
		'normal': NORMAL,
		'especial': ESPECIAL,
		'oracle': ORACLE,
		'certificate': CERTIFICATE
	}

	const buyShopItem = async () => {
		try {
			setIsAlertLoading(true);
			await handleBuyFunction(shopItemInfo as ShopItemInfoType);
			closeShopItemInfo();
			setAlertModalInfo({
				alertTitle: 'Compra realizada com sucesso!',
				alertBody: successShopMessage[shopItemInfo?.itemType as ItemType] || 'Acesse seu inventario para usar!',
				buttonBody: <Button
					color='white'
					bg={colorPalette.primaryColor}
					onClick={closeAlertModal}
					ml={3}
				>
					Ok!
				</Button>,
				isOpen: true
			});
			await getNewUserInfo();
		} catch (e) {
			console.log(e)
			setAlertModalInfo({
				alertTitle: 'Error ao comprar perguntas',
				alertBody: `Sua compra não foi processada! ${e?.response?.data?.message || 'Error no servidor'}. Tente novamente mais tarde`,
				buttonBody: <Button
					color='white'
					bg={colorPalette.primaryColor}
					onClick={closeAlertModal}
					ml={3}
				>
					Ok!
				</Button>,
				isOpen: true
			})
		}
		setIsAlertLoading(false);
	}

	const handleBuyFunction = async (item: ShopItemInfoType) => {
		const buyType = {
			'normal': {
				buy: async () => await shopService.buyShopItem(userData._id, item.id),
				reload: async () => {
					await getNewShopItems();
					await getNewOwnedItems();
				}
			},
			'especial': {
				buy: async () => await shopService.buyShopItem(userData._id, item.id),
				reload: async () => await getNewShopItems()
			},
			'oracle': {
				buy: async () => await oracleService.buyOracleMessages(userData._id, item.title),
				reload: () => null
			},
			'certificate': {
				buy: async () => await certificateService.buyCertificate({ userId: userData._id, certificateId: item.id }),
				reload: async () => {
					await getNewCertificateItems();
					await getNewOwnedCertificateItems();
				}
			}
		}

		await buyType[item.itemType].buy();
		await buyType[item.itemType].reload();
	}

	const handleQuickFilters = {
		'all': {
			isSelected: quickFilterSelected === 'all',
			onClick: () => setQuickFilterSelected('all')
		},
		'certificate': {
			isSelected: quickFilterSelected === 'certificate',
			onClick: () => setQuickFilterSelected('certificate')
		},
		'normal': {
			isSelected: quickFilterSelected === 'normal',
			onClick: () => setQuickFilterSelected('normal')
		}
	}

	const renderContent = () => (
		<>
			{
				showQuickFilters && <Flex alignItems="center" gap="16px">
					<ShopQuickFilter isSelected={handleQuickFilters['all'].isSelected} label="Todos" onClick={handleQuickFilters['all'].onClick} color={colorPalette.primaryColor} />
					<ShopQuickFilter isSelected={handleQuickFilters['certificate'].isSelected} label="Certificados" onClick={handleQuickFilters['certificate'].onClick} color={colorPalette.primaryColor} />
					<ShopQuickFilter isSelected={handleQuickFilters['normal'].isSelected} label="Materiais de estudo" onClick={handleQuickFilters['normal'].onClick} color={colorPalette.primaryColor} />
				</Flex>
			}

			{
				!ALL_ITEMS_AVAILABLE && <Text fontSize="18px" color={colorPalette.textColor} w="100%" margin="auto" textAlign="center" marginTop='8px'>Estamos sem items disponiveis no momento, volte novamente mais tarde!</Text>
			}
			<SimpleGrid mt="32px" mb="16px" minChildWidth="130px" spacingX="48px" spacingY="28px"
				height="432px">
				{
					((quickFilterSelected === "certificate" || quickFilterSelected === "all") && certificates && certificates.length > 0) && certificates.map((item) =>
						<ShopItem
							key={item.title}
							onClick={() => handleShopItemInfo(item)}
							image={item.image}
							title={item.title}
							type={item.type}
							value={item.price}
						/>
					)
				}

				{
					((quickFilterSelected === "normal" || quickFilterSelected === "all") && shopItems && shopItems.length > 0) && shopItems.map((item) =>
						<ShopItem
							key={item.title}
							onClick={() => handleShopItemInfo(item)}
							image={item.image}
							title={item.title}
							type={item.type}
							value={item.price}
						/>
					)
				}
				<Flex w="130px" h="1px" />
				<Flex w="130px" h="1px" />
				<Flex w="130px" h="1px" />
			</SimpleGrid>
		</>
	)


	return (
		<Modal isCentered isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
			<ModalOverlay />
			<ModalContent background={colorPalette.oracleWhite} paddingX="48px" minHeight='60vh' fontFamily={fontTheme.fonts}>
				<ModalHeader width="100%" borderBottom={`2px solid ${colorPalette.primaryColor}`}>
					<Text width="fit-content" margin="auto" fontSize="40px" color={colorPalette.textColor}
						fontWeight="semibold">Loja</Text>
					<ModalCloseButton color={colorPalette.closeButton} size="48px" mr="8px" mt="8px" />
				</ModalHeader>

				<ModalBody width="100%"
					sx={{
						"&::-webkit-scrollbar": {
							width: "4px",
							height: "4px",
							borderRadius: "8px"
						},
						"&::-webkit-scrollbar-thumb": {
							background: "#9D9D9D",
							borderRadius: "10px"
						},
						"&::-webkit-scrollbar-thumb:hover": {
							background: "#555",
						},
						"&::-moz-scrollbar": {
							width: "4px",
							height: "4px",
							borderRadius: "8px"
						},
						"&::-moz-scrollbar-thumb": {
							background: "#9D9D9D",
							borderRadius: "10px"
						},
						"&::-moz-scrollbar-thumb:hover": {
							background: "#555",
						},
					}}
				>
					{
						isLoading ? (
							<LoadingState />
						) : (
								renderContent()
							)
					}
				</ModalBody>
			</ModalContent>
			<ShopItemDetailed onClick={openAlertModalInfo} shopItemInfo={shopItemInfo} isOpen={!!shopItemInfo} onClose={closeShopItemInfo} />
			<AlertModal
				isOpen={alertModalInfo.isOpen}
				onClose={closeAlertModal}
				closeOnOverlayClick={false}
				buttonBody={alertModalInfo.buttonBody || <>
					<Button
						onClick={closeAlertModal}
						isDisabled={isAlertLoading}
					>
						Cancel
					</Button>
					<Button
						color='white'
						bg={colorPalette.primaryColor}
						_hover={{ bg: colorPalette.primaryColor }}
						onClick={buyShopItem}
						ml={3}
						isLoading={isAlertLoading}
					>
						Comprar
					</Button>
				</>}
				alertTitle={alertModalInfo.alertTitle}
				alertBody={alertModalInfo.alertBody}
			/>
		</Modal>
	);
};