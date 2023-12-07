import React, { useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Box,
    ModalBody,
    ModalCloseButton,
    Button,
    Center,
    Select,
} from "@chakra-ui/react";
import { hairOptions, hairColor } from '../../utils/avatar/hairUtils';
import colorPalette from "../../styles/colorPalette";
import { IUser } from "../../recoil/useRecoilState";
import { facialHairOptions } from "../../utils/avatar/facialHairUtils";
import { clothesOptions } from "../../utils/avatar/clothesUtils";
import { eyesOptions, eyesBrowOptions, mouthOptions, skinOptions } from "../../utils/avatar/faceUtils";
import { SAVE } from "../../utils/constants/buttonConstants";
import UserAvatar from "../UserAvatar";

interface ProfileAvatarModalInterface {
    isOpen: boolean;
    onClose: VoidFunction;
    userData: IUser
    isLoading: boolean;
    sendEditAvatar: (custom_avatar: { hair: string; hair_color: string; facial_hair: string; clothes: string; eyes: string; eyebrow: string; mouth: string; skin: string; }) => Promise<void>;
}

const ProfileAvatarModal = ({ isOpen, onClose, userData, isLoading, sendEditAvatar }: ProfileAvatarModalInterface) => {
    const { custom_avatar } = userData;
    const [avatar, setAvatar] = useState(custom_avatar);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent height="80%" maxH="600px" position="relative">
                <Box w="100%" bg={colorPalette.primaryColor} h="124px" position="absolute" zIndex='0' left="0" top="0" borderTopRadius="4px" />
                <Center zIndex={10} position="absolute" left="31%" top="16px">
                    <UserAvatar customAvatar={avatar} />
                </Center>
                <ModalHeader margin-top='1rem'>
                    <ModalCloseButton size="lg" color={colorPalette.alertText} />
                </ModalHeader>

                <ModalBody display="flex" flexDir="column" alignItems="center" marginTop="100px" overflowY="auto">
                    <Select
                        marginTop="50px"
                        value={avatar.hair} onChange={(e) => setAvatar({ ...avatar, hair: e.target.value })}
                        height="36px"
                        color={colorPalette.textColor}
                        borderColor={colorPalette.secundaryGrey}
                    >
                        {
                            hairOptions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)
                        }
                    </Select>
                    <Select
                        value={avatar.hair_color} onChange={(e) => setAvatar({ ...avatar, hair_color: e.target.value })}
                        marginTop="16px"
                        height="36px"
                        color={colorPalette.textColor}
                        borderColor={colorPalette.secundaryGrey}
                    >
                        {
                            hairColor.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)
                        }
                    </Select>
                    <Select
                        value={avatar.facial_hair} onChange={(e) => setAvatar({ ...avatar, facial_hair: e.target.value })}
                        marginTop="16px"
                        height="36px"
                        color={colorPalette.textColor}
                        borderColor={colorPalette.secundaryGrey}
                    >
                        {
                            facialHairOptions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)
                        }
                    </Select>
                    <Select
                        value={avatar.clothes} onChange={(e) => setAvatar({ ...avatar, clothes: e.target.value })}
                        marginTop="16px"
                        height="36px"
                        color={colorPalette.textColor}
                        borderColor={colorPalette.secundaryGrey}
                    >
                        {
                            clothesOptions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)
                        }
                    </Select>
                    <Select
                        value={avatar.eyes} onChange={(e) => setAvatar({ ...avatar, eyes: e.target.value })}
                        marginTop="16px"
                        height="36px"
                        color={colorPalette.textColor}
                        borderColor={colorPalette.secundaryGrey}
                    >
                        {
                            eyesOptions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)
                        }
                    </Select>
                    <Select
                        value={avatar.eyebrow} onChange={(e) => setAvatar({ ...avatar, eyebrow: e.target.value })}
                        marginTop="16px"
                        height="36px"
                        color={colorPalette.textColor}
                        borderColor={colorPalette.secundaryGrey}
                    >
                        {
                            eyesBrowOptions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)
                        }
                    </Select>
                    <Select
                        value={avatar.mouth} onChange={(e) => setAvatar({ ...avatar, mouth: e.target.value })}
                        marginTop="16px"
                        height="36px"
                        color={colorPalette.textColor}
                        borderColor={colorPalette.secundaryGrey}
                    >
                        {
                            mouthOptions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)
                        }
                    </Select>

                    <Select
                        value={avatar.skin} onChange={(e) => setAvatar({ ...avatar, skin: e.target.value })}
                        marginTop="16px"
                        height="36px"
                        color={colorPalette.textColor}
                        borderColor={colorPalette.secundaryGrey}
                    >
                        {
                            skinOptions.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)
                        }
                    </Select>

                    <Button
                        display="flex"
                        color='white'
                        bg={colorPalette.primaryColor}
                        onClick={() => sendEditAvatar(avatar)}
                        width="304px"
                        fontSize="16px"
                        minHeight="46px"
                        marginTop="24px"
                        marginBottom="24px"
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        {SAVE}
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ProfileAvatarModal;
