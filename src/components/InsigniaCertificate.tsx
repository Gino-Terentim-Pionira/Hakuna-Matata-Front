import React, { useState, useEffect } from 'react';
import { Flex, Box, Tabs, TabPanels, TabPanel, Image, Grid, Text, Button } from '@chakra-ui/react';

// Components
import Insignia from '../components/Insignia';
import AlertModal from './modals/AlertModal';
import LoadingState from './LoadingState';

// Requisitions
import api from '../services/api';

// Images
import insigniaCheetahSillouete from '../assets/icons/insignia/cheetaInsigniaSillouete.png';
import insigniaMambaSillouete from '../assets/icons/insignia/mambaInsigniaSillouete.png';
import insigniaLionSillouete from '../assets/icons/insignia/lionInsigniaSillouete.png';
import colorPalette from '../styles/colorPalette';
import { errorCases } from '../utils/errors/errorsCases';

interface IUser {
    _id: string;
    userName: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    birthday_date: string;
    is_confirmed: boolean;
    status: [number];
    coins: number;
    contribution: number;
    certificates: [{
        certificate_id: string,
        certificate_url: string
    }]
}

const InsigniaCertificate = () => {
    const [insignias, setInsignias] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [user, setUser] = useState<IUser>({} as IUser);
    const [onError, setOnError] = useState(false);

    // Pega as informações das insignias

    const getInsignias = async () => {
        try {
            const res = await api.get('/insignias/');
            setInsignias(res.data);
        } catch (error) {
            setOnError(true);
        }
    }

    // Pega as informações dos certificados

    const getCertificates = async () => {
        try {
            console.log(certificates)
            const res = await api.get('/certificate/');
            setCertificates(res.data);
        } catch (error) {
            setOnError(true);
        }
    }

    // Pega as informações do usuário logado

    const getUser = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId')
            const res = await api.get(`/user/${userId}`);
            setUser(res.data);
        } catch (error) {
            setOnError(true);
        }
    }

    // Funcionalidades da descrição da insignia

    useEffect(() => {
        getInsignias();
        getCertificates();
        getUser();
    }, []);

    return (
        <Flex h='100%' w='100%' flexDirection='column' justifyContent='space-between' alignItems='center' >
            {
                insignias.length > 0 ? (
                    <>
                        <Tabs h='100%' w='100%' marginBottom='0.5rem' align='center' size='lg' >
                            <TabPanels h='85%' padding='0'>
                                <TabPanel h='100%' paddingTop='0' paddingBottom='0'>
                                    <Box w='100%' h='100%' overflowY='auto'>
                                        <Grid templateColumns='25% 25% 25%' columnGap='12.5%' width='95%' mt='1rem' h='95%' >
                                            {
                                                insignias.map(({ _id, trail, user_id, name, description }: {
                                                    user_id: Array<string>
                                                    _id: string,
                                                    name: string,
                                                    trail: string,
                                                    description: string,
                                                    image: string,
                                                    imageSillouete: string,
                                                }) => {
                                                    return (
                                                        user_id.includes(user._id) ? (
                                                            <Insignia _id={_id} trail={trail} name={name} description={description} />
                                                        ) : (
                                                            <Box
                                                                marginTop='1rem'
                                                                maxW='14rem'
                                                                h='11rem'
                                                                display='flex'
                                                                flexDirection='column'
                                                                justifyContent='space-between'
                                                                alignItems='center'
                                                                key={_id}
                                                                _hover={{
                                                                    cursor: 'help'
                                                                }}
                                                            >
                                                                <Image
                                                                    boxSize='8rem'
                                                                    src={
                                                                        trail === 'Trilha 1' ? insigniaCheetahSillouete : (
                                                                            trail === 'Trilha 3' ? insigniaMambaSillouete : insigniaLionSillouete
                                                                        )
                                                                    }
                                                                />
                                                                <Text
                                                                    fontSize='1.2rem'
                                                                    fontWeight='bold'
                                                                    marginTop='1rem'
                                                                    marginBottom='1rem'
                                                                >???</Text>
                                                            </ Box>
                                                        )
                                                    )
                                                })
                                            }
                                        </Grid>
                                    </Box>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
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
        </Flex>
    );
}

export default InsigniaCertificate;