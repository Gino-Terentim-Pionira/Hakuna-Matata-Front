import React from 'react';
import { Box, Text, Tooltip } from '@chakra-ui/react';
import { STATUS } from '../../utils/constants/mouseOverConstants';
import { PositionProps } from '../../utils/props';

// Styles
import font from '../../styles/base';
import colorPalette from '../../styles/colorPalette';


const StatusProgress = ({ status, position, labelText, color, ignoranceFilter }: {
    status: number,
    position: PositionProps,
    labelText: string,
    color: string,
    ignoranceFilter: boolean
}) => {
    return (
        <Tooltip
            hasArrow
            placement={position}
            label={STATUS}
        >
            <Box
                height='28px'
                width='261px'
                marginTop='8px'
                backgroundColor={colorPalette.darkGrey}
                borderWidth='3px'
                borderColor={colorPalette.blackBorder}
                borderRadius='8px'
                overflow='hidden'
                position='relative'
                boxShadow='0px 4px 5px rgba(0, 0, 0, 0.14)'
            >
                <Box
                    position='relative'
                    width={`${status}%`}
                    height='100%'
                    backgroundColor={color}
                >
                    <Text
                        position='absolute'
                        marginLeft='17px'
                        whiteSpace='nowrap'
                        top='5%'
                        color={colorPalette.whiteText}
                        fontFamily={font.fonts}
                        fontWeight='bold'
                        fontSize='14px'
                    >
                        {labelText}
                    </Text>
                </Box>
                {
                        ignoranceFilter && <Text
                        position='absolute'
                        top='5%'
                        right='16px'
                        fontFamily={font.fonts}
                        color={colorPalette.whiteText}
                        fontWeight='bold'
                        fontSize='14px'
                        >
                            {`${Math.floor(status)}%`}
                        </Text>
                    }
            </Box>
        </Tooltip>
    );
}

export default StatusProgress;