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
import { IPremiumTier } from '../../../recoil/premiumRecoil';
import { PremiumItem } from './components/PremiumItem';
import { PremiumItemDetailed } from './components/PremiumItemDetailed';

type PremiumModalType = {
    isOpen: boolean;
    onClose: VoidFunction;
    premiumTiers?: IPremiumTier[];
    isLoading?: boolean
}

export const PremiumModal = ({ isOpen, onClose, premiumTiers, isLoading }: PremiumModalType) => {

    const [premiumItemInfo, setPremiumItemInfo] = useState<IPremiumTier | undefined>();

    const handlePremiumInfo = (item: IPremiumTier) => {
        setPremiumItemInfo(item);
    }

    const closePremiumInfo = () => {
        setPremiumItemInfo(undefined);
    }

    const renderContent = () => (
        <>
            <SimpleGrid columnGap={{ base: "16px", md: "48px" }} mt="32px" mb="16px" minChildWidth="130px" spacingX="48px" spacingY="28px" height="432px" justifyItems="center">
                {
                    premiumTiers?.map(item => (
                        <PremiumItem
                            isSubscribed={item.isUserSubscribed}
                            title={item.name}
                            description={item.description}
                            premiumValue={item.premiumValue}
                            onClick={() => handlePremiumInfo(item)}
                        />
                    ))
                }
                <Flex w="130px" h="1px" />
                <Flex w="130px" h="1px" />
                <Flex w="130px" h="1px" />
            </SimpleGrid>
        </>
    )


    return (
        <>
            <Modal
                isCentered
                isOpen={isOpen && !premiumItemInfo}
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
                        borderBottom={`2px solid ${colorPalette.primaryColor}`}
                    >
                        <Text
                            width='fit-content'
                            margin={{ base: '0', md: 'auto' }}
                            fontSize='40px'
                            color={colorPalette.textColor}
                            fontWeight='semibold'
                        >
                            Contribua com Nosso Propósito!
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
            </Modal>
            <PremiumItemDetailed
                isOpen={!!premiumItemInfo}
                title={premiumItemInfo?.name}
                detail={premiumItemInfo?.details}
                isSubscribed={premiumItemInfo?.isUserSubscribed}
                checkoutId={premiumItemInfo?.checkoutId}
                onClose={closePremiumInfo}
            />
        </>
    );
}