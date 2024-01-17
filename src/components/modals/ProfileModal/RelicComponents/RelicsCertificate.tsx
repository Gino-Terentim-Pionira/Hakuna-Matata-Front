import React, { useEffect } from 'react';
import { Flex, Box, Tabs, TabPanels, TabPanel, Image, Grid, Text, Tooltip } from '@chakra-ui/react';
import { useUser } from '../../../../hooks';

// Components
import Relic from './Relic';
import LoadingState from '../../../LoadingState';

// Images
import { LOCKED_BADGE } from '../../../../utils/constants/mouseOverConstants';
import useRelic from '../../../../hooks/useRelic';
import rarityEnum from '../../../../utils/enums/rarity';

const RelicsCertificate = () => {
    const { relicData, getRelics } = useRelic();
    const { userData } = useUser();

    const verifyRelics = async () => {
        if (relicData.length === 0) {
            await getRelics();
        }
    }
    useEffect(() => {
        verifyRelics();
    }, []);


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
                relicData.length > 0 ? (
                    <>
                        <Tabs h='100%' w='100%' marginBottom='0.5rem' align='center' size='lg' >
                            <TabPanels h='85%' padding='0'>
                                <TabPanel h='100%' paddingTop='0' paddingBottom='0'>
                                    <Box w='100%' h='100%' overflowY='auto'>
                                        <Grid templateColumns='25% 25% 25%' columnGap='12.5%' width='95%' mt='1rem' h='95%' >
                                            {
                                                relicData.map(({ 
                                                    _id, 
                                                    relic_name, 
                                                    description,
                                                    image,
                                                    image_sillouete
                                                }: {
                                                    _id: string;
                                                    relic_name: string;
                                                    description: string;
                                                    hint: string;
                                                    rarity: rarityEnum;
                                                    image: string;
                                                    image_sillouete: string;
                                                }) => {
                                                    return (
                                                        userData.owned_relics.find(item => item.relic_name === relic_name) ? (
                                                            <Relic 
                                                                key={_id} 
                                                                _id={_id} 
                                                                description={description} 
                                                                relic_name={relic_name}
                                                                image={image}
                                                            />
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
                                                                        src={image_sillouete}
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

export default RelicsCertificate;
