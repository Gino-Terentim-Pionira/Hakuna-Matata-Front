import React, { useEffect } from 'react';
import { Flex, Image, Grid, Divider, Tooltip, Slide, Box, Text, Button } from '@chakra-ui/react';
import { useUser } from '../../../../hooks';

// Components
import LoadingState from '../../../LoadingState';

// Images
import { BADGE_DESCRIPTION, LOCKED_BADGE } from '../../../../utils/constants/mouseOverConstants';
import useRelic from '../../../../hooks/useRelic';
import rarityEnum from '../../../../utils/enums/rarity';
import colorPalette from '../../../../styles/colorPalette';

type RelicType = {
    relicImage: string;
    width?: string;
    height?: string;
}

const Relic = ({relicImage, width, height}: RelicType) => (
    <Tooltip
        hasArrow
        placement="bottom"
        gutter={10}
        label={BADGE_DESCRIPTION}
    >
        <Flex
            width={width || '106px'}
            height={height || '106px'}
            borderRadius="8px"
            justifyContent="center"
            alignItems="center"
            border={`2px solid ${colorPalette.textColor}`}
            bg="radial-gradient(50% 50% at 50% 50%, #EBD8F8 0%, #A344E8 100%)"
            padding="2px"
        >
            <Image src={relicImage} alt="Imagem da relíquia" />
        </Flex>
    </Tooltip>
);

const RelicInfoModal = () => {
    return (
        <Slide direction="bottom" in={true} style={{ zIndex: 10 }} >
            <Flex
                width="100%"
                height="230px"
                justifyContent="center"
                border={`4px solid ${colorPalette.secondaryColor}`}
                rounded="md"
                shadow="md"
                background={colorPalette.slideBackground}
                position="relative"
            >
                <Flex flexDirection="column" alignItems="flex-start" width="fit-content" height="230px">
                    <Flex justifyContent="center">
                        <Text>
                            Lorem Ipsum (Lendário)
                        </Text>
                        <Text>
                            Reliquía equipada
                        </Text>
                    </Flex>
                    <Text>
                        Sit nulla est ex deserunt exercitation
                    </Text>
                    <Text>
                        Encontrada: Trilha da Cheetah
                    </Text>
                </Flex>

                <Flex flexDirection="column" justifyContent={"center"} alignItems="flex-start" width="fit-content" height="230px">
                    <Button>
                        Desequipar
                    </Button>

                    <Button>
                        Compartilhar
                    </Button>
                </Flex>
            </Flex>
        </Slide>
    );
}


const RelicsCertificate = () => {
    const { relicData, getRelics } = useRelic();
    const { userData } = useUser();
    const relics = relicData.relics;
    const userRelics = relicData.user_relics;

    const getEquippedRelics = () => {
        const userFirstSlotName = userData.equiped_relics?.first_slot.relic_name;
        const userSecondSlotName = userData.equiped_relics?.second_slot.relic_name;
        let first_slot;
        let second_slot;


        if (userFirstSlotName && userRelics) {
            first_slot = userRelics?.find((item) => item.relic_name === userFirstSlotName);
        }

        if (userSecondSlotName && userRelics) {
            second_slot = userRelics?.find((item) => item.relic_name === userSecondSlotName);
        }


        return {
            first_slot,
            second_slot
        }
    }
    const userEquippedRelics = getEquippedRelics();

    useEffect(() => {
        const verifyRelics = async () => {
            if (!relicData.relics || !relicData.user_relics) {
                await getRelics(userData._id);
            }
        }
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
        <Flex h="100%" flexDirection="column" alignItems="center">
            <RelicInfoModal />
            <Flex paddingTop="40px" paddingBottom="24px" columnGap="56px">
                {
                    userEquippedRelics && (
                        <>
                            <Relic relicImage="https://pionira.s3.sa-east-1.amazonaws.com/relics/relic_sandal.png" />
                            <Relic relicImage="https://pionira.s3.sa-east-1.amazonaws.com/relics/relic_sandal.png" />
                        </>
                    )
                }
            </Flex>
            <Divider width="90%"  />
            <Grid
                width="90%"
                maxHeight="400px"
                overflowY="auto"
                padding="24px 16px"
                gridAutoFlow="row"
                gridTemplateColumns="repeat(5, minmax(75px, 0fr))"
                columnGap="48px"
                rowGap="32px"
            >
                {
                    userRelics?.map((item) => (
                        <Relic width="80px" height="80px" relicImage={item.image} />
                    ))
                }
                {
                    relics?.map((item) => (
                        <Relic width="80px" height="80px" relicImage={item.image_sillouete} />
                    ))
                }
            </Grid>
        </Flex>
    );
}

// <Flex h='100%' w='100%' flexDirection='column' justifyContent='space-between' alignItems='center' >
//     {
//         relicData.length > 0 ? (
//             <>
//                 <Tabs h='100%' w='100%' marginBottom='0.5rem' align='center' size='lg' >
//                     <TabPanels h='85%' padding='0'>
//                         <TabPanel h='100%' paddingTop='0' paddingBottom='0'>
//                             <Box w='100%' h='100%' overflowY='auto'>
//                                 <Grid templateColumns='25% 25% 25%' columnGap='12.5%' width='95%' mt='1rem' h='95%' >
//                                     {
//                                         relicData.map(({
//                                                            _id,
//                                                            relic_name,
//                                                            description,
//                                                            image,
//                                                            image_sillouete
//                                                        }: {
//                                             _id: string;
//                                             relic_name: string;
//                                             description: string;
//                                             hint: string;
//                                             rarity: rarityEnum;
//                                             image: string;
//                                             image_sillouete: string;
//                                         }) => {
//                                             return (
//                                                 userData.owned_relics.find(item => item.relic_name === relic_name) ? (
//                                                     <Relic
//                                                         key={_id}
//                                                         _id={_id}
//                                                         description={description}
//                                                         relic_name={relic_name}
//                                                         image={image}
//                                                     />
//                                                 ) : (
//                                                     <Box
//                                                         marginTop='1rem'
//                                                         maxW='14rem'
//                                                         h='11rem'
//                                                         display='flex'
//                                                         flexDirection='column'
//                                                         justifyContent='space-between'
//                                                         alignItems='center'
//                                                         key={_id}
//                                                         _hover={{
//                                                             cursor: 'help'
//                                                         }}
//                                                     >
//                                                         <Tooltip
//                                                             hasArrow
//                                                             placement='top'
//                                                             gutter={10}
//                                                             label={LOCKED_BADGE}
//                                                         >
//                                                             <Image
//                                                                 boxSize='8rem'
//                                                                 src={image_sillouete}
//                                                             />
//                                                         </Tooltip>
//                                                         <Text
//                                                             fontSize='1.2rem'
//                                                             fontWeight='bold'
//                                                             marginTop='1rem'
//                                                             marginBottom='1rem'
//                                                         >???</Text>
//                                                     </ Box>
//                                                 )
//                                             )
//                                         })
//                                     }
//                                 </Grid>
//                             </Box>
//                         </TabPanel>
//                     </TabPanels>
//                 </Tabs>
//             </>
//         ) : (
//             <LoadingState />
//         )
//     }
// </Flex>

export default RelicsCertificate;
