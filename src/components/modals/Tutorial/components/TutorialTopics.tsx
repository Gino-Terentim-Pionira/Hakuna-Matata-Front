import React from "react";
import {Flex, Grid, Image, ModalBody, ModalHeader, Text} from "@chakra-ui/react";
import colorPalette from "../../../../styles/colorPalette";
import UserAvatar from "../../../UserAvatar";
import {imageIconsEnum} from "../../../../utils/enums/imageIconsEnum";
import {ITutorialTopic} from "../../../../services/TutorialServices";
import {IUser} from "../../../../recoil/useRecoilState";
import { motion } from "framer-motion";

type TutorialTopicsType = {
    tutorialTopics: ITutorialTopic[];
    userData: IUser;
    onClick: (tutorialName: string) => void
}

export const TutorialTopics = ({tutorialTopics, userData, onClick}: TutorialTopicsType) => {
    const defaultVariant = {
        hidden: { opacity: 0, x: '100%' },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <>
            <ModalHeader
                columnGap="8px"
                paddingTop="52px"
                fontSize="24px"
                fontWeight="bold"
                color={colorPalette.textColor}
                textAlign={"center"}
            >
                Descobrindo a Pionira
            </ModalHeader>
            <ModalBody paddingTop="32px" paddingBottom="52px" paddingX="24px"
                sx={{
                    "&::-webkit-scrollbar": {
                        width:"4px",
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
                        width:"4px",
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
                <motion.div initial="hidden" animate="visible" variants={defaultVariant} transition={{duration: 0.5}}>
                    <Grid templateColumns='repeat(2, 1fr)' gap="24px">
                        {
                            tutorialTopics.map(({name, icon}) => (
                                <Flex
                                    border={`2px solid ${colorPalette.textColor}`}
                                    alignItems="center"
                                    borderRadius="8px"
                                    bg="#FBEFC9"
                                    width="100%"
                                    height="60px"
                                    paddingX="12px"
                                    columnGap="8px"
                                    key={name}
                                    transition='all 200ms ease'
                                    onClick={() => onClick(name)}
                                    _hover={{
                                        cursor: "pointer",
                                        transform: 'scale(1.05)'
                                    }}
                                    _active={{
                                        transform: 'scale(1.0)'
                                    }}
                                >
                                    {
                                        name === 'Perfil de usuário' ?
                                            <UserAvatar customAvatar={userData.custom_avatar} avatarStyle="Transparent"
                                                        width="32px" height="32px" marginBottom="4px"/>
                                            :
                                            <Image width="32px" height="32px" src={icon || imageIconsEnum[name]}
                                                   alt="Icone tutorial"/>
                                    }
                                    <Text fontSize="14px" fontWeight="500" color={colorPalette.textColor}>{name}</Text>
                                </Flex>
                            ))
                        }
                    </Grid>
                </motion.div>
            </ModalBody>
        </>
    )
}