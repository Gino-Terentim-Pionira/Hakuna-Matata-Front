import React from 'react';
import { ICommonQuestion } from '../../../../services/OracleServices';
import { Box, Text, Stack, Tooltip, Button, Collapse } from '@chakra-ui/react';
import { NOT_ENOUGH_MESSAGES } from '../../../../utils/constants/mouseOverConstants';
import colorPalette from '../../../../styles/colorPalette';

type CollapseQuestionsType = {
    commonQuestions: ICommonQuestion[];
    IS_USER_HAS_MESSAGES: boolean;
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

const CollapseQuestions = ({ commonQuestions, IS_USER_HAS_MESSAGES, isMessageLoading, sendCommonQuestion, isCommonQuestionOpen, closeCollapse }: CollapseQuestionsType) => {
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

    const renderGroupedQuestions = () => (
        <Box marginTop='28px'>
            {
                Object.keys(groupedQuestions).map((moduleName) => (
                    <Box key={moduleName} marginBottom='18px' marginRight='65px'>
                        <Text fontWeight='bold' marginBottom='16px' fontSize='20px' marginLeft='24px'>
                            {moduleName}
                        </Text>

                        {Object.keys(groupedQuestions[moduleName]).map((topic) => (
                            <Box key={topic} marginBottom='12px' marginLeft='28px'>
                                <Text fontWeight='bold' fontSize='16px' color={colorPalette.greyText} marginBottom='4px'>
                                    {topic}
                                </Text>

                                <Stack spacing='16px'>
                                    {groupedQuestions[moduleName][topic].map((question) => (
                                        <Tooltip
                                            label={NOT_ENOUGH_MESSAGES}
                                            placement='left'
                                            hasArrow
                                            isDisabled={IS_USER_HAS_MESSAGES}
                                            closeOnClick={false}
                                            key={question._id}
                                        >
                                            <Button
                                                borderRadius='4px 4px 4px 0px'
                                                paddingX="16px"
                                                paddingY="10px"
                                                justifyContent="flex-start"
                                                cursor={IS_USER_HAS_MESSAGES ? 'pointer' : 'help'}
                                                background={IS_USER_HAS_MESSAGES ? colorPalette.primaryColor : colorPalette.grayBackground}
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
                                        </Tooltip>
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
        <Collapse in={isCommonQuestionOpen} animateOpacity>
            <Box
                borderTopRadius='4px'
                background={colorPalette.oracleWhite}
                boxShadow="inset 0px 6px 4px rgba(74, 74, 74, 0.25)"
                height='60vh'
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
    )
}

export default CollapseQuestions;
