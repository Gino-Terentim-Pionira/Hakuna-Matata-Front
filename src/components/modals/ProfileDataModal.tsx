import React, { useState, useEffect } from 'react';
import { Text, Flex, Button, Box, Image, Center } from '@chakra-ui/react';
import { useHistory } from 'react-router';

// Components
import AlertModal from './AlertModal';
import LoadingState from '../LoadingState';

// Requisitions
import api from '../../services/api';
import moment from 'moment';

// Images
import profilePlaceholder from '../../assets/icons/profile.svg';
import colorPalette from '../../styles/colorPalette';
import Coins from '../../assets/icons/coinicon.svg'
import fontTheme from '../../styles/base';
import { errorCases } from '../../utils/errors/errorsCases';

interface userDataParams {
    userName: string,
    first_name: string,
    last_name: string,
    email: string,
    birthday_date: Date,
    contribution: string,
    coins: string,
}

const ProfileDataModal = () => {
    const [userData, setUserData] = useState<userDataParams>(Object);
    const [onError, setOnError] = useState(false);

    const history = useHistory();

    const getUser = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            const res = await api.get(`/user/${userId}`);
            res.data.birthday_date = moment(res.data.birthday_date).add(1, 'days').format('DD/MM/YYYY');
            setUserData(res.data);
            console.log(res.data)
        } catch (error) {
            setOnError(true);
        }
    }

    const gotToEditProfile = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            history.push(`/editProfile/${userId}`);
        } catch (error) {
            setOnError(true);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    const renderInfo = (infoLabel: string, infoValue: string) => (
        <Flex alignItems="center" mb="16px">
            <Text color={colorPalette.textColor} fontWeight="semibold" fontSize="24px">
                {infoLabel}:
            </Text>
            <Text ml="8px" color={colorPalette.textColor} fontSize='20px'>
                {infoValue}
            </Text>
        </Flex>
    );

    return (
        <Box fontFamily={fontTheme.fonts} display='flex' flexDirection='column' justifyContent='space-between' h='100%'>
            {
                userData.email !== undefined ? (
                    <>
                        <Flex mt="40px" ml="48px">
                            <Flex direction='column' alignItems='center'>
                                <Center borderRadius="4px" bg="#FFFEEE">
                                    <Image width="180px" src={profilePlaceholder} />
                                </Center>
                                <Button bg='white' onClick={() => gotToEditProfile()} marginTop='16px' borderRadius='50px' border='1px solid rgba(109, 153, 242, 0.79)' width='140px' height='40px' boxShadow="0 4px 4px rgba(0, 0, 0, 0.25)">
                                    <Text fontSize='1.3rem'>
                                        Editar
                                    </Text>
                                </Button>
                            </Flex>
                            <Flex direction='column' marginLeft='80px'>
                                {
                                    renderInfo("Nome de usuário", userData.userName)
                                }
                                {
                                    renderInfo("Nome completo", `${userData.first_name} ${userData.last_name}`)
                                }
                                {
                                    renderInfo("E-mail", `${userData.first_name} ${userData.last_name}`)
                                }
                                {
                                    renderInfo("Data de nascimento", `${userData.birthday_date}`)
                                }
                                <Flex alignItems="center">
                                    <Text color={colorPalette.textColor} fontWeight="semibold" fontSize="20px">
                                        Moedas:
                                    </Text>
                                    <Text ml="8px" color={colorPalette.textColor} fontSize='20px'>
                                        {userData.coins}
                                    </Text>
                                    <Image ml="4px" width="40px" alt="userCoins" src={Coins} />
                                </Flex>
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
                alertBody={errorCases.SERVER_ERROR}

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
        </Box>
    )
}

export default ProfileDataModal;