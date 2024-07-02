import React, { forwardRef, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import Markdown from 'react-markdown';
import './styles/OracleMessage.css';

interface OracleMessageType {
    message: string;
    role: 'user' | 'assistant';
    isLoading?: boolean;
    isLastMessage?: boolean;
    isNew?: boolean
}

const OracleMessage = forwardRef<HTMLDivElement, OracleMessageType>((props, ref) => {
    const { message, role, isLoading, isLastMessage, isNew } = props;
    const IS_USER = role === 'user';
    const IS_ANIMATED_RESPONSE = isLastMessage && !IS_USER && !isLoading && isNew;
    const textProps = {
        color: IS_USER ? colorPalette.oracleWhite : colorPalette.textColor,
        background: IS_USER ? colorPalette.primaryColor : colorPalette.whiteText,
        border: IS_USER ? "8px 8px 0px 8px" : "8px 8px 8px 0px",
        alignSelf: IS_USER ? "end" : "start"
    };
    const [displayMessage, setDisplayMessage] = useState<string>("");

    useEffect(() => {
        if (IS_ANIMATED_RESPONSE) {
            let i = 0;
            const intervalId = setInterval(() => {
                setDisplayMessage(message.slice(0, i));
                i++;
                if (i > message.length) {
                    clearInterval(intervalId);
                }
            }, 30);
            return () => clearInterval(intervalId);
        } else {
            setDisplayMessage(message);
        }
    }, [message]);

    return (
        <Box
            ref={ref}
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
                    {(IS_ANIMATED_RESPONSE) ? displayMessage : message}
                </Markdown>}
        </Box>
    )
});

export default OracleMessage;
