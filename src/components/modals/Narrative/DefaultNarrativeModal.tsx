import { Box, Slide, Flex, Image, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import colorPalette from "../../../styles/colorPalette";
import { SplitTitle } from "../../../utils/animations/SplitTitle";
import { SplitText } from "../../../utils/animations/SplitText";
import fontTheme from "../../../styles/base";
import rightArrow from "../../../assets/icons/rightArrow.png";

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
        <Box zIndex={10000}>
            <Slide direction="bottom" in={isOpen} >
                <Box onClick={buttonFunctions} w='100%' zIndex="5" h='100vh' />
                <Flex w="100%" justifyContent="flex-end" >
                    <AnimatePresence>
                        {visibleImage && (
                            <motion.div
                                style={{ zIndex: -1 }}
                                initial={{ opacity: -1 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ ease: "easeOut", duration: 0.5 }}
                                exit={{ opacity: -1 }}
                            > <Image src={scriptImage} transform="rotateY(0deg)" position="absolute" zIndex="-1" bottom="0" right="0" maxHeight="40rem" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Flex>
                <Flex
                    w='100%'
                    h='16rem'
                    bg='rgba(239, 239, 239, 0.94)'
                    rounded="md"
                    shadow="md"
                    flexDirection='row'
                    justifyContent='space-between'
                    border='4px solid'
                    borderColor={colorPalette.secondaryColor}
                    zIndex="10"
                >
                    <Flex
                        w='80%'

                        marginTop='1rem'
                        marginLeft='1.5rem'
                        flexDirection="column"
                    >
                        <AnimatePresence>
                            {visibleName && (
                                <motion.div
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <SplitTitle
                                        initial={{ y: '100%' }}
                                        animate="visible"
                                        variants={{
                                            visible: (i: number) => ({
                                                y: 0,
                                                transition: {
                                                    delay: i * 0.1
                                                }
                                            })
                                        }}
                                    >
                                        {scriptName}
                                    </SplitTitle>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {visibleText && (
                                <motion.div
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <SplitText
                                        initial={{ y: '100%' }}
                                        animate="visible"
                                        variants={{
                                            visible: (i: number) => ({
                                                y: 0,
                                                transition: {
                                                    delay: i * 0.04
                                                }
                                            })
                                        }}
                                    >
                                        {scriptText}
                                    </SplitText>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </Flex>
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
                </Flex>
            </Slide>
        </Box>
    )
}

export default DefaultNarrativeModal;
