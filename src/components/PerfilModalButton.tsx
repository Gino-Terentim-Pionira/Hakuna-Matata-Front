import React, { FC, } from 'react';
import { Button, Text } from "@chakra-ui/react";
import colorPalette from '../styles/colorPalette';

type PerfilModalButtonProps = {
    text?: string,
    click: VoidFunction,
    whichBtn: number
}

const PerfilModalButton: FC<PerfilModalButtonProps> = ({ click, text, whichBtn }) => {
    return (
        whichBtn === 1 ? (
            <Button
                size='lg'
                height='4rem'
                width='25%'
                bg={colorPalette.inactiveButton}
                color={colorPalette.buttonTextColor}
                _hover={{ transform: "scale(1.1)" }}
                transition='all 200ms ease'
                onClick={click}
            >
                <Text fontSize='1.5rem'>
                    {text}
                </Text>
            </Button>
        ) : (
            <Button
                size='lg'
                height='4rem'
                width='25%'
                bg={colorPalette.inactiveButton}
                color={colorPalette.buttonTextColor}
                _hover={{ transform: "scale(1.1)" }}
                transition='all 200ms ease'
                display='flex'
                flexDirection='column'
                onClick={click}
            >
                <Text fontSize='1.5rem'>
                    Insígnias e
                </Text>
                <Text fontSize='1.5rem'>
                    Certificados
                </Text>
            </Button>
        )

    )
}

export default PerfilModalButton;