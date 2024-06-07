import React from "react";
import {Flex, Grid, Image, ModalBody, ModalHeader, Text} from "@chakra-ui/react";
import colorPalette from "../../../../styles/colorPalette";
import UserAvatar from "../../../UserAvatar";
import {imageIconsEnum} from "../../../../utils/enums/imageIconsEnum";
import {ITutorialTopic} from "../../../../services/TutorialServices";
import {IUser} from "../../../../recoil/useRecoilState";

type TutorialTopicsType = {
    tutorialTopics: ITutorialTopic[];
    userData: IUser;
    onClick: (tutorialName: string) => void
}

export const TutorialTopics = ({tutorialTopics, userData, onClick}: TutorialTopicsType) => (
    <>
        <ModalHeader
            columnGap="8px"
            paddingTop="52px"
            fontSize="24px"
            fontWeight="bold"
            color={colorPalette.textColor}
            textAlign={"center"}
        >
            Descobrindo o Pionira
        </ModalHeader>
    <ModalBody paddingTop="32px" paddingBottom="52px" paddingX="24px">
        <Grid templateColumns='repeat(2, 1fr)' gap="24px">
            {
                tutorialTopics.map(({name, icon, index}) => (
                    <Flex
                        border={`2px solid ${colorPalette.textColor}`}
                        alignItems="center"
                        borderRadius="8px"
                        bg="#FBEFC9"
                        width="100%"
                        height="60px"
                        paddingX="12px"
                        columnGap="8px"
                        key={index}
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
                                <UserAvatar customAvatar={userData.custom_avatar} avatarStyle="Transparent" width="32px" height="32px" marginBottom="4px" />
                                :
                                <Image width="32px" height="32px" src={icon || imageIconsEnum[name]} alt="Icone tutorial" />
                        }
                        <Text fontSize="14px" fontWeight="500" color={colorPalette.textColor}>{name}</Text>
                    </Flex>
                ))
            }
        </Grid>
    </ModalBody>
    </>
)