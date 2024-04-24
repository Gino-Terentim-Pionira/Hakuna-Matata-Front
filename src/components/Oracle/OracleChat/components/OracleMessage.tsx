import React from 'react';
import { Text } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import Markdown from 'react-markdown'

const OracleMessage = ({
    message,
    role
}: {
    message: string;
    role: 'user' | 'assistant'
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
            color={textProps.color}
            alignSelf={textProps.alignSelf}
            width="fit-content"
            height="fit-content"
            background={textProps.background}
            paddingX="20px"
            paddingY="8px"
            borderRadius={textProps.border}
        >
            <Markdown>
                {message}
            </Markdown>
        </Text>
    )
}

export default OracleMessage;
