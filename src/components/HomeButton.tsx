import { Flex, Image, Text, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import colorPalette from '../styles/colorPalette';

type HomeButtonProps = {
    text: string;
    image: string;
    onClick: VoidFunction;
    mouseOver: string;
}

const HomeButton: FC<HomeButtonProps> = ({text, image, onClick, mouseOver}) => {
    return (
        <Tooltip 
            label={mouseOver} 
            hasArrow
        >
            <Flex
            width='320px'
            h='170px'
            padding='2rem'
            border='0.1rem  solid'
            borderColor={colorPalette.primaryColor}
            background='rgba(255, 255, 255, 0.51)'
            borderRadius='8px'
            flexDirection='column'
            justifyContent='flex-end'
            alignItems='center'
            transition='all 0.3s'
            _hover={{
                cursor: 'pointer',
                boxShadow:
                    '0 10px 20px rgba(0, 0, 0, 0.25), 10px 10px 10px rgba(0, 0, 0, 0.22)',
            }}
            onClick={onClick}
            >
                <Flex
                    flexDirection='column'
                    width='100%'
                    h='80%'
                    justifyContent='space-around'
                    alignItems='center'
                >
                    <Image w='17%' src={image} mb='1rem' />
                    <Text
                        fontSize={{ lg: '28px', md: '28px', sm: '25px' }}
                        color='#926021'
                    >
                        {text}
                    </Text>
                </Flex>
            </Flex>
        </Tooltip>
    )
}

export default HomeButton;
