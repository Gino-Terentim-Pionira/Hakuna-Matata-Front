import { Text, Center } from '@chakra-ui/react';
import React from 'react';
import colorPalette from '../styles/colorPalette';

const CantUseApplication = () => {
    return (
        <Center w='100%' h='100vh' bg={colorPalette.primaryColor} textAlign='center' position='absolute' zIndex="100000000">
            <Text w='90%' fontSize='1.5rem' fontWeight='bold'>
                Jovem viajante, a jornada pela Pionira é vasta e rica, mas para explorar todos os seus caminhos, você precisará de um computador. Prepare-se e volte com uma tela maior para continuar a aventura!
            </Text>
        </Center>
    )
}

export default CantUseApplication;