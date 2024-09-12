import React, { FC, useState } from 'react';
import {
    Flex,
    Box,
    Image,
    Text,
    useDisclosure,
} from '@chakra-ui/react';

// Styles
import fontTheme from '../../styles/base';
import colorPalette from '../../styles/colorPalette';
import {ItemSlider} from "./ItemSlider";

//API
//import api from '../services/api';

type InventoryItemProps = {
    name: string;
    description: string;
    type: string;
    image: string;
    downloadItem: VoidFunction
};

const InventoryItem: FC<InventoryItemProps> = ({
    name,
    description,
    type,
    downloadItem,
    image
}) => {
    const { isOpen, onToggle } = useDisclosure();
    const [show, setShow] = useState(false);

    const changeShow = () => {
        setShow(!show);
    };

    const showDescription = () => {
        setTimeout(changeShow, 100);
        onToggle();
    };

    return (

        <Box width="fit-content">
            <Flex
                _hover={{
                    cursor: 'pointer',
                    transform: 'scale(1.05)',
                }}
                onClick={showDescription}
                flexDirection='column'
                alignItems='center'
                mb='2rem'
                mr='1rem'
                borderRadius='7.5%'
                transform={show ? `scale(1.05)` : ' '}
                transition='150ms cubic-bezier(.38, .5, .5, 1.5)'
            >
                <Box minW="250px" maxHeight='300px'>
                    <Box>
                        <Image
                            maxWidth='300px'
                            transition='50ms'
                            bg={show ? '#00000012' : colorPalette.backgroundHighlight}
                            w='100%'
                            h='18.75rem'
                            mt='0.5rem'
                            src={image}
                            padding='5rem 3.5rem'
                            mb='1rem'
                            borderRadius='7.5%'
                        />
                    </Box>
                </Box>
                <Flex
                    flexDirection='column'
                    maxWidth='300px'
                    w='90%'
                    alignItems='right'
                    mt='1rem'
                >
                    <Text
                        fontFamily={fontTheme.fonts}
                        fontWeight='semibold'
                        mb='0.3rem'
                    >
                        {name}
                    </Text>
                    <Text
                        fontFamily={fontTheme.fonts}
                        fontWeight='regular'
                        color={colorPalette.infoTextColor}
                        mb='0.3rem'
                    >
                        Tipo: {type}
                    </Text>
                </Flex>
            </Flex>
            {show && <ItemSlider isOpen={isOpen} showDescription={showDescription} description={description} downloadItem={downloadItem} />}
        </Box>
    );
};

export default InventoryItem;
