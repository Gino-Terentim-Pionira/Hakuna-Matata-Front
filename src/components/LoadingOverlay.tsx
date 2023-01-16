import { Box } from '@chakra-ui/react';
import React from 'react';
import colorPalette from '../styles/colorPalette';
import LoadingState from './LoadingState';

const LoadingOverlay = () => {
    return (
        <Box 
            position='fixed' 
            zIndex='10'
            top='0' 
            left='0' 
            right='0' 
            bottom='0' 
            backgroundColor={colorPalette.primaryColor}>
                <LoadingState />
        </Box>
    )
}

export default LoadingOverlay;