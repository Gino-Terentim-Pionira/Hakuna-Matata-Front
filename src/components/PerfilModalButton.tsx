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
            padding={{base: "8px 23px", md: "auto"}}
            size='lg'
            height={{base: "fit-content", md: '4rem'}}
            width={{base: "fit-content", md:'25%'}}
            bg={bg}
            color={colorPalette.buttonTextColor}
            _hover={{ transform: {base: "none", md: "scale(1.1)"} }}
            transition={{base: "none", md: "all 200ms ease"}}
            onClick={onClick}
        >
            <Text fontSize={{base: "16px", md: "1.5rem"}}>
                {label}
            </Text>
        </Button>
    );
}

export default PerfilModalButton;