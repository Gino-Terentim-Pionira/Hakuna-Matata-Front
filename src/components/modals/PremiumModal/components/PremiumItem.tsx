import { Center, Flex, Image, Text } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import React from 'react';
import premium from '../../../../assets/icons/icon_membership.svg';
import fontTheme from '../../../../styles/base';
import { BiBadgeCheck } from "react-icons/bi";
import premiumCoin from '../../../../assets/icons/premiumCoins.svg';

type PremiumItemTypes = {
    isSubscribed: boolean;
    title: string;
    description: string;
    premiumValue: number;
    onClick: VoidFunction;
}

export const PremiumItem = ({ isSubscribed, title, description, premiumValue, onClick }: PremiumItemTypes) => (
    <Flex _hover={{ cursor: 'pointer' }} w="148px" h="fit-content" flexDir="column" onClick={onClick} >
        <Center padding="16px" borderRadius="8px" h="162px" border={`2px solid ${colorPalette.primaryColor}`} background={colorPalette.whiteText}>
            {
                isSubscribed ? (
                    <Flex
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'
                    >
                        <BiBadgeCheck
                            size={72}
                            color={colorPalette.correctAnswer}
                        />
                        <Text
                            mt='4px'
                            fontSize='18px'
                            fontWeight='bold'
                            fontFamily={fontTheme.fonts}
                            color={colorPalette.correctAnswer}
                        >Assinado!</Text>
                    </Flex>
                ) : (
                        <Image
                            src={premium}
                            alt={title}
                            w="116px"
                            h="126px"
                        />
                    )
            }
        </Center>

        <Text mt="8px" fontSize="16px" fontFamily={fontTheme.fonts} fontWeight="medium" color={colorPalette.textColor}>
            {title}
        </Text>
        <Text fontSize="12px" fontFamily={fontTheme.fonts} color={colorPalette.infoTextColor}>
            {description}
        </Text>
        <Flex>
            <Text
                fontFamily={fontTheme.fonts}
                fontSize="12px"
                color={colorPalette.infoTextColor}
                fontWeight='semibold'
            >Recompensa Mensal: {premiumValue}</Text>
            <Image
                w="12px"
                ml="4px"
                src={premiumCoin}
                alt="icone de Essências"
            />
        </Flex>
    </Flex>
);
