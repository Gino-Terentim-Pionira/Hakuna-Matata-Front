import React, { FC, useState, useEffect, SetStateAction } from 'react';
import { Flex, Box, Image, Slide, useDisclosure } from '@chakra-ui/react';

// Components
import FreeLunch from './FreeLunch';

// Requisitions
import api from '../../services/api';

// Styles
import { SplitText } from '../../utils/animations/SplitText';
import { SplitTitle } from '../../utils/animations/SplitTitle';
import { AnimatePresence, motion } from 'framer-motion';

// Images
import rightArrow from "../../assets/icons/rightArrow.png";
import skip from "../../assets/icons/skip.png";
import colorPalette from '../../styles/colorPalette';

interface IScript {
    name: string,
    image: string,
    texts: string[],
}

type NarrativeModalProps = {
    isOpen: boolean,
    onToggle: VoidFunction,
    script: IScript[],
    narrative?: string
}

const NarrativeModal: FC<NarrativeModalProps> = ({
    isOpen,
    onToggle,
    script
}) => {

    const { isOpen: lunchIsOpen, onOpen: lunchOnOpen } = useDisclosure();

    const [delayButton, setDelayButton] = useState(true);

    const [freeCoins, setFreeCoins] = useState(0);
    const [freeStatus, setFreeStatus] = useState([0, 0, 0, 0, 0, 0, 0]);

    const [visibleText, setVisibleText] = useState(false);
    const [visibleName, setVisibleName] = useState(false);
    const [visibleImage, setVisibleImage] = useState(false);

    const [scriptImage, setScriptImage] = useState(script[0].image);
    const [scriptText, setScriptText] = useState(script[0].texts[0]);
    const [scriptName, setScriptName] = useState(script[0].name);

    const [textIndex, setTextIndex] = useState(0);
    const [scriptIndex, setScriptIndex] = useState(0);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisibleImage(!visibleImage);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [scriptImage]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisibleText(!visibleText);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [scriptText]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisibleName(!visibleName);
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

    //logic for checking and switching if first time is set to true
    const updateNarrative = async () => {
        try {
            const _userId: SetStateAction<string> | null = sessionStorage.getItem('@pionira/userId');
            const res = await api.get(`/user/${_userId}`);
            const user = res.data;
            if (user.isFirstTimeAppLaunching) { //Verifica se é a primeira vez do usuário na plataforma
                setFreeCoins(100);

                lunchOnOpen();
                await api.patch(`/user/updateFirstTime/${user._id}`, {
                    isFirstTimeAppLaunching: false,
                });
            } else if (user.narrative_status.trail1 == 1 && user.narrative_status.trail2 == 0) { //Verifica se é a primeira vez do uso em qualquer trilha                
                setFreeCoins(50);
                setFreeStatus([15, 0, 0, 0, 0, 0]);

                lunchOnOpen();
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        trail1: 2,
                        trail2: res.data.narrative_status.trail2
                    }
                });
            } else if (user.narrative_status.trail1 == 0 && user.narrative_status.trail2 == 1) { //Verifica se é a primeira vez do uso em qualquer trilha                
                setFreeCoins(50);
                setFreeStatus([15, 0, 0, 0, 0, 0]);
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        trail1: res.data.narrative_status.trail1,
                        trail2: 2
                    }
                });
            } else if (res.data.narrative_status.trail1 == 1) { //Verifica se é a primeira vez do usuário na trilha da cheetah
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        trail1: 2,
                        trail2: res.data.narrative_status.trail2
                    }
                });
            } else if (res.data.narrative_status.trail2 == 1) { //Verifica se é a primeira vez do usuário na trilha da cheetah
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        trail1: res.data.narrative_status.trail1,
                        trail2: 2
                    }
                });
            } else if (res.data.narrative_status.trail1 == 3) { //Verifica se o usuário terminou o desafio da trilha
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        trail1: 4,
                        trail2: res.data.narrative_status.trail2
                    }
                });
            }else if (res.data.narrative_status.trail2 == 3) { //Verifica se o usuário terminou o desafio da trilha
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        trail1: res.data.narrative_status.trail1,
                        trail2: 4
                    }
                });
            }
        } catch (error) {
            alert(error);
        }
    }

    const updateScript = () => {

        let nextTextIndex = textIndex + 1;

        if (nextTextIndex < script[scriptIndex].texts.length) {

            setTextIndex(nextTextIndex);

            setVisibleText((p) => {
                setScriptText(script[scriptIndex].texts[nextTextIndex]);
                return !p
            });

        } else if (scriptIndex < script.length - 1) {
            const nextScriptIndex = scriptIndex + 1;
            nextTextIndex = 0;

            setTextIndex(nextTextIndex);
            setScriptIndex(nextScriptIndex);

            setVisibleText((p) => {
                setScriptText(script[nextScriptIndex].texts[nextTextIndex]);
                return !p
            });

            setVisibleImage((p) => {
                setScriptImage(script[nextScriptIndex].image);
                return !p
            });

            setVisibleName((p) => {
                setScriptName(script[nextScriptIndex].name);
                return !p
            });
        } else {
            updateNarrative();
            onToggle();
        }
    }

    const buttonFunctions = () => {
        if (delayButton) {
            setDelayButton(!delayButton);
            updateScript();
        }
    }


    return (
        <Box>
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
                        <Image 
                            src={skip}
                            mt=".5rem"
                            _hover={{
                                cursor: 'pointer',
                                opacity: '80%'
                            }}
                            onClick={() => {
                                setTextIndex(0);
                                setScriptIndex(0);
                                setScriptText(script[0].texts[0])
                                setVisibleText(false)
                                updateNarrative();
                                onToggle();
                            }}
                            mr="1.5rem"
                            w='2rem'
                        />

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
            <FreeLunch
                isOpen={lunchIsOpen}
                coins={freeCoins}
                score={freeStatus}
            />
        </Box>
    )
}

export default NarrativeModal;
