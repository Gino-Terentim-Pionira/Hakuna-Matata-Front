import { Text, Center } from '@chakra-ui/react';
import React from 'react';
import colorPalette from '../styles/colorPalette';
import { MdOutlinePhoneIphone } from "react-icons/md";


const CantUseApplication = () => {
    return (
        <Center flexDir="column" w='100%' h='100vh' bg={colorPalette.primaryColor} textAlign='center' position='absolute' zIndex="100000000">
            <Text w='90%' fontSize='1.5rem' fontWeight='bold' marginBottom="32px">
                Jovem viajante, a jornada pela Pionira é vasta e rica, mas para explora-lá, você precisará usar seu celular na vertical, igual a imagem abaixo!
            </Text>

            <MdOutlinePhoneIphone size="120px" color={colorPalette.secondaryColor} />
        </Center>
    )
}

export default CantUseApplication;