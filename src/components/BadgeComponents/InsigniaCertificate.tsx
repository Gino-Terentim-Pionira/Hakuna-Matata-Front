import React from 'react';
import { Flex, Box, Tabs, TabPanels, TabPanel, Image, Grid, Text, Tooltip } from '@chakra-ui/react';
import { useUser } from '../../hooks';

// Components
import Insignia from './Insignia';
import LoadingState from '../LoadingState';

// Images
import insigniaCheetahSillouete from '../../assets/icons/insignia/cheetaInsigniaSillouete.png';
import insigniaMambaSillouete from '../../assets/icons/insignia/mambaInsigniaSillouete.png';
import insigniaLionSillouete from '../../assets/icons/insignia/lionInsigniaSillouete.png';
import useInsignias from '../../hooks/useInsignias';
import { LOCKED_BADGE } from '../../utils/constants/mouseOverConstants';

const InsigniaCertificate = () => {
    const { insigniasData } = useInsignias();
    const { userData } = useUser();

    // Pega as informações das insigniasData

    // Pega as informações dos certificados
    // const getCertificates = async () => {
    //     try {
    //         const res = await api.get('/certificate/');
    //         setCertificates(res.data);
    //     } catch (error) {
    //         setOnError(true);
    //     }
    // }

    return (
        <Flex h='100%' w='100%' flexDirection='column' justifyContent='space-between' alignItems='center' >
            {
                insigniasData.length > 0 ? (
                    <>
                        <Tabs h='100%' w='100%' marginBottom='0.5rem' align='center' size='lg' >
                            <TabPanels h='85%' padding='0'>
                                <TabPanel h='100%' paddingTop='0' paddingBottom='0'>
                                    <Box w='100%' h='100%' overflowY='auto'>
                                        <Grid templateColumns='25% 25% 25%' columnGap='12.5%' width='95%' mt='1rem' h='95%' >
                                            {
                                                insigniasData.map(({ _id, trail, name, description }: {
                                                    user_id: Array<string>
                                                    _id: string,
                                                    name: string,
                                                    trail: string,
                                                    description: string,
                                                    image: string,
                                                    imageSillouete: string,
                                                }) => {
                                                    return (
                                                        userData.insignias_id.includes(_id) ? (
                                                            <Insignia key={_id} _id={_id} trail={trail} name={name} description={description} />
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
                                                                <Tooltip
                                                                    hasArrow
                                                                    placement='top'
                                                                    gutter={10}
                                                                    label={LOCKED_BADGE}
                                                                >
                                                                    <Image
                                                                        boxSize='8rem'
                                                                        src={
                                                                            trail === 'Trilha 1' ? insigniaCheetahSillouete : (
                                                                                trail === 'Trilha 3' ? insigniaMambaSillouete : insigniaLionSillouete
                                                                            )
                                                                        }
                                                                    />
                                                                </Tooltip>
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
        </Flex>
    );
}

export default InsigniaCertificate;
