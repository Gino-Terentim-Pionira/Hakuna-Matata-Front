import React, { useEffect, useState } from 'react';
import { Flex, Grid, Divider } from '@chakra-ui/react';
import { useUser } from '../../../../hooks';

// Components
import { Relic } from './Relic';

// Images
import useRelic from '../../../../hooks/useRelic';
import { RelicType, UserRelicType } from '../../../../recoil/relicRecoilState';
import { RelicInfoSlide } from './RelicInfoSlide';
import colorPalette from '../../../../styles/colorPalette';
import rarityEnum from '../../../../utils/enums/rarity';
import LoadingState from '../../../LoadingState';

const Relics = () => {
    const { relicData, getRelics } = useRelic();
    const { userData } = useUser();
    const relics = relicData.relics;
    const userRelics = relicData.user_relics;
    const [relicInfoModal, setRelicInfoModal] = useState({
        isOpen: false,
        title: '',
        rarity: 'Normal' as rarityEnum,
        description: '',
        discoveredTrail: '',
        hint: '',
        isHaveNoButton: false,
        isEquiped: false,
        button: {
            label: '',
            onClick: () => console.log('teste'),
            backgroundColor: ''
        },
    })

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

    const handleUserRelicInfoModal = (relic: UserRelicType, isEquiped: boolean ) => {
        const buttonType = isEquiped ? {
            label: 'Desequipar',
            onClick: () => console.log('Desequipar'),
            backgroundColor: colorPalette.alertText
        } : {
            label: 'Equipar',
            onClick: () => console.log('Equipar'),
            backgroundColor: colorPalette.primaryColor
        }
        setRelicInfoModal({
            ...relicInfoModal,
            rarity: relic.rarity,
            description: relic.description,
            discoveredTrail: relic.path,
            hint: '',
            title: relic.relic_name,
            isOpen: true,
            isHaveNoButton: false,
            isEquiped: isEquiped,
            button: buttonType
        })
    }

    const handleRelicInfoModal = (relic: RelicType) => {
        setRelicInfoModal({
            ...relicInfoModal,
            rarity: relic.rarity,
            description: '',
            discoveredTrail: '',
            hint: relic.hint,
            title: '',
            isOpen: true,
            isHaveNoButton: true,
            isEquiped: false,
            button: {
                label: '',
                onClick: () => console.log('teste'),
                backgroundColor: ''
            }
        })
    }

    const closeRelicInfoModal = () => {
        setRelicInfoModal({
            ...relicInfoModal,
            rarity: 'Normal',
            description: '',
            discoveredTrail: '',
            hint: '',
            title: '',
            isHaveNoButton: true,
            isEquiped: false,
            button: {
                label: '',
                onClick: () => console.log('teste'),
                backgroundColor: ''
            },
            isOpen: false,
        })
    }

    useEffect(() => {
        const verifyRelics = async () => {
            if (!relicData.relics || !relicData.user_relics) {
                await getRelics(userData._id);
            }
        }
        verifyRelics();
    }, []);

    return (
        <Flex h="100%" flexDirection="column" alignItems="center">
            {
                relicInfoModal.isOpen &&  <RelicInfoSlide
                    {...relicInfoModal}
                    onClose={closeRelicInfoModal}
                />
            }

            <Flex paddingTop="40px" paddingBottom="24px" columnGap="56px">
                <Relic
                    onClick={userEquippedRelics.first_slot ? () => handleUserRelicInfoModal(userEquippedRelics.first_slot as UserRelicType, true) : undefined}
                    color={userEquippedRelics.first_slot ? userEquippedRelics.first_slot.rarity : 'default'}
                    relicImage={userEquippedRelics.first_slot ? userEquippedRelics.first_slot.image : 'https://pionira.s3.sa-east-1.amazonaws.com/relics/relic_sillouete.png'}
                    badgeDescription={userEquippedRelics.first_slot ? 'Nenhuma relíquia equipada' : undefined }
                />
                <Relic
                    onClick={userEquippedRelics.second_slot ? () => handleUserRelicInfoModal(userEquippedRelics.second_slot as UserRelicType, true) : undefined}
                    color={userEquippedRelics.second_slot ? userEquippedRelics.second_slot.rarity : 'default'}
                    relicImage={userEquippedRelics.second_slot ? userEquippedRelics.second_slot.image : 'https://pionira.s3.sa-east-1.amazonaws.com/relics/relic_sillouete.png'}
                    badgeDescription={userEquippedRelics.second_slot ? 'Nenhuma relíquia equipada' : undefined }
                />
            </Flex>
            <Divider width="90%"  />
            {
                relicData ?
                    <Flex height={"50%"} justifyContent="center" alignItems="center" width="100%">
                        <LoadingState />
                    </Flex>
                    :
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
                            userRelics?.map((item) => {
                                    const first_slot = getEquippedRelics()?.first_slot?.relic_name;
                                    const second_slot = getEquippedRelics()?.second_slot?.relic_name;
                                    const IS_EQUIPED = first_slot === item.relic_name || second_slot === item.relic_name;
                                    return (
                                        <Relic onClick={() => handleUserRelicInfoModal(item, IS_EQUIPED)} color={item.rarity} width="80px"
                                               height="80px" relicImage={item.image} />
                                    );
                                }
                            )
                        }
                        {
                            relics?.map((item) => (
                                <Relic onClick={() => handleRelicInfoModal(item)} width="80px" height="80px" relicImage={item.image_sillouete} />
                            ))
                        }
                    </Grid>
            }
        </Flex>
    );
}

export default Relics;
