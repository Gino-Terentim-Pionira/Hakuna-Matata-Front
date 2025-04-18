import React, { ReactNode } from 'react';
import { Box, Slide, Flex, Image } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { SplitTitle } from "../../utils/animations/SplitTitle";
import { SplitText } from "../../utils/animations/SplitText";
import colorPalette from '../../styles/colorPalette';
import fontTheme from '../../styles/base';
import "./styles/SliderModal.css";

const SliderModal = ({
    isOpen,
    buttonFunctions,
    visibleImage,
    image,
    visibleName,
    title,
    visibleText,
    content,
    customComponent
}: {
    isOpen: boolean,
    buttonFunctions: VoidFunction,
    visibleImage: boolean,
    image: string,
    visibleName: boolean,
    title: string,
    visibleText: boolean,
    content: string,
    customComponent: ReactNode
}) => {
    return (
        <Box
            position="relative"
            zIndex="10000"
            fontFamily={fontTheme.fonts}
        >
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
                            >
                                <Image className="slider_modal_image" src={image} transform="rotateY(0deg)" position="absolute" zIndex="-1" bottom="0" right="0" maxHeight="40rem" />
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
                        className="slider_modal_items_container"
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
                                        {title}
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
                                    style={{overflowY: "auto"}}
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
                                        {content}
                                    </SplitText>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </Flex>
                    
                    {
                        customComponent
                    }
                </Flex>
            </Slide>
        </Box>
    )
}

export default SliderModal;
