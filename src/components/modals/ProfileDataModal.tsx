import React from 'react';
import { Text, Flex, Button, Box, Image, Center } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import moment from 'moment';
import { useUser } from '../../hooks';

// Components
import LoadingState from '../LoadingState';

// Images
import profilePlaceholder from '../../assets/icons/profile.svg';
import colorPalette from '../../styles/colorPalette';
import Coins from '../../assets/icons/coinicon.svg'
import fontTheme from '../../styles/base';

const ProfileDataModal = () => {
    const { userData } = useUser();

    const history = useHistory();

    const gotToEditProfile = async () => {
        const userId = sessionStorage.getItem('@pionira/userId');
        history.push(`/editProfile/${userId}`);
    }

    const renderInfo = () => {
        const infoArray = [{
            infoLabel: "Nome de usuário",
            infoValue: userData.userName,
        }, {
            infoLabel: "Nome completo",
            infoValue: `${userData.first_name} ${userData.last_name}`,
        }, {
            infoLabel: "E-mail",
            infoValue: userData.email,
        }, {
            infoLabel: "Data de nascimento",
            infoValue: `${moment(userData.birthday_date).add(1, 'days').format('DD/MM/YYYY')}`
        }];

        return infoArray.map((item, index) =>
            <Flex key={index} alignItems="center" mb="16px">
                <Text color={colorPalette.textColor} fontWeight="semibold" fontSize="24px">
                    {item.infoLabel}:
                </Text>
                <Text ml="8px" color={colorPalette.textColor} fontSize='20px'>
                    {item.infoValue}
                </Text>
            </Flex>
        )
    }

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
                                    renderInfo()
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
        </Box>
    )
}

export default ProfileDataModal;
