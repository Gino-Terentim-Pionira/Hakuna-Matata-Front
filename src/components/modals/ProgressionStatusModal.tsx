import React, { useEffect, useState, useMemo } from 'react';
import {
    Stack,
    Progress,
    Text,
    Flex,
    Box,
    Center,
    Image,
    Button
} from "@chakra-ui/react"

// Components
import LoadingState from '../LoadingState';
import IgnoranceProgress from '../IgnoranceProgress';
import AlertModal from './AlertModal';

// Requisitions
import api from '../../services/api';

// Styles
import fontTheme from '../../styles/base';

// Images
import Profile from '../../assets/icons/profile.svg';
import Coins from '../../assets/icons/coinicon.svg';
import colorPalette from '../../styles/colorPalette';


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

const StatusProgressionBar = ({ status, label, isBlocked = false }: {
    status: number,
    label: string,
    isBlocked?: boolean
}) => {
    if (isBlocked) return (
        <Box fontFamily={fontTheme.fonts}>
            <Flex width='100%' justify='space-between' align='flex-end'>
                <Text fontSize='12px' color={colorPalette.textColor} >Bloqueado</Text>
                <Text fontSize="1.3rem">Icone</Text>
            </Flex>
            <Flex justify="flex-end" align="center" bg={colorPalette.grayBackground} paddingRight="8px" borderRadius="md" mt="4px" width="100%" height="32px" border="1px" borderColor="rgba(0, 0, 0, 0.31)" >
                <Text color={colorPalette.textColor} fontSize='11px'>Essa habilidade será desbloqueada ao explorar novos horizontes</Text>
            </Flex>
        </Box>
    );

    return (
        <Box fontFamily={fontTheme.fonts}> 
            <Flex width='100%' justify='space-between' align='flex-end'>
                <Text fontSize="12" align="left" color={colorPalette.primaryColor}>{status}/1200</Text>
                <Text fontSize="1.3rem">{label}</Text>
            </Flex>
            <Center borderRadius="md" padding="0 8px" mt="4px" width="100%" height="32px" border="1px" borderColor="rgba(0, 0, 0, 0.31)">
                <Progress hasStripe colorScheme="blue" width="100%" height="16px" value={status} max={1200} />
            </Center>
        </Box>
    )
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
                                    {/* <Box>
                                        <Flex width='100%' justify='space-between' align='center'>
                                            <Text fontSize="12" align="left" color={colorPalette.primaryColor}>{userData.status[0]}/1200</Text>
                                            <Text fontSize="1.3rem" fontFamily={fontTheme.fonts}>Agilidade (AGI)</Text>
                                        </Flex>
                                        <Center borderRadius="md" width="100%" height="1.5rem" border="1px" borderColor="gray.300">
                                            <Progress hasStripe colorScheme="blue" width="90%" height="0.9rem" value={userData.status[0]} max={1200} />
                                        </Center>
                                    </Box> */}
                                    <StatusProgressionBar status={userData.status[0]} label="Agilidade (AGI)" isBlocked />
                                    <Box>
                                        <Text fontSize="1.3rem" fontFamily={fontTheme.fonts}>Liderança (LID)</Text>
                                        <Text fontSize="12" align="left" color={colorPalette.primaryColor}>{userData.status[2]}/1200</Text>
                                        <Center borderRadius="md" width="100%" height="1.5rem" border="1px" borderColor="gray.300">
                                            <Progress hasStripe colorScheme="blue" width="90%" height="14px" value={userData.status[2]} max={1200} />
                                        </Center>
                                    </Box>
                                    <Box>
                                        <Text fontSize="1.3rem" height='fit-content' fontFamily={fontTheme.fonts}>Estratégia (EST)</Text>
                                        <Text fontSize="12" align="left" color={colorPalette.primaryColor}>{userData.status[4]}/1200</Text>
                                        <Center borderRadius="md" width="100%" height="1.5rem" border="1px" borderColor="gray.300">
                                            <Progress hasStripe colorScheme="blue" width="90%" height="14px" value={userData.status[4]} max={1200} />
                                        </Center>
                                    </Box>
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
                                <Text fontSize='3.5rem' width='100%' align='center' marginBottom='-2rem'>
                                    {
                                        userData ? (
                                            Math.ceil((userData.status[0] + userData.status[1] + userData.status[2] + userData.status[3] + userData.status[4] + userData.status[5]) / 6)
                                        ) : null
                                    }
                                </Text>
                            </Box>
                            <Box w="35%">
                                <Stack w="100%">
                                    {/* <Box>
                                        <Text fontSize="1.3rem" align="left" fontFamily={fontTheme.fonts}>Inovação (INO)</Text>
                                        <Text fontSize="12" align="right" color={colorPalette.primaryColor} >{userData.status[1]}/1200</Text>
                                        <Center borderRadius="md" width="100%" height="1.5rem" border="1px" borderColor="gray.300">
                                            <Progress hasStripe colorScheme="blue" width="90%" height="14px" value={userData.status[1]} max={1200} />
                                        </Center>
                                    </Box> */}
                                    <StatusProgressionBar status={userData.status[1]} label="Inovação (INO)" />
                                    <Box>
                                        <Text fontSize="1.3rem" align="left" fontFamily={fontTheme.fonts}>Gestão de mudanças (GM)</Text>
                                        <Text fontSize="12" align="right" color={colorPalette.primaryColor}>{userData.status[3]}/1200</Text>
                                        <Center borderRadius="md" width="100%" height="1.5rem" border="1px" borderColor="gray.300">
                                            <Progress hasStripe colorScheme="blue" width="90%" height="14px" value={userData.status[3]} max={1200} />
                                        </Center>
                                    </Box>
                                    <Box>
                                        <Text fontSize="1.3rem" align="left" fontFamily={fontTheme.fonts}>Gestão de projetos (GP)</Text>
                                        <Text fontSize="12" align="right" color={colorPalette.primaryColor}>{userData.status[5]}/1200</Text>
                                        <Center borderRadius="md" width="100%" height="1.5rem" border="1px" borderColor="gray.300">
                                            <Progress hasStripe colorScheme="blue" width="90%" height="14px" value={userData.status[5]} max={1200} />
                                        </Center>
                                    </Box>
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
