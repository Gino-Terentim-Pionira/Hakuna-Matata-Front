import React, { forwardRef, useEffect, useState } from 'react';
import { Box, Tooltip, useMediaQuery } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import Markdown from 'react-markdown';
import './styles/OracleMessage.css';
import { PiCopyBold } from "react-icons/pi";
import { COPIED, COPY } from '../../../../utils/constants/textConstants';
import MediaQueriesEnum from '../../../../utils/enums/mediaQueries';

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
    const [copyButtonInfo, setCopyButtonInfo] = useState({
        displayCopy: true,
        isCopied: false
    });
    const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

    useEffect(() => {
        if (IS_ANIMATED_RESPONSE) {
            setCopyButtonInfo({
                ...copyButtonInfo,
                displayCopy: false
            });
            let i = 0;
            const intervalId = setInterval(() => {
                setDisplayMessage(message.slice(0, i));
                i++;
                if (i > message.length) {
                    clearInterval(intervalId);
                    setCopyButtonInfo({
                        ...copyButtonInfo,
                        displayCopy: true
                    });
                }
            }, 30);
            return () => clearInterval(intervalId);
        } else {
            setDisplayMessage(message);
        }
    }, [message]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(message).then(() => {
            setCopyButtonInfo({
                ...copyButtonInfo,
                isCopied: true
            });
            setTimeout(() => setCopyButtonInfo({
                ...copyButtonInfo,
                isCopied: false
            }), 2000);
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
                (!IS_USER && !isLoading) &&
                <Tooltip
                    isDisabled={!isDesktop}
                    label={copyButtonInfo.isCopied ? COPIED : COPY}
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
                        visibility={copyButtonInfo.displayCopy ? 'visible' : 'hidden'}
                    >
                        <PiCopyBold size='24' />
                    </Box>
                </Tooltip>
            }
        </Box>
    )
});

export default OracleMessage;
