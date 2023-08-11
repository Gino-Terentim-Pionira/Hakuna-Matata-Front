import React, { FC } from 'react';
import { Flex, Text, Image, Tooltip } from '@chakra-ui/react';
import fontTheme from '../styles/base';
import Coins from '../assets/icons/coinicon.svg';
import { COINS } from '../utils/constants/constants';

type CoinsDisplayProps = {
    value: number;
    position: 'top' | 'bottom';
}

const CoinsDisplay: FC<CoinsDisplayProps> = ({
    value,
    position
}) => {
    return (
        <Tooltip
            hasArrow
            placement={position}
            label={COINS}
        >
            <Flex mt="8px" alignItems="center" w='fit-content'>
                <Text 
                    fontFamily={fontTheme.fonts} 
                    fontSize="28px" fontWeight="500" 
                    color="#000"
                >{value}
                </Text>
                <Image 
                    ml="4px" 
                    w="50px" 
                    src={Coins} 
                    alt="icone de moeda" 
                />
            </Flex>
        </Tooltip>
    )
}

export default CoinsDisplay;
