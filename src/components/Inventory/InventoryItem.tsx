import React, { FC, useState, Component, ReactComponentElement, ReactElement } from 'react';
import {
    Flex,
    Button,
    Box,
    Image,
    Text,
    Slide,
    useDisclosure,
} from '@chakra-ui/react';

// Styles
import fontTheme from '../../styles/base';
import colorPalette from '../../styles/colorPalette';

//API
//import api from '../services/api';

type InventoryItemProps = {
    name: string;
    description: string;
    type: string;
    image: string;
    customButton: ReactElement
};

const InventoryItem: FC<InventoryItemProps> = ({
    name,
    description,
    type,
    customButton,
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

        <Box>
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
                <Box maxHeight='300px'>
                    <Box w='100%'>
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
            {show ? (
                <Slide
                    direction='bottom'
                    in={isOpen}
                    style={{ zIndex: 10 }}
                >
                    <Box onClick={showDescription} w='100%' h='100vh' />
                    <Flex
                        w='100%'
                        h='16rem'
                        bg={colorPalette.slideBackground}
                        rounded='md'
                        shadow='md'
                        flexDirection='column'
                        justifyContent='space-between'
                        border='4px solid'
                        borderColor={colorPalette.secondaryColor}
                    >
                        <Flex
                            justifyContent='flex-end'
                            paddingRight='20px'
                            paddingTop='9px'
                            fontSize='2rem'
                            fontWeight='bold'
                            color={colorPalette.closeButton}
                        >
                            <Text
                                onClick={showDescription}
                                transition='all 0.2s'
                                _hover={{
                                    cursor: 'pointer',
                                    opacity: '80%',
                                }}
                                _active={{
                                    opacity: '50%',
                                }}
                                w='2.5rem'
                            >
                                X
                        </Text>
                        </Flex>
                        <Flex
                            w='92%'
                            marginTop='2rem'
                            position='absolute'
                            marginLeft='1.5rem'
                            justifyContent='space-between'
                        >
                            <Flex flexDirection='column' w='80%'>
                                <Text
                                    fontSize={[
                                        '0.5rem',
                                        '1.2rem',
                                        '1.5rem',
                                    ]}
                                    w='60%'
                                    fontWeight='semibold'
                                    textAlign='left'
                                    mb='8px'
                                >
                                    {name}
                                </Text>
                                <Text
                                    fontSize={[
                                        '0.3rem',
                                        '0.8rem',
                                        '1rem',
                                    ]}
                                    fontWeight='regular'
                                    textAlign='left'
                                    overflow="auto"
                                    maxH="160px"
                                >
                                    {description}
                                </Text>
                            </Flex>
                            <Flex
                                flexDirection='column'
                                alignSelf='flex-start'
                            >
                                <Component />
                            </Flex>
                        </Flex>
                    </Flex>
                </Slide>
            ) : null}
        </Box>
    );
};

export default InventoryItem;
