import { Flex, Image, Text, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import colorPalette from '../styles/colorPalette';
import "./styles/HomeButtonStyles.css";

type HomeButtonProps = {
    text: string;
    image: string;
    onClick: VoidFunction;
    mouseOver: string;
    subText: string;
}

const HomeButton: FC<HomeButtonProps> = ({text, image, onClick, mouseOver, subText}) => {
    return (
        <Tooltip 
            label={mouseOver} 
            hasArrow
        >
            <Flex
                className="home_button_container"
                width='320px'
                h='fit-content'
                paddingTop="32px"
                paddingBottom="22px"
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
                    className="home_button_sub_container"
                    flexDirection='column'
                    width='100%'
                    justifyContent='space-around'
                    alignItems='center'
                >
                    <Image className="home_button_sub_container_image" w='17%' src={image} mb='1rem' />
                    <Text
                        className="home_button_sub_container_primary_text"
                        fontSize={{ lg: '28px', md: '28px', sm: '25px' }}
                        color='#926021'
                    >
                        {text}
                    </Text>
                    <Text
                        className="home_button_sub_container_secondary_text"
                        fontSize={{ lg: '24px', md: '24px', sm: '20px' }}
                        color='#926021'
                    >
                        {subText}
                    </Text>
                </Flex>
            </Flex>
        </Tooltip>
    )
}

export default HomeButton;
