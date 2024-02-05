import { Flex, Image, Tooltip } from '@chakra-ui/react';
import { RELIC_DESCRIPTION } from '../../../../utils/constants/mouseOverConstants';
import colorPalette from '../../../../styles/colorPalette';
import React from 'react';
import rarityEnum from '../../../../utils/enums/rarity';

type RelicComponentType = {
    relicImage: string;
    width?: string;
    height?: string;
    color?: rarityEnum | 'default';
    onClick?: VoidFunction
    badgeDescription?: string;
    isCursorActive?: boolean;
}

export const Relic = ({ relicImage, color = 'default', width, height, onClick, badgeDescription, isCursorActive }: RelicComponentType) => {

    const relicColor = {
        'Normal': 'radial-gradient(50% 50% at 50% 50%, #CFDFFF 0%, #719DF6 100%)',
        'Lendário': 'radial-gradient(50% 50% at 50% 50%, #EBD8F8 0%, #A344E8 100%)',
        'Místico':  'radial-gradient(50% 50% at 50% 50%, #F4E9D1 0%, #F0C05D 100%)',
        'default': '#D9D9D9',
    }[color]

    return (
        <Tooltip
            hasArrow
            placement="bottom"
            gutter={10}
            label={badgeDescription ? badgeDescription : RELIC_DESCRIPTION }
        >
            <Flex
                width={width || '106px'}
                height={height || '106px'}
                borderRadius="8px"
                justifyContent="center"
                alignItems="center"
                border={`2px solid ${colorPalette.textColor}`}
                bg={relicColor}
                padding="2px"
                onClick={onClick}
                cursor={isCursorActive ? 'pointer' : undefined}
            >
                <Image src={relicImage} alt="Imagem da relíquia" />
            </Flex>
        </Tooltip>
    );
};