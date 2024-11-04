import { Flex, Image, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import colorPalette from "../../../styles/colorPalette";
import fontTheme from "../../../styles/base";
import rightArrow from "../../../assets/icons/rightArrow.png";
import SliderModal from "../SliderModal";

interface IScript {
    name: string,
    image: string,
    texts: string[],
}

type NarrativeModalProps = {
    isOpen: boolean,
    onToggle: VoidFunction,
    script: IScript[],
    endScriptFunction?: VoidFunction,
}

const DefaultNarrativeModal = ({
    isOpen,
    onToggle,
    script,
    endScriptFunction
}: NarrativeModalProps) => {

    const [delayButton, setDelayButton] = useState(true);

    const [visibleText, setVisibleText] = useState(false);
    const [visibleName, setVisibleName] = useState(false);
    const [visibleImage, setVisibleImage] = useState(false);

    const [scriptImage, setScriptImage] = useState(script[0].image);
    const [scriptText, setScriptText] = useState(script[0].texts[0]);
    const [scriptName, setScriptName] = useState(script[0].name);

    const [textIndex, setTextIndex] = useState(0);
    const [scriptIndex, setScriptIndex] = useState(0);

    const updateScript = () => {

        let nextTextIndex = textIndex + 1;

        if (nextTextIndex < script[scriptIndex].texts.length) {

            setTextIndex(nextTextIndex);

            setScriptText(script[scriptIndex].texts[nextTextIndex]);
        } else if (scriptIndex < script.length - 1) {
            const nextScriptIndex = scriptIndex + 1;
            nextTextIndex = 0;

            setTextIndex(nextTextIndex);
            setScriptIndex(nextScriptIndex);

            setScriptText(script[nextScriptIndex].texts[nextTextIndex]);

            setScriptImage(script[nextScriptIndex].image);

            setScriptName(script[nextScriptIndex].name);
        } else {
            endScriptFunction ? endScriptFunction() :  onToggle();
        }
    }

    const buttonFunctions = () => {
        if (delayButton) {
            setDelayButton(!delayButton);
            updateScript();
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisibleImage(true);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [scriptImage]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisibleText(true);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [scriptText]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisibleName(true);
        }, 500);
        return () => clearTimeout(timeout);
    }, [scriptName]);

    useEffect(() => {
        if (!delayButton) {
            const timeout = setTimeout(() => {
                setDelayButton(!delayButton);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [delayButton]);

    useEffect(() => {
        // Função para resetar o texto do script ao abrir e fechar o modal
        setScriptText(script[0].texts[0]);
        setTextIndex(0);
        setScriptIndex(0);
    }, [isOpen]);

    return (
        <SliderModal 
            isOpen={isOpen}
            buttonFunctions={buttonFunctions}
            visibleImage={visibleImage}
            title={scriptName}
            image={scriptImage}
            visibleName={visibleName}
            visibleText={visibleText}
            content={scriptText}
            customComponent={
                <Flex
                        justifyContent='space-between'
                        alignItems='flex-end'
                        paddingTop='9px'
                        flexDirection='column'
                    >
                        <Text
                            mt=".5rem"
                            _hover={{
                                cursor: 'pointer',
                                opacity: '80%'
                            }}
                            onClick={() => {
                                endScriptFunction ? endScriptFunction() :  onToggle();
                            }}
                            mr="32px"
                            fontFamily={fontTheme.fonts}
                            fontSize="26px"
                            fontWeight="semibold"
                            color={colorPalette.closeButton}
                        >
                            Pular
                        </Text>

                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ loop: Infinity }}
                        >
                            <Image src={rightArrow}
                                mb="1.5rem"
                                _hover={{
                                    cursor: 'pointer',
                                    opacity: '80%'
                                }}
                                onClick={() => buttonFunctions()}
                                mr="1.5rem" />
                        </motion.div>
                    </Flex>
            }
        />
    )
}

export default DefaultNarrativeModal;
