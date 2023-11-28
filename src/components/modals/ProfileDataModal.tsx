import React, { useState, BaseSyntheticEvent } from 'react';
import { Text, Flex, Button, Box, Image, Center, Input } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import moment from 'moment';
import { motion } from "framer-motion"
import { useUser } from '../../hooks';
import Avatar from 'avataaars';
import api from '../../services/api';

// Components
import LoadingState from '../LoadingState';

// Images
import colorPalette from '../../styles/colorPalette';
import Coins from '../../assets/icons/coinicon.svg'
import fontTheme from '../../styles/base';
import { editProfileErrorCases, errorCases } from '../../utils/errors/errorsCases';
import AlertModal from './AlertModal';
import { GENERIC_MODAL_TEXT } from '../../utils/constants/buttonConstants';

const ProfileDataModal = () => {
    const { userData, setUserData } = useUser();
    const [userDataMirror, setUserDataMirror] = useState({
        userName: userData.userName,
        fullName: `${userData.first_name} ${userData.last_name}`,
        birthday_date: userData.birthday_date
    });
    const [showEditAvatar, setShowEditAvatar] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alertModalInfo, setAlertModalInfo] = useState({
        isOpen: false,
        onClose: () => console.log(),
        alertTitle: '',
        alertBody: '',
        buttonOnClick: () => console.log(),
        buttonLabel: '',
    });

    const AnimatedCenter = motion(Center);

    const onClose = () => {
        setAlertModalInfo({
            ...alertModalInfo,
            isOpen: false
        });
    };

    const history = useHistory();

    const verifyErrorType = (erroType: string) => {
        const ERROR_TYPES: {
            [key: string]: {
                onClose: VoidFunction,
                alertTitle: string,
                alertBody: string,
                buttonOnClick: VoidFunction,
                buttonLabel: string,
            }
        } = {
            'SUCCES_CASE_EDIT': {
                alertTitle: 'Editar perfil',
                alertBody: editProfileErrorCases.SUCCES_CASE_EDIT,
                buttonOnClick: onClose,
                onClose: () => history.push('/mainPage'),
                buttonLabel: GENERIC_MODAL_TEXT
            },
            'IMAGE_FORMAT_ERROR': {
                alertTitle: 'Editar perfil - Ops!',
                alertBody: editProfileErrorCases.IMAGE_FORMAT_ERROR,
                buttonOnClick: onClose,
                onClose: onClose,
                buttonLabel: 'Tentar novamente'
            },
            'SERVER_SENDING_IMAGE_ERROR': {
                alertTitle: 'Editar perfil - Ops!',
                alertBody: editProfileErrorCases.SERVER_SENDING_IMAGE_ERROR,
                buttonOnClick: onClose,
                onClose: onClose,
                buttonLabel: 'Tentar novamente'
            },
            'SERVER_EDIT_ERRORS': {
                alertTitle: 'Editar perfil - Ops!',
                alertBody: editProfileErrorCases[erroType],
                buttonOnClick: onClose,
                onClose: onClose,
                buttonLabel: 'Tentar novamente'
            },
            'SERVER_ERROR': {
                alertTitle: 'Ops!',
                alertBody: errorCases.SERVER_ERROR,
                buttonOnClick: () => window.location.reload(),
                onClose: () => window.location.reload(),
                buttonLabel: 'Recarregar',
            }
        };
        switch (erroType) {
            case 'SUCCES_CASE_EDIT':
                handleAlertModal(ERROR_TYPES[erroType]);
                return
            case 'IMAGE_FORMAT_ERROR':
                handleAlertModal(ERROR_TYPES[erroType]);
                return
            case 'SERVER_SENDING_IMAGE_ERROR':
                handleAlertModal(ERROR_TYPES[erroType]);
                return
            case 'SERVER_ERROR':
                handleAlertModal(ERROR_TYPES[erroType]);
                return
            default:
                handleAlertModal(ERROR_TYPES['SERVER_EDIT_ERRORS']);
                return
        }
    };

    const handleAlertModal = (errorObject: {
        onClose: VoidFunction,
        alertTitle: string,
        alertBody: string,
        buttonOnClick: VoidFunction,
        buttonLabel: string,
    }) => {
        const { alertTitle, alertBody, onClose, buttonLabel, buttonOnClick } = errorObject
        setAlertModalInfo({
            ...alertModalInfo,
            isOpen: !alertModalInfo.isOpen,
            alertTitle,
            alertBody,
            onClose,
            buttonLabel,
            buttonOnClick
        })
    }

    const editButton = async () => {
        if (isEditMode) {
            try {
                const { userName, birthday_date } = userDataMirror;
                const name = userDataMirror.fullName.split(' ');
                let lastName = name[1];

                if (name.length > 2) {
                    for (let i = 2; i < name.length; i++) {
                        lastName = lastName + " " + name[i];
                    }
                }
                setIsLoading(true);
                await api.patch(`/user/edit/${userData._id}`, {
                    userName,
                    birthday_date,
                    first_name: name[0],
                    last_name: lastName
                });
                setUserData({
                    ...userData,
                    userName,
                    birthday_date,
                    first_name: name[0],
                    last_name: lastName
                });
                verifyErrorType('SUCCES_CASE_EDIT');
            } catch (error) {
                verifyErrorType(error.response.data.message);
                setUserDataMirror({
                    userName: userData.userName,
                    fullName: `${userData.first_name} ${userData.last_name}`,
                    birthday_date: userData.birthday_date
                })
            }
            setIsLoading(false);
            setIsEditMode(false);
        } else {
            setIsEditMode(true);
        }
    }

    const handleEditInfo = (e: BaseSyntheticEvent, value: 'userName' | 'birthday_date' | 'fullName') => {
        setUserDataMirror({
            ...userDataMirror,
            [value]: e.target.value
        })
        // if (value === 'fullName') {
        //     setFullName(e.target.value);
        // } else
        //     setUserData({
        //         ...userData,
        //         [value]: e.target.value
        //     })
    }
    const renderInfo = () => {
        const birthday_date = userDataMirror.birthday_date.split("T")[0];
        const infoArray = [{
            infoLabel: "Nome de usuário",
            infoValue: userDataMirror.userName,
            onChange: (e: BaseSyntheticEvent) => handleEditInfo(e, 'userName'),
        }, {
            infoLabel: "Nome completo",
            infoValue: userDataMirror.fullName,
            onChange: (e: BaseSyntheticEvent) => handleEditInfo(e, 'fullName')
        }, {
            infoLabel: "E-mail",
            infoValue: userData.email,
        }, {
            infoLabel: "Data de nascimento",
            infoValue: isEditMode ? birthday_date : `${moment(birthday_date).format('DD/MM/YYYY')}`,
            onChange: (e: BaseSyntheticEvent) => handleEditInfo(e, 'birthday_date'),
            type: 'date'
        }];

        return infoArray.map((item, index) =>
            <Flex key={index} alignItems="center" mb="16px">
                <Text color={colorPalette.textColor} fontWeight="semibold" fontSize={{ xl: "24px", lg: "24px", md: "18px", sm: "18px" }}>
                    {item.infoLabel}:
                </Text>
                {
                    isEditMode && item.onChange ?
                        <Input
                            width="fit-content"
                            ml="8px"
                            minWidth="200px"
                            height="32px"
                            color={colorPalette.textColor}
                            borderColor={colorPalette.secundaryGrey}
                            placeholder={item.infoValue}
                            value={item.infoValue}
                            onChange={item.onChange}
                            type={item.type || "text"}
                        /> :
                        <Text ml="8px" color={colorPalette.textColor} fontSize='20px'>
                            {item.infoValue}
                        </Text>
                }
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
                                <Center borderRadius="4px" bg="#FFFEEE" position="relative" onMouseEnter={() => setShowEditAvatar(true)}>
                                    {
                                        showEditAvatar &&
                                        <AnimatedCenter initial={{ opacity: 0, background: 'transparent' }} exit={{ opacity: 0 }} animate={{ opacity: 1, background: colorPalette.textColor }} transition={{ duration: 0.3 }} animation="step-start" borderRadius="8px" position="absolute" width="100%" height="100%" background={colorPalette.textColor} _hover={{ cursor: "pointer" }} onMouseLeave={() => setShowEditAvatar(false)} >
                                            <Text fontFamily={fontTheme.fonts} fontSize="18px" color={colorPalette.slideBackground}>Editar avatar</Text>
                                        </AnimatedCenter>
                                    }
                                    <Avatar
                                        avatarStyle='Circle'
                                        topType={userData.custom_avatar.hair}
                                        accessoriesType='Blank'
                                        hairColor={userData.custom_avatar.hair_color}
                                        facialHairType={userData.custom_avatar.facial_hair}
                                        clotheType={userData.custom_avatar.clothes}
                                        eyeType={userData.custom_avatar.eyes}
                                        eyebrowType={userData.custom_avatar.eyebrow}
                                        mouthType={userData.custom_avatar.mouth}
                                        skinColor={userData.custom_avatar.skin}
                                        style={{
                                            width: "178px",
                                            height: "178px"
                                        }}
                                    />
                                </Center>
                                <Button bg='white' isLoading={isLoading} onClick={editButton} marginTop='16px' borderRadius='50px' border='1px solid rgba(109, 153, 242, 0.79)' width='140px' height='40px' boxShadow="0 4px 4px rgba(0, 0, 0, 0.25)">
                                    <Text color={colorPalette.textColor} fontSize='1.3rem'>
                                        {isEditMode ? "Salvar" : "Editar"}
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
            <AlertModal
                isOpen={alertModalInfo.isOpen}
                onClose={alertModalInfo.onClose}
                alertTitle={alertModalInfo.alertTitle}
                alertBody={alertModalInfo.alertBody}

                buttonBody={
                    <Button
                        color='white'
                        bg={colorPalette.primaryColor}
                        onClick={alertModalInfo.buttonOnClick}
                    >
                        {alertModalInfo.buttonLabel}
                    </Button>
                }
            />
        </Box>
    )
}

export default ProfileDataModal;
