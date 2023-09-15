import React from 'react';
import { Box, Text, Tooltip } from '@chakra-ui/react';

// Styles
import font from '../../styles/base';
import colorPalette from '../../styles/colorPalette';
import { WISDOM } from '../../utils/constants/constants';
import { PositionProps } from '../../utils/props';
import useIgnoranceFilter from '../../hooks/useIgnoranceFilter';


const IgnoranceProgress = ({ ignorance, position, ignoranceFilter }: {
    ignorance: number,
    position: PositionProps,
    ignoranceFilter: boolean
}) => {
    const progressBar = Math.floor(100 - ignorance);
    const {isIgnoranceFilterOn} = useIgnoranceFilter();
    return (
        <Tooltip
            hasArrow
            placement={position}
            label={WISDOM}
        >
            <Box
                position='relative'
                height='32px'
                width='392px'
                backgroundColor={colorPalette.darkGrey}
                borderWidth='3px'
                borderColor={colorPalette.blackBorder}
                borderRadius='100'
                overflow='hidden'
                boxShadow='0px 4px 5px rgba(0, 0, 0, 0.14)'
            >
                <Box
                    position='relative'
                    width={`${progressBar}%`}
                    height='100%'
                    backgroundColor={colorPalette.progressOrange}
                >
                    <Text
                        position='absolute'
                        marginLeft='17px'
                        whiteSpace='nowrap'
                        top='5%'
                        color={colorPalette.blackBorder}
                        fontFamily={font.fonts}
                        fontWeight='bold'
                        fontSize='16px'
                    >
                        Nível de sabedoria
                    </Text>
                    {
                        ignoranceFilter && <Text
                        position='absolute'
                        top='5%'
                        left='340px'
                        fontFamily={font.fonts}
                        color={colorPalette.whiteText}
                        fontWeight='bold'
                        fontSize='16px'
                        >
                            {progressBar + '%'}
                        </Text>
                    }
                </Box>
                {isIgnoranceFilterOn && <Text
                    position="absolute"
                    top="5%"
                    right="16px"
                    color={colorPalette.backgroundColor}
                    fontFamily={font.fonts}
                    fontWeight='bold'
                    fontSize='16px'
                >
                    {progressBar}%
                </Text>}
            </Box>
        </Tooltip>
    );
}

export default IgnoranceProgress;