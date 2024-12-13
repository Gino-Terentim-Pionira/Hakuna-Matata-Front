import React from 'react';
import { Image, Box } from '@chakra-ui/react';
import colorPalette from '../styles/colorPalette';

const StampIcon = ({
    stampImage,
    size
}: {
    stampImage: string
    size?: string
}) => {

    return (
        <Box
            backgroundColor={colorPalette.backgroundColor}
            borderRadius='100px'
        >
            <Image
                width={size || '78px'}
                height={size || '78px'}
                src={stampImage}
            />
        </Box>
    )
}

export default StampIcon;
