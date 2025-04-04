import {Flex} from "@chakra-ui/react";
import colorPalette from "../../../../styles/colorPalette";
import React from "react";

type ShopQuickFilterType = {
    isSelected: boolean;
    label: string;
    onClick: VoidFunction;
    color: string;
}

export const ShopQuickFilter = ({ isSelected, label, onClick, color }: ShopQuickFilterType) => {
    return (
        <Flex
            minW="fit-content"
            h="35px"
            alignItems="center"
            justifyContent="center"
            border={`2px solid ${color}`}
            paddingX="16px"
            paddingY="8px"
            borderRadius="4px"
            fontSize="16px"
            fontWeight="medium"
            color={isSelected ? colorPalette.whiteText : colorPalette.textColor}
            background={isSelected ? color : 'transparent'}
            mt="12px"
            cursor="pointer"
            onClick={onClick}
            transition='all 150ms ease'
            _hover={{
                transform: 'scale(1.05)'
            }}
        >
            { label }
        </Flex>
    )
}