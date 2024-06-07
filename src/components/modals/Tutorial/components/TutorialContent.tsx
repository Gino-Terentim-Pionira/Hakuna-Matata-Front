import React, { useState } from "react";
import {Flex, Image, ModalBody, ModalFooter, ModalHeader, Text} from "@chakra-ui/react";
import {ITutorialContent} from "../../../../services/TutorialServices";
import colorPalette from "../../../../styles/colorPalette";
import {imageIconsEnum} from "../../../../utils/enums/imageIconsEnum";
import Markdown from 'react-markdown';
import {FaArrowLeft, FaArrowRight} from 'react-icons/fa6'
import './TutorialContentStyle.css';


type TutorialContentType = {
    tutorialContent: ITutorialContent[];
    goBack: VoidFunction;
}
export const TutorialContent = ({tutorialContent, goBack}: TutorialContentType) => {
    const IS_ONLY_ONE_CONTENT = tutorialContent.length === 1;
    const [tutorialContentIndex, setTutorialContentIndex] = useState(0);
    const { tutorial_topic_name, image, content, name } = tutorialContent[tutorialContentIndex]

    const handlePassingContentWith = (arrow: "left" | "right") => {
        if(arrow === "left" && tutorialContentIndex > 0) {
            setTutorialContentIndex(tutorialContentIndex-1)
        } else if (arrow === "right" && tutorialContentIndex < tutorialContent.length - 1) {
            setTutorialContentIndex(tutorialContentIndex+1)
        }
    }


    return (
        <>
            <FaArrowLeft onClick={goBack} className="arrow" style={{marginLeft: '18px', marginTop: '14px'}} color={colorPalette.textColor} size="36px" />

            <ModalHeader
                display="flex"
                alignItems="center"
                columnGap="8px"
                fontSize="24px"
                fontWeight="bold"
                paddingTop="16px"
                paddingX="30px"
                color={colorPalette.textColor}
                justifyContent="left"
            >
                <Image src={imageIconsEnum[tutorial_topic_name]} width="32px" alt="Tutorial Icon"/>
                {tutorial_topic_name}
            </ModalHeader>
            <ModalBody paddingTop="-14px" paddingBottom="52px" paddingX="30px">
                <Image borderRadius="8px" w="100%" h="195px"  src={image} alt="Imagem do tutorial" />
                <Text
                    marginTop="16px"
                    fontSize="20px"
                    fontWeight="600"
                    color={colorPalette.textColor}
                >
                    {name}
                </Text>
                <Text
                    fontSize="16px"
                    color={colorPalette.textColor}
                    marginTop="8px"
                    sx={{
                        "ul": {
                            marginTop: "8px",
                            paddingLeft: "18px",
                            paddingRight: "18px",
                        },
                        "ol": {
                            marginTop: "8px",
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
                    <Markdown>
                        {content}
                    </Markdown>
                </Text>
            </ModalBody>

            <ModalFooter paddingBottom="18px" columnGap="48px" paddingX="0px" display="flex" justifyContent="center" alignItems="center">
                {
                    !IS_ONLY_ONE_CONTENT && (
                        <>
                            <FaArrowLeft className="arrow" color={colorPalette.textColor} size="32" onClick={() => handlePassingContentWith("left")} />
                            <Flex justify="center" columnGap="8px" width="100%" maxWidth="220px">
                                {
                                    tutorialContent.map(({index}) => (
                                        <>
                                            <Flex
                                                key={index}
                                                flex="1"
                                                width="100%"
                                                maxWidth="38px"
                                                h="8px"
                                                bg={tutorialContentIndex === index ? colorPalette.primaryColor :colorPalette.grayBackground}
                                                borderRadius="1000px"
                                                border={`1px solid ${tutorialContentIndex === index ? colorPalette.primaryColor : "#9D9D9D"}`}
                                                _hover={{
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => setTutorialContentIndex(index)}
                                            />
                                        </>
                                    ))
                                }
                            </Flex>
                            <FaArrowRight className="arrow" color={colorPalette.textColor} onClick={() => handlePassingContentWith("right")} size="32" />
                        </>
                    )
                }
            </ModalFooter>
        </>
    )
}
