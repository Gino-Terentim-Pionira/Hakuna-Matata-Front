import React from 'react';
import { Box } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import Markdown from 'react-markdown';
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
        <Box
            display="flex"
            className={ isLoading ? 'oracleMessageContainer' : undefined}
            color={textProps.color}
            alignSelf={textProps.alignSelf}
            width="fit-content"
            maxWidth={isLoading ? '100px' : '297px'}
            height="fit-content"
            background={textProps.background}
            paddingX="12px"
            paddingY="8px"
            borderRadius={textProps.border}
            justifyContent={isLoading ? 'center' : 'start'}
            flexDirection='column'
            transition="height 1s ease"
            sx={{
                "ul": {
                    marginTop: "4px",
                    paddingLeft: "18px",
                    paddingRight: "18px",
                },
                "ol": {
                    marginTop: "4px",
                    paddingLeft: "18px",
                    paddingRight: "18px",
                    marginBottom: "4px",
                },
                "code": {
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    maxWidth: '100%',
                }
            }}
        >
            {isLoading ?
                <div className="loader"></div>
                : <Markdown>
                    {message}
                </Markdown>}
        </Box>
    )
}

export default OracleMessage;
