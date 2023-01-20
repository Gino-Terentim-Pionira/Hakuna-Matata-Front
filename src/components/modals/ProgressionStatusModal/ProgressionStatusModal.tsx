import React, { useEffect, useState, useMemo } from 'react';
import {
    Stack,
    Text,
    Flex,
    Box,
    Image,
    Button
} from "@chakra-ui/react"

// Components
import LoadingState from '../../LoadingState';
import IgnoranceProgress from '../../IgnoranceProgress';
import AlertModal from '../AlertModal';
import StatusProgressionBar from './StatusProgressionBar';

// Requisitions
import api from '../../../services/api';

// Styles
import fontTheme from '../../../styles/base';

// Images
import Profile from '../../../assets/icons/profile.svg';
import Coins from '../../../assets/icons/coinicon.svg';
import colorPalette from '../../../styles/colorPalette';


interface IUser {
    _id: string;
    userName: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    birthday_date: string;
    is_confirmed: boolean;
    status: number[];
    coins: number;
    contribution: number;
    first_certificate: string;
    second_certificate: string;
    ignorance: number;
}


const ProgressionStatusModal = () => {
    const [userData, setUserData] = useState<IUser>({} as IUser);
    const [userPhoto, setUserPhoto] = useState(null);
    const [onError, setOnError] = useState(false);

    const preview = useMemo(() => {
        try {
            return userPhoto ? URL.createObjectURL(userPhoto) : userPhoto ? userPhoto : null;
        } catch (error) {
            return userPhoto ? userPhoto : null
        }
    }, [userPhoto]);

    const handleData = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId')
            const user = await api.get(`/user/${userId}`);
            setUserData(user.data);
            if (user.data.profileImage !== undefined)
                setUserPhoto(user.data.profileImage.url);
        } catch (error) {
            setOnError(true);
        }
    };

    useEffect(() => {
        handleData();
    }, []);

    return (
        <Flex h="100%" w="100%" flexDirection="column" alignItems="center" justifyContent="space-evenly">
            {
                userData.status !== undefined ? (
                    <>
                        <Flex w="95%" flexDirection="row" marginTop='1.2rem' alignItems="flex-end" justifyContent="space-between">
                            <Box w="35%" align="right">
                                <Stack w="100%">
                                    <StatusProgressionBar status={userData.status[0]} label="Agilidade (AGI)" isOnLeft />
                                    <StatusProgressionBar status={userData.status[1]} marginTop="4px" label="Inovação (INO)" isOnLeft isBlocked/>
                                    <StatusProgressionBar status={userData.status[4]} marginTop="4px" label="Estratégia (EST)" isOnLeft isBlocked />
                                </Stack>
                            </Box>
                            <Box display='flex' flexDirection='column' alignItems='center'>
                                {userPhoto ? (
                                    <label id="photo"
                                        style={{ backgroundImage: `url(${preview})`, width: "160px", height: "160px", backgroundSize: "cover", display: "flex", borderRadius: "50%", backgroundPositionX: 'center' }}
                                    >
                                    </label>
                                ) : (

                                    <Image src={Profile} marginBottom='1.2rem' />
                                )
                                }
                                <Text fontSize='3.5rem' fontFamily={fontTheme.fonts} width='100%' align='center' marginBottom='-2rem'>
                                    {
                                        userData ? (
                                            Math.ceil((userData.status[0] + userData.status[1] + userData.status[2] + userData.status[3] + userData.status[4] + userData.status[5]) / 6)
                                        ) : null
                                    }
                                </Text>
                            </Box>
                            <Box w="35%">
                                <Stack w="100%">
                                    <StatusProgressionBar status={userData.status[2]} label="Liderança (LID)"  />
                                    <StatusProgressionBar status={userData.status[3]} isBlocked marginTop="4px" label="Gestão de mudanças (GM)"/>
                                    <StatusProgressionBar status={userData.status[5]} isBlocked marginTop="4px" label="Gestão de projetos (GP)"/>
                                </Stack>
                            </Box>
                        </Flex>
                        <Flex w="90%" h="25%" flexDirection="row" justifyContent="space-between" alignItems="flex-end" marginBottom='1rem' >
                            <IgnoranceProgress fontSize='1.3rem' marginTop='0' size='4.5rem' ignorance={userData.ignorance} position='relative' />
                            <Flex>
                                <Text fontSize="1.8rem" fontWeight="normal" fontFamily={fontTheme.fonts} marginRight="1.5rem">{userData.coins}</Text>
                                <Image src={Coins} />
                            </Flex>
                        </Flex>
                    </>
                ) : (
                    <LoadingState />
                )
            }
            <AlertModal
                isOpen={onError}
                onClose={() => window.location.reload()}
                alertTitle='Ops!'
                alertBody='Parece que ocorreu um erro durante a nossa viagem, Jovem! tente recarregar!'

                buttonBody={
                    <Button
                        color='white'
                        bg={colorPalette.primaryColor}
                        onClick={() => window.location.reload()}
                    >
                        Recarregar
                    </Button>
                }
            />
        </Flex>

    )
}

export default ProgressionStatusModal;
