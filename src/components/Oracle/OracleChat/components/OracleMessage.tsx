import React from 'react';
import { Text } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import './styles/OracleMessage.css';

const OracleMessage = ({
    message,
    role,
    isLoading,
}: {
    message: string;
    role: 'user' | 'assistant',
    isLoading?: boolean
}) => {
    const IS_USER = role === 'user';
    const textProps = {
        color: IS_USER ? colorPalette.oracleWhite : colorPalette.textColor,
        background: IS_USER ? colorPalette.primaryColor : colorPalette.whiteText,
        border: IS_USER ? "8px 8px 0px 8px" : "8px 8px 8px 0px",
        alignSelf: IS_USER ? "end" : "start"
    }
    return (
        <Text
            display="flex"
            color={textProps.color}
            alignSelf={textProps.alignSelf}
            width="100%"
            maxWidth={ isLoading ? '100px' : '297px'}
            height="fit-content"
            background={textProps.background}
            paddingX="12px"
            paddingY="8px"
            borderRadius={textProps.border}
            justifyContent={isLoading ? 'center' : 'start'}
        >
            {isLoading ?
                <div className="loader"></div>
                : message}
        </Text>
    )
}

export default OracleMessage;
