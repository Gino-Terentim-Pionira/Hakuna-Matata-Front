import React, { FC, } from 'react';
import { Button, Text } from "@chakra-ui/react";
import colorPalette from '../styles/colorPalette';

type PerfilModalButtonProps = {
    isSelected: boolean,
    label: string,
    onClick: VoidFunction,
}

const PerfilModalButton: FC<PerfilModalButtonProps> = ({ onClick, label, isSelected}) => {
    const bg = isSelected ? colorPalette.secondaryColor : colorPalette.inactiveButton;
    return (
        <Button
            size='lg'
            height='4rem'
            width='25%'
            bg={bg}
            color={colorPalette.buttonTextColor}
            _hover={{ transform: "scale(1.1)" }}
            transition='all 200ms ease'
            onClick={onClick}
        >
            <Text fontSize='1.5rem'>
                {label}
            </Text>
        </Button>
    );
}

export default PerfilModalButton;