import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
    SimpleGrid, Flex
} from '@chakra-ui/react';
import colorPalette from '../../../styles/colorPalette';
import fontTheme from '../../../styles/base';
import LoadingState from '../../LoadingState';
import { InventoryItem } from './components/InventoryItem';
import { ShopQuickFilter } from '../ShopModal/components/ShopQuickFilter';
import { InventoryItemDetailed } from './components/InventoryItemDetailed';

type InventoryModalType = {
    isOpen: boolean;
    onClose: VoidFunction;
    shopItems?: OwnedItemInfoType[];
    certificates?: OwnedItemInfoType[];
    isLoading?: boolean
}

export type OwnedItemInfoType = {
    title: string;
    description: string;
    price?: string;
    type: string;
    image: string;
    hash?: string;
    itemType: 'certificate' | 'normal';
    id: string;
    id_link?: string
}

export const InventoryModal = ({ isOpen, onClose, shopItems, certificates, isLoading }: InventoryModalType) => {
    const ALL_ITEMS_AVAILABLE = certificates?.length || shopItems?.length;
    const [shopItemInfo, setShopItemInfo] = useState<OwnedItemInfoType | undefined>();
    const [quickFilterSelected, setQuickFilterSelected] = useState<'all' | 'certificate' | 'normal'>('all');
    const handleShopItemInfo = (item: OwnedItemInfoType) => {
        setShopItemInfo({
            title: item.title,
            description: item.description,
            price: item.price,
            type: item.type,
            image: item.image,
            itemType: item.itemType,
            hash: item.hash,
            id: item.id,
            id_link: item.id_link
        })
    };

    const dowloadItem = (item: OwnedItemInfoType) => {
        const downloadType = {
            'normal': {
                download: () => downloadOwnedItem(shopItemInfo?.id_link as string)
            },
            'certificate': {
                download: () => {
                    window.open(`/certificate/${shopItemInfo?.hash}`, '_blank');
                }
            }
        }

        downloadType[item.itemType].download();
    }

    const downloadOwnedItem = (id_link: string) => {
        window.open(`https://drive.google.com/file/d/${id_link}/view`);
    }

    const closeShopItemInfo = () => {
        setShopItemInfo(undefined)
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
            <Flex alignItems="center" gap="16px" maxW="100%" overflowX="auto" overflowY="hidden">
                <ShopQuickFilter isSelected={handleQuickFilters['all'].isSelected} label="Todos" onClick={handleQuickFilters['all'].onClick} color={colorPalette.secondaryColor} />
                <ShopQuickFilter isSelected={handleQuickFilters['certificate'].isSelected} label="Certificados" onClick={handleQuickFilters['certificate'].onClick} color={colorPalette.secondaryColor} />
                <ShopQuickFilter isSelected={handleQuickFilters['normal'].isSelected} label="Materiais de estudo" onClick={handleQuickFilters['normal'].onClick} color={colorPalette.secondaryColor} />
            </Flex>
            {
                !ALL_ITEMS_AVAILABLE && <Text fontSize="18px" color={colorPalette.textColor} w="100%" margin="auto" textAlign="center" marginTop='8px'>Você não possui nenhum item. Acesse a loja para comprar um!</Text>
            }
            <SimpleGrid columnGap={{base: "16px", md: "48px"}} mt="32px" mb="16px" minChildWidth="130px" spacingX="48px" spacingY="28px" height="432px">
                {
                    ((quickFilterSelected === "certificate" || quickFilterSelected === "all") && certificates && certificates.length > 0) && certificates.map((item) =>
                        <InventoryItem
                            key={item.title}
                            onClick={() => handleShopItemInfo(item)}
                            image={item.image}
                            title={item.title}
                            type={item.type}
                        />
                    )
                }

                {
                    ((quickFilterSelected === "normal" || quickFilterSelected === "all") && shopItems && shopItems.length > 0) && shopItems.map((item) =>
                        <InventoryItem
                            key={item.title}
                            onClick={() => handleShopItemInfo(item)}
                            image={item.image}
                            title={item.title}
                            type={item.type}
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
		<Modal
			isCentered
			isOpen={isOpen}
			onClose={onClose}
			size='4xl'
			scrollBehavior='inside'
		>
			<ModalOverlay />
			<ModalContent
				background={colorPalette.oracleWhite}
				paddingX={{ base: '14px', md: '48px' }}
				minHeight='60vh'
				height={{ base: '100%', md: 'auto' }}
				maxH={{ base: 'none', md: 'auto' }}
				fontFamily={fontTheme.fonts}
			>
				<ModalHeader
					display='flex'
					justifyContent={{ base: 'flex-start', md: 'auto' }}
					paddingLeft={{ base: '0', md: 'auto' }}
					paddingBottom={{ base: '12px', md: 'auto' }}
					width='100%'
					borderBottom={`2px solid ${colorPalette.secondaryColor}`}
				>
					<Text
						width='fit-content'
						margin={{ base: '0', md: 'auto' }}
						fontSize='40px'
						color={colorPalette.textColor}
						fontWeight='semibold'
					>
						Inventário
					</Text>
					<ModalCloseButton
						color={colorPalette.closeButton}
						size={'48px'}
						mr='8px'
						mt={{ base: "24px", md: '8px' }}
					/>
				</ModalHeader>

				<ModalBody
					width='100%'
                    paddingX={{ base: '0', md: 'auto' }}
					sx={{
						'&::-webkit-scrollbar': {
							width: '4px',
							height: '4px',
							borderRadius: '8px',
						},
						'&::-webkit-scrollbar-thumb': {
							background: '#9D9D9D',
							borderRadius: '10px',
						},
						'&::-webkit-scrollbar-thumb:hover': {
							background: '#555',
						},
						'&::-moz-scrollbar': {
							width: '4px',
							height: '4px',
							borderRadius: '8px',
						},
						'&::-moz-scrollbar-thumb': {
							background: '#9D9D9D',
							borderRadius: '10px',
						},
						'&::-moz-scrollbar-thumb:hover': {
							background: '#555',
						},
					}}
				>
					{isLoading ? <LoadingState /> : renderContent()}
				</ModalBody>
			</ModalContent>
			<InventoryItemDetailed
				onClick={() => dowloadItem(shopItemInfo as OwnedItemInfoType)}
				shopItemInfo={shopItemInfo}
				isOpen={!!shopItemInfo}
				onClose={closeShopItemInfo}
			/>
		</Modal>
	);
};
