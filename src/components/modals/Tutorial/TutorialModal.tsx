import {
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import TutorialTopicBackground from "../../../assets/modal/tutorial_topic.png";
import fontTheme from "../../../styles/base";
import colorPalette from "../../../styles/colorPalette";
import React, { useEffect, useState } from "react";
import TutorialServices, { ITutorialContent, ITutorialTopic } from "../../../services/TutorialServices";
import LoadingState from "../../LoadingState";
import { useUser } from "../../../hooks";
import { TutorialTopics } from "./components/TutorialTopics";
import { TutorialContent } from "./components/TutorialContent";
import cheetahBlink from "../../../assets/icons/cheetahblink.svg";
import WelcomeVideoModal from "../WelcomeVideoModal";

type TutorialTopicsModalType = {
    isOpen: boolean,
    onClose: VoidFunction,
    selectedTopic?: string | undefined
}

export const TutorialModal = ({ isOpen, onClose, selectedTopic }: TutorialTopicsModalType) => {
    const { userData } = useUser();
    const tutorialServices = new TutorialServices();
    const [tutorialTopics, setTutorialTopics] = useState([
        {
            name: 'Vídeo de Boas Vindas',
            icon: cheetahBlink,
            index: 0
        }
    ] as ITutorialTopic[]);
    const [isLoading, setIsLoading] = useState(false);
    const [tutorialContentSelected, setTutorialContentSelected] = useState<ITutorialContent[] | undefined>();

    const {
        isOpen: welcomeVideoIsOpen,
        onClose: welcomeVideoOnClose,
        onOpen: welcomeVideoOnOpen,
    } = useDisclosure();

    const handleTutorialContentSelected = async (tutorialName: string) => {
        try {
            if (tutorialName == tutorialTopics[0].name) {
                welcomeVideoOnOpen();
            } else {
                setIsLoading(true);
                const tutorialContent = await tutorialServices.getContentsByTopic(tutorialName);

                setTutorialContentSelected(tutorialContent);
                setIsLoading(false);
            }

        } catch (error) {
            console.log("Deu error")
            setIsLoading(false);
        }
    }

    const handleGoBackToTopics = () => {
        setTutorialContentSelected(undefined)
    }

    useEffect(() => {
        const getAllTutorialTopics = () => {
            setIsLoading(true);
            return tutorialServices.getAllTutorialTopics()
        }

        if (!isOpen) handleGoBackToTopics();

        if (isOpen && tutorialTopics.length == 1) {
            getAllTutorialTopics().then((data) => {
                setTutorialTopics((prevTopics) => [...prevTopics, ...data]);
            }).catch(() => {
                setTutorialTopics([])
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedTopic) handleTutorialContentSelected(selectedTopic as string);
    }, [selectedTopic]);

    return (
        <>
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
                    {isLoading ? (
                        <LoadingState />
                    ) :
                        (tutorialContentSelected ?
                            <TutorialContent tutorialContent={tutorialContentSelected} userData={userData} goBack={handleGoBackToTopics} />
                            :
                            <TutorialTopics tutorialTopics={tutorialTopics} userData={userData}
                                onClick={handleTutorialContentSelected} />
                        )}
                </ModalContent>
            </Modal>

            <WelcomeVideoModal isOpen={welcomeVideoIsOpen} onClose={welcomeVideoOnClose} />
        </>
    )
}
