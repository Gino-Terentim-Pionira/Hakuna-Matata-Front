import React from 'react';
import { Box, Text } from '@chakra-ui/react';

// Styles
import font from '../styles/base';
import colorPalette from '../styles/colorPalette';


const IgnoranceProgress = ({ ignorance }: {
    ignorance: number
}) => {
    return (
        <Box
            height='32px'
            width='250px'
            backgroundColor={colorPalette.grayBackground}
            borderWidth='3px'
            borderColor={colorPalette.blackBorder}
            borderRadius='100'
            overflow='hidden'
            boxShadow='0px 4px 5px rgba(0, 0, 0, 0.14)'
        >
            <Box
                position='relative'
                width={`${ignorance}%`}
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
                    fontSize='16px'>
                    Nível de sabedoria
                </Text>
            </Box>
        </Box>
    );
}

export default IgnoranceProgress;