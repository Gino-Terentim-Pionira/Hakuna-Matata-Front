import React, { FC, } from 'react';
import { Button, Text } from "@chakra-ui/react";
import colorPalette from '../styles/colorPalette';
import "./styles/PerfilModalButton.css";

type PerfilModalButtonProps = {
    isSelected: boolean,
    label: string,
    onClick: VoidFunction,
}

const PerfilModalButton: FC<PerfilModalButtonProps> = ({ onClick, label, isSelected}) => {
    const bg = isSelected ? colorPalette.secondaryColor : colorPalette.inactiveButton;
    return (
        <Button
            className="profile_modal_button_container"
            size='lg'
            height='4rem'
            width='25%'
            bg={bg}
            color={colorPalette.buttonTextColor}
            _hover={{ transform: "scale(1.1)" }}
            transition='all 200ms ease'
            onClick={onClick}
        >
            <Text className="profile_modal_button_container_text" fontSize='1.5rem'>
                {label}
            </Text>
        </Button>
    );
}

export default PerfilModalButton;