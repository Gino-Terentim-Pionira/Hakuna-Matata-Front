import {Box, Button, Flex, Slide, Text} from "@chakra-ui/react";
import colorPalette from "../../styles/colorPalette";
import React from "react";

interface IItemSlider {
    isOpen: boolean;
    showDescription: VoidFunction;
    description: string;
    downloadItem:VoidFunction;
    title: string;
}
export const ItemSlider = ({isOpen, downloadItem, description, showDescription, title}: IItemSlider) => (
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
                        {title}
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
                    <Button
                        width='100%'
                        height='3.5rem'
                        background={colorPalette.primaryColor}
                        color={colorPalette.buttonTextColor}
                        fontSize='1.5rem'
                        borderRadius='8px'
                        _hover={{ bg: colorPalette.primaryColor }}
                        onClick={downloadItem}
                    >
                        Download
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    </Slide>
);
