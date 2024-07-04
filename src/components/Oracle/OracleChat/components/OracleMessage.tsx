import React, { forwardRef, useEffect, useState } from 'react';
import { Box, Tooltip } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import Markdown from 'react-markdown';
import './styles/OracleMessage.css';
import { PiCopyBold } from "react-icons/pi";
import { COPIED, COPY } from '../../../../utils/constants/textConstants';

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
    const [displayCopy, setDisplayCopy] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (IS_ANIMATED_RESPONSE) {
            setDisplayCopy(false);
            let i = 0;
            const intervalId = setInterval(() => {
                setDisplayMessage(message.slice(0, i));
                i++;
                if (i > message.length) {
                    clearInterval(intervalId);
                    setDisplayCopy(true);
                }
            }, 30);
            return () => clearInterval(intervalId);
        } else {
            setDisplayMessage(message);
        }
    }, [message]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(message).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reseta a mensagem após 2 segundos
        });
    };

    return (
        <Box
            ref={ref}
            display="flex"
            className={isLoading ? 'oracleMessageContainer' : undefined}
            color={textProps.color}
            alignSelf={textProps.alignSelf}
            width="fit-content"
            maxWidth={isLoading ? '100px' : ''}
            height="fit-content"
            background={textProps.background}
            paddingX="12px"
            paddingY="8px"
            borderRadius={textProps.border}
            justifyContent={isLoading ? 'center' : 'start'}
            flexDirection='row'
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
                : <Box maxWidth='357px' >
                    <Markdown>
                        {(IS_ANIMATED_RESPONSE) ? displayMessage : message}
                    </Markdown>
                </Box>}
            {
                (!IS_USER && !isLoading) ?
                    <Tooltip
                        label={copied ? COPIED : COPY}
                        closeOnClick={false}
                        hasArrow
                        placement='right'
                    >
                        <Box
                            width='24px'
                            height='24px'
                            marginLeft='16px'
                            color={colorPalette.grayBackground}
                            onClick={copyToClipboard}
                            cursor='pointer'
                            visibility={displayCopy ? 'visible' : 'hidden'}
                        >
                            <PiCopyBold size='24' />
                        </Box>
                    </Tooltip>
                    : null
            }
        </Box>
    )
});

export default OracleMessage;
