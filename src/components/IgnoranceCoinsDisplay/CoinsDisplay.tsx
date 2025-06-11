import React, { FC } from 'react';
import { Flex, Text, Image, Tooltip, useMediaQuery } from '@chakra-ui/react';
import fontTheme from '../../styles/base';
import Coins from '../../assets/icons/coinicon.svg';
import PremiumCoins from '../../assets/icons/premiumCoins.svg';
import { COINS, PREMIUMCOINS } from '../../utils/constants/mouseOverConstants';
import { PositionProps } from '../../utils/props';
import colorPalette from '../../styles/colorPalette';
import MediaQueriesEnum from '../../utils/enums/mediaQueries';

type CoinsDisplayProps = {
    coins: number;
    premiumCoins: number;
    position: PositionProps;
}

const CoinsDisplay: FC<CoinsDisplayProps> = ({
    coins,
    premiumCoins,
    position
}) => {
    const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

    return (
        <Flex>
            <Tooltip
                isDisabled={!isDesktop}
                hasArrow
                placement={position}
                label={COINS}
            >
                <Flex mt="4px" alignItems="center" w='fit-content'>
                    <Text
                        fontFamily={fontTheme.fonts}
                        fontSize="28px" fontWeight="500"
                        color={colorPalette.textColor}
                    >
                        {coins}
                    </Text>
                    <Image
                        ml="4px"
                        w="50px"
                        src={Coins}
                        alt="icone de Joias"
                    />
                </Flex>
            </Tooltip>

            <Tooltip
                isDisabled={!isDesktop}
                hasArrow
                placement={position}
                label={PREMIUMCOINS}
            >
                <Flex mt="4px" ml="4px" alignItems="center" w='fit-content'>
                    <Text
                        fontFamily={fontTheme.fonts}
                        fontSize="28px" fontWeight="500"
                        color={colorPalette.textColor}
                    >
                        {premiumCoins}
                    </Text>
                    <Image
                        ml="4px"
                        w="30px"
                        src={PremiumCoins}
                        alt="icone de Essências"
                    />
                </Flex>
            </Tooltip>
        </Flex>
    )
}

export default CoinsDisplay;
