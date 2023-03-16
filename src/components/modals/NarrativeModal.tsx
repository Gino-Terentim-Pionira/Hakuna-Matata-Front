import React, { FC, useState, useEffect, SetStateAction } from 'react';
import { Flex, Box, Image, Slide, useDisclosure, Text } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useUser } from '../../hooks';

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
import colorPalette from '../../styles/colorPalette';
import fontTheme from '../../styles/base';

interface IScript {
    name: string,
    image: string,
    texts: string[],
}

type NarrativeModalProps = {
    isOpen: boolean,
    onToggle: VoidFunction,
    script: IScript[],
    narrative?: 'cheetah' | 'lion' | undefined
}

const NarrativeModal: FC<NarrativeModalProps> = ({
    isOpen,
    onToggle,
    script,
    narrative
}) => {
    const history = useHistory();
    const { userData, setUserData, getNewUserInfo } = useUser();
    const { isOpen: lunchIsOpen, onOpen: lunchOnOpen, onClose: lunchOnClose } = useDisclosure();

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

    //logic for checking and switching if first time is set to true
    const updateNarrative = async () => {
        try {
            let user;
            const _userId: SetStateAction<string> | null = sessionStorage.getItem('@pionira/userId');
            if(!userData._id) {
                const res = await api.get(`/user/${_userId}`);
                user = res.data;
                setUserData(res.data);
            } else user = userData;

            if (user.isFirstTimeAppLaunching) { //Verifica se é a primeira vez do usuário na plataforma
                setFreeCoins(100);
                lunchOnOpen();
                await api.patch(`/user/updateFirstTime/${user._id}`, {
                    isFirstTimeAppLaunching: false,
                });
            } else if (user.narrative_status.trail1 === 0 && user.narrative_status.trail2 === 0) { //Verifica se é a primeira vez do uso em qualquer trilha                
                setFreeCoins(50);
                lunchOnOpen();
                if (narrative === 'cheetah') {
                    console.log('CHAMOU A CHEETAH PATH')
                    setFreeStatus([15, 0, 0, 0, 0, 0]);
                    await api.patch(`/user/narrative/${_userId}`, {
                        narrative_status: {
                            ...user.narrative_status,
                            trail1: 2
                        }
                    });
                } else if (narrative === 'lion') {
                    console.log('CHAMOU O LION PATH')
                    setFreeStatus([0, 15, 0, 0, 0, 0]);
                    await api.patch(`/user/narrative/${_userId}`, {
                        narrative_status: {
                            ...user.narrative_status,
                            trail2: 2
                        }
                    });
                }
                await getNewUserInfo();
            } else if (user.narrative_status.trail1 == 0) { //Verifica se é a primeira vez do usuário na trilha da cheetah
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        ...user.narrative_status,
                        trail1: 2
                    }
                });
                await getNewUserInfo();
                history.go(0);
            } else if (user.narrative_status.trail2 == 0) { //Verifica se é a primeira vez do usuário na trilha do leao e da leoa
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        ...user.narrative_status,
                        trail2: 2
                    }
                });
                await getNewUserInfo();
                history.go(0);
            } else if (user.narrative_status.trail1 == 3) { //Verifica se o usuário terminou o desafio da trilha
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        ...user.narrative_status,
                        trail1: 4
                    }
                });
            } else if (user.narrative_status.trail2 == 3) { //Verifica se o usuário terminou o desafio da trilha
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        ...user.narrative_status,
                        trail2: 4
                    }
                });
            }
            onToggle();
        } catch (error) {
            alert(error);
        }
    }

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
            updateNarrative();
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
                        <Text
                            mt=".5rem"
                            _hover={{
                                cursor: 'pointer',
                                opacity: '80%'
                            }}
                            onClick={() => {
                                updateNarrative();
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
            <FreeLunch
                isOpen={lunchIsOpen}
                coins={freeCoins}
                score={freeStatus}
                onClose={() => { lunchOnClose() }}
            />
        </Box>
    )
}

export default NarrativeModal;
