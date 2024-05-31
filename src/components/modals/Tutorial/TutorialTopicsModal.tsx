import {
    Flex,
    Grid, Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay, Text
} from "@chakra-ui/react";
import TutorialTopicBackground from "../../../assets/modal/tutorial_topic.png";
import fontTheme from "../../../styles/base";
import colorPalette from "../../../styles/colorPalette";
import icon_shop from "../../../assets/icons/icon_shop.svg";
import React, { useEffect, useState } from "react";
import TutorialServices from "../../../services/TutorialServices";
import LoadingState from "../../LoadingState";

type TutorialTopicsModalType = {
    isOpen: boolean,
    onClose: VoidFunction
}

export const TutorialTopicsModal = ({isOpen, onClose}: TutorialTopicsModalType) => {
    const tutorialServices = new TutorialServices()
    const [tutorialTopics, setTutorialTopics] = useState([{
        name: '',
        icon: '',
        index: 0,
    }]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getAllTutorialTopics = () => {
            setIsLoading(true);
            return tutorialServices.getAllTutorialTopics()
        }

        if(isOpen) {
            getAllTutorialTopics().then((response) => {
                setTutorialTopics(response.data)
            }).catch(() => {
                setTutorialTopics([])
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay />

            <ModalContent
                bgImage={`url(${TutorialTopicBackground})`}
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                height="650px"
                fontFamily={fontTheme.fonts}
                boxShadow="0 10px 20px rgba(0, 0, 0, 0.5), 0 3px 6px rgba(0, 0, 0, 1)"
            >
                <ModalCloseButton marginTop="14px" marginRight="14px" size="32px" color={colorPalette.closeButton} />
                <ModalHeader paddingTop="52px" fontSize="24px" fontWeight="bold" color={colorPalette.textColor} textAlign={"center"}>Descobrindo o Pionira</ModalHeader>
                <ModalBody paddingTop="32px" paddingBottom="52px" paddingX="32px" >
                    {
                        isLoading ? (
                            <LoadingState />
                        ) : <Grid templateColumns='repeat(2, 1fr)' gap="24px">
                            {
                                tutorialTopics.map(({name, icon, index}) => (
                                    <Flex
                                        border={`2px solid ${colorPalette.textColor}`}
                                        alignItems="center"
                                        borderRadius="8px"
                                        bg="#FBEFC9"
                                        width="100%"
                                        height="60px"
                                        paddingX="16px"
                                        columnGap="8px"
                                        key={index}
                                    >
                                        <Image width="32px" height="32px" src={icon || icon_shop} alt="Icone tutorial" />
                                        <Text fontSize="14px" fontWeight="500" color={colorPalette.textColor}>{name}</Text>
                                    </Flex>
                                ))
                            }
                        </Grid>
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
