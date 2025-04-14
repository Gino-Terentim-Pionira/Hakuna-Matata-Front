import React, { useState } from 'react';
import { ICommonQuestion } from '../../../../services/OracleServices';
import { Box, Text, Stack, Button, Collapse, Slide, Flex } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import { useWindowSize } from '../../../../hooks/useWindowSize';

type CollapseQuestionsType = {
    commonQuestions: ICommonQuestion[];
    isMessageLoading: boolean;
    sendCommonQuestion: (question: string) => void;
    isCommonQuestionOpen: boolean;
    closeCollapse: VoidFunction;
}

interface IGroupedQuestions {
    [module_name: string]: {
        [topic: string]: ICommonQuestion[];
    };
}

const CollapseQuestions = ({ commonQuestions, isMessageLoading, sendCommonQuestion, isCommonQuestionOpen, closeCollapse }: CollapseQuestionsType) => {
    const [startY, setStartY] = useState<number | null>(null);
    const [translateY, setTranslateY] = useState(0);
    const [closing, setClosing] = useState(false);
    const groupedQuestions = commonQuestions.reduce<IGroupedQuestions>((acc, question) => {
        const { module_name, topic } = question;

        if (!acc[module_name]) {
            acc[module_name] = {};
        }

        if (!acc[module_name][topic]) {
            acc[module_name][topic] = [];
        }

        acc[module_name][topic].push(question);
        return acc;
    }, {});
    const { isDesktop } = useWindowSize();

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (startY === null) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        if (diff > 0) setTranslateY(diff);
    };

    const handleTouchEnd = () => {
        if (translateY > 100) {
            setClosing(true);
            closeCollapse();
            setTimeout(() => {
                setClosing(false);
                setTranslateY(0);
            }, 100);
        } else {
            setTranslateY(0);
        }
    };

    const renderGroupedQuestions = () => (
        <Box marginTop='28px'>
            {
                Object.keys(groupedQuestions).reverse().map((moduleName) => (
                    <Box key={moduleName} marginBottom='18px' marginRight='65px'>
                        <Text fontWeight='bold' marginBottom='16px' fontSize='20px' marginLeft='24px' color={colorPalette.textColor}>
                            {moduleName}
                        </Text>

                        {Object.keys(groupedQuestions[moduleName]).map((topic) => (
                            <Box key={topic} marginBottom='12px' marginLeft='28px'>
                                <Text fontWeight='bold' fontSize='16px' color={colorPalette.greyText} marginBottom='4px'>
                                    {topic}
                                </Text>

                                <Stack spacing='16px'>
                                    {groupedQuestions[moduleName][topic].map((question) => (
                                        <Button
                                            borderRadius='4px 4px 4px 0px'
                                            paddingX="16px"
                                            paddingY="10px"
                                            justifyContent="flex-start"
                                            background={colorPalette.primaryColor}
                                            color={colorPalette.whiteText}
                                            height="auto"
                                            width="100%"
                                            minH="30px"
                                            fontSize="16px"
                                            fontWeight="medium"
                                            whiteSpace="normal"
                                            textAlign='left'
                                            isDisabled={isMessageLoading}
                                            _hover={{}}
                                            onClick={() => sendCommonQuestion(question.question)}
                                        >
                                            {question.question}
                                        </Button>
                                    ))}
                                </Stack>
                            </Box>
                        ))}
                    </Box>
                ))
            }
        </Box>
    );

    return (
        isDesktop ?
            <Collapse in={isCommonQuestionOpen} animateOpacity>
                <Box
                    borderTopRadius='4px'
                    background={colorPalette.oracleWhite}
                    boxShadow="inset 0px 6px 4px rgba(74, 74, 74, 0.25)"
                    height='50vh'
                    overflowY='auto'
                    onMouseLeave={closeCollapse}
                    sx={{
                        "&::-webkit-scrollbar": {
                            width: "4px",
                            height: "4px",
                            borderRadius: "8px"
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "#9D9D9D",
                            borderRadius: "10px"
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                            background: "#555",
                        },
                        "&::-moz-scrollbar": {
                            width: "4px",
                            height: "4px",
                            borderRadius: "8px"
                        },
                        "&::-moz-scrollbar-thumb": {
                            background: "#9D9D9D",
                            borderRadius: "10px"
                        },
                        "&::-moz-scrollbar-thumb:hover": {
                            background: "#555",
                        },
                    }}
                >
                    {
                        renderGroupedQuestions()
                    }
                </Box>
            </Collapse>
            :
            <Slide direction="bottom" in={isCommonQuestionOpen} style={{zIndex: 99}} >
                <Box
                    borderTopRadius='18px'
                    background={colorPalette.slideBackground}
                    height='50vh'
                    overflowY='auto'
                    sx={{
                        "&::-webkit-scrollbar": {
                            width: "4px",
                            height: "4px",
                            borderRadius: "8px"
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "#9D9D9D",
                            borderRadius: "10px"
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                            background: "#555",
                        },
                        "&::-moz-scrollbar": {
                            width: "4px",
                            height: "4px",
                            borderRadius: "8px"
                        },
                        "&::-moz-scrollbar-thumb": {
                            background: "#9D9D9D",
                            borderRadius: "10px"
                        },
                        "&::-moz-scrollbar-thumb:hover": {
                            background: "#555",
                        },
                    }}
                    style={{
                        transform: `translateY(${translateY}px)`,
                        transition: closing ? 'transform 0.3s ease-in-out' : '',
                    }}
                >
                    <Flex
                        className="shop_item_detailed_container_close_bar"
                        width="100%"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        height='fit-content'
                        paddingBottom="8px"
                        paddingTop="12px"
                    >
                        <Flex
                            width="50px"
                            height="6px"
                            borderRadius="1000px"
                            backgroundColor={colorPalette.neutralGray}
                            margin="auto"
                        />
                    </Flex>
                    {
                        renderGroupedQuestions()
                    }
                </Box>
            </Slide>
    )
}

export default CollapseQuestions;
