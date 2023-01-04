import React, { useState, useEffect, useMemo } from 'react';
import { Text, Flex, Button, Box, Image } from '@chakra-ui/react';
import { useHistory } from 'react-router';

// Components
import AlertModal from './AlertModal';
import LoadingState from '../LoadingState';

// Requisitions
import api from '../../services/api';
import moment from 'moment';

// Images
import profilePlaceholder from '../../assets/icons/profilePlaceholder.png';
import colorPalette from '../../styles/colorPalette';

interface userDataParams {
    userName: string,
    first_name: string,
    last_name: string,
    email: string,
    birthday_date: Date,
    contribution: string,
}

const ProfileDataModal = () => {
    const [userData, setUserData] = useState<userDataParams>(Object);
    const [userPhoto, setUserPhoto] = useState(null);
    const [onError, setOnError] = useState(false);

    const preview = useMemo(() => {
        try {
            return userPhoto ? URL.createObjectURL(userPhoto) : userPhoto ? userPhoto : null;
        } catch (error) {
            return userPhoto ? userPhoto : null
        }
    }, [userPhoto]);

    const history = useHistory();

    const getUser = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            const res = await api.get(`/user/${userId}`);
            res.data.birthday_date = moment(res.data.birthday_date).add(1, 'days').format('DD/MM/YYYY');
            setUserData(res.data);
            setUserPhoto(res.data?.profileImage?.url);
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


    return (
        <Box display='flex' flexDirection='column' justifyContent='space-between' h='100%'>
            {
                userData.email !== undefined ? (
                    <>
                        <Flex>
                            <Flex direction='column' w='33%' marginTop='3rem' alignItems='center'>

                                {userPhoto ? (
                                    <label id="photo"
                                        style={{ marginLeft: '2rem', backgroundImage: `url(${preview})`, width: "160px", height: "160px", backgroundSize: "cover", display: "flex", borderRadius: "50%", marginTop: "-1rem", marginBottom: '0.5rem', backgroundPositionX: 'center' }}
                                    >
                                    </label>
                                ) : (
                                    <Image src={profilePlaceholder} marginBottom='1rem' marginLeft='2rem' />
                                )
                                }
                                <Button bg='white' onClick={() => gotToEditProfile()} marginLeft='2rem' marginTop='0.4rem' borderRadius='50px' border='1px solid rgba(109, 153, 242, 0.79)' width='50%' minWidth='7rem' height='2.5rem' boxShadow="0 4px 4px rgba(0, 0, 0, 0.25)">
                                    <Text fontSize='1.3rem'>
                                        Editar
                                    </Text>
                                </Button>
                            </Flex>
                            <Flex direction='column' marginTop='1rem' marginLeft='6rem'>
                                <Text fontSize='2rem'>
                                    {userData.userName}
                                </Text>
                                <Text fontSize='1.4rem' >
                                    {`${userData.first_name} ${userData.last_name}`}
                                </Text>
                                <Text fontSize='1.6rem' marginTop='0.5rem'>
                                    {userData.email}
                                </Text>
                                <Text fontSize='2rem' marginTop='0.5rem'>
                                    Data de Nascimento:
                                </Text>
                                <Text fontSize='1.5rem' >
                                    {userData.birthday_date}
                                </Text>
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
        </Box>
    )
}

export default ProfileDataModal;