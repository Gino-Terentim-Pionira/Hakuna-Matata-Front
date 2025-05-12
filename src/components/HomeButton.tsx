import { Flex, Image, Text, Tooltip, useMediaQuery } from '@chakra-ui/react';
import React, { FC } from 'react';
import colorPalette from '../styles/colorPalette';
import MediaQueriesEnum from '../utils/enums/mediaQueries';

type HomeButtonProps = {
    text: string;
    image: string;
    onClick: VoidFunction;
    mouseOver: string;
    subText: string;
};

const HomeButton: FC<HomeButtonProps> = ({ text, image, onClick, mouseOver, subText }) => {
    const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

    return (
        <Tooltip isDisabled={!isDesktop} label={mouseOver} hasArrow>
            <Flex
                width={{ base: '100%', md: '320px' }}
                paddingTop="32px"
                paddingBottom={{ base: "32px", md: "22px" }}
                border='0.1rem solid'
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
                    flexDirection={{ base: 'row', md: 'column' }}
                    width='100%'
                    height={{ base: '70px', md: 'auto' }}
                    justifyContent='center'
                    alignItems='center'
                >
                    <Image
                        w={{ base: '30px', md: '17%' }}
                        h={{ base: '33px', md: 'auto' }}
                        mb={{ base: '0', md: '1rem' }}
                        mr={{ base: '16px', md: '0' }}
                        src={image}
                        alt="Ícone"
                    />
                    <Text
                        fontSize={{ base: '28px', md: '28px', sm: '25px' }}
                        color='#926021'
                    >
                        {text}
                    </Text>
                    <Text
                        display={{ base: 'none', md: 'block' }}
                        fontSize={{ base: '0', md: '24px', sm: '20px' }}
                        color='#926021'
                    >
                        {subText}
                    </Text>
                </Flex>
            </Flex>
        </Tooltip>
    );
};

export default HomeButton;
