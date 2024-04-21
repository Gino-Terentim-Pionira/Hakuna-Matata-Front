import { Text, Center } from '@chakra-ui/react';
import React from 'react';
import colorPalette from '../styles/colorPalette';

const CantUseApplication = () => {
    return (
        <Center w='100%' h='100vh' bg={colorPalette.primaryColor} textAlign='center' position='absolute' zIndex="100000000">
            <Text w='90%' fontSize='1.5rem' fontWeight='bold'>
                A resolução da sua tela está muito pequena para utilizar a aplicação, utilize uma resolução maior!
            </Text>
        </Center>
    )
}

export default CantUseApplication;