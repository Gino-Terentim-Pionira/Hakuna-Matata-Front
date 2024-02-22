import React, { ReactElement, useEffect, useState } from 'react';
import { Flex, Grid, Divider, Button } from '@chakra-ui/react';
import { useUser } from '../../../../hooks';
import { UserServices } from '../../../../services/UserServices';

// Components
import { Relic } from './Relic';

// Images
import useRelic from '../../../../hooks/useRelic';
import { RelicType, UserRelicType } from '../../../../recoil/relicRecoilState';
import { RelicInfoSlide } from './RelicInfoSlide';
import colorPalette from '../../../../styles/colorPalette';
import rarityEnum from '../../../../utils/enums/rarity';
import LoadingState from '../../../LoadingState';
import AlertModal from '../../AlertModal';

type alertModalInfo = {
    isOpen: boolean,
    body: string | ReactElement;
    onClick?: VoidFunction;
}

const Relics = () => {
    const userServices = new UserServices();
    const { relicData, getRelics } = useRelic();
    const { userData, getNewUserInfo } = useUser();
    const relics = relicData.relics;
    const userRelics = relicData.user_relics;
    const [isLoading, setIsLoading] = useState(false);
    const [alertModalInfo, setAlertModalInfo] = useState<alertModalInfo>({
        isOpen: false,
        body: <>Você tem certeza que quer equipar essa relíquia? <strong style={{ color: colorPalette.alertText }}> Você só poderá troca-lá depois de 24h.</strong> </>,
        onClick: () => console.log(''),
    })
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
            onClick: () => console.log(''),
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

    const equipUserRelic = async (relicName: string) => {
        setIsLoading(true);
        try {
            await userServices.equipUserRelic(userData._id, relicName);
            await getNewUserInfo();
            closeAlertModalInfo();
            closeRelicInfoModal();
        } catch (e) {
            console.log(e);
            setAlertModalInfo({
                isOpen: true,
                body: e.response.data.message,
                onClick: closeAlertModalInfo,
            })
        }
        setIsLoading(false);
    }

    const unequipUserRelic = async (relicSlot: 'first_slot' | 'second_slot') => {
        setIsLoading(true);
        try {
            await userServices.unequipUserRelic(userData._id, relicSlot);
            await getNewUserInfo();
            closeAlertModalInfo();
            closeRelicInfoModal();
        } catch (e) {
            setAlertModalInfo({
                isOpen: true,
                body: e.response.data.message,
                onClick: closeAlertModalInfo,
            })
        }
        setIsLoading(false);
    }

    const closeAlertModalInfo = () => {
        setAlertModalInfo({
            isOpen: false,
            onClick: () => console.log(''),
            body: '',
        });
    }
    const openToUnequipAlertModalInfo = (relicSlot: 'first_slot' | 'second_slot') => {
        setAlertModalInfo({
            isOpen: true,
            onClick: () => unequipUserRelic(relicSlot),
            body: <>Você tem certeza que deseja desequipar essa relíquia?</>,
        });
    }
    const openToEquipAlertModalInfo = (relicName: string) => {
        setAlertModalInfo({
            isOpen: true,
            onClick: () => equipUserRelic(relicName as string),
            body: <>Você tem certeza que quer equipar essa relíquia? <strong style={{ color: colorPalette.alertText }}> Você só poderá troca-lá depois de 24h.</strong> </>,
        });
    }
    const handleUserRelicInfoModal = (relic: UserRelicType, isEquiped: boolean, relicSlot: 'first_slot' | 'second_slot' | 'none' ) => {
        const buttonType = isEquiped && relicSlot !== 'none' ? {
            label: 'Desequipar',
            onClick: () => openToUnequipAlertModalInfo(relicSlot),
            backgroundColor: colorPalette.alertText
        } : {
            label: 'Equipar',
            onClick: () => openToEquipAlertModalInfo(relic.relic_name),
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
        <Flex h="469px" flexDirection="column" alignItems="center">
            <RelicInfoSlide
                {...relicInfoModal}
                onClose={closeRelicInfoModal}
            />
            <AlertModal
                alertTitle="Atenção!"
                alertBody={alertModalInfo.body}
                isOpen={alertModalInfo.isOpen}
                onClose={isLoading ? () => console.log('') : closeAlertModalInfo}
                buttonBody={
                    <>
                        <Button isLoading={isLoading} isDisabled={isLoading} onClick={alertModalInfo.onClick}  minWidth="72px" color={colorPalette.whiteText} background={colorPalette.primaryColor}>Confirmar</Button>
                        <Button isLoading={isLoading} isDisabled={isLoading} onClick={closeAlertModalInfo} minWidth="72px" marginLeft="8px" color={colorPalette.whiteText} background={colorPalette.alertText}>Cancelar</Button>
                    </>
                }
            />
            {
                isLoading || !relicData ?
                    <Flex  width="100%" height="100%" justifyContent="center" alignItems="center" >
                        <LoadingState />
                    </Flex> :
                    <>
                        <Flex paddingTop="40px" paddingBottom="24px" columnGap="56px">
                            <Relic
                                onClick={userEquippedRelics.first_slot ? () => handleUserRelicInfoModal(userEquippedRelics.first_slot as UserRelicType, true, 'first_slot') : undefined}
                                color={userEquippedRelics.first_slot ? userEquippedRelics.first_slot.rarity : 'default'}
                                relicImage={userEquippedRelics.first_slot ? userEquippedRelics.first_slot.image : 'https://pionira.s3.sa-east-1.amazonaws.com/relics/relic_sillouete.png'}
                                badgeDescription={!userEquippedRelics.first_slot ? 'Nenhuma relíquia equipada' : undefined }
                                isCursorActive={!!userEquippedRelics.first_slot}
                            />
                            <Relic
                                onClick={userEquippedRelics.second_slot ? () => handleUserRelicInfoModal(userEquippedRelics.second_slot as UserRelicType, true, 'second_slot') : undefined}
                                color={userEquippedRelics.second_slot ? userEquippedRelics.second_slot.rarity : 'default'}
                                relicImage={userEquippedRelics.second_slot ? userEquippedRelics.second_slot.image : 'https://pionira.s3.sa-east-1.amazonaws.com/relics/relic_sillouete.png'}
                                badgeDescription={!userEquippedRelics.second_slot ? 'Nenhuma relíquia equipada' : undefined }
                                isCursorActive={!!userEquippedRelics.second_slot}
                            />
                        </Flex>
                        <Divider width="90%"  />
                        <Grid
                            width="90%"
                            overflowY="auto"
                            padding="24px 16px"
                            gridAutoFlow="row"
                            gridTemplateColumns="repeat(5, minmax(14.6%, 0fr))"
                            columnGap="48px"
                            rowGap="32px"
                        >
                            {
                                userRelics?.map((item) => {
                                        const first_slot = getEquippedRelics()?.first_slot?.relic_name;
                                        const second_slot = getEquippedRelics()?.second_slot?.relic_name;
                                        const IS_EQUIPED = first_slot === item.relic_name || second_slot === item.relic_name;
                                        return (
                                            <Relic
                                                onClick={() => handleUserRelicInfoModal(item, IS_EQUIPED, 'none')}
                                                color={item.rarity}
                                                width="80px"
                                                height="80px" relicImage={item.image}
                                                isCursorActive={true}
                                            />
                                        );
                                    }
                                )
                            }
                            {
                                relics?.map((item) => (
                                    <Relic
                                        onClick={() => handleRelicInfoModal(item)}
                                        width="80px"
                                        height="80px"
                                        relicImage={item.image_sillouete}
                                        isCursorActive={true}
                                    />
                                ))
                            }
                        </Grid>
                    </>
            }
        </Flex>
    );
}

export default Relics;
