import React, { useEffect, useState } from 'react';
import {
    useDisclosure,
    Box,
    Image,
    Tooltip, useMediaQuery,
} from '@chakra-ui/react';

// Requisitions
import api from '../../services/api';

// Styles
import { motion } from 'framer-motion';
import colorPalette from "../../styles/colorPalette";

// Images
import rewardChest from "../../assets/icons/bau.png";
import RewardModal from './GenericModal';
import rewardOpenChest from "../../assets/icons/bauAberto.svg";
import { useUser } from '../../hooks';
import { CHEST_LUCK_SOURCE, CHEST_NORMAL_SOURCE } from '../../utils/constants/constants';
import { SURPRISE_CHEST } from '../../utils/constants/mouseOverConstants';
import MediaQueriesEnum from '../../utils/enums/mediaQueries';

interface userDataProps {
    coins: number
}

const RandomRewardModal = () => {
    const { userData, getNewUserInfo } = useUser();
    const [randomNumber, setRandomNumber] = useState(false);
    const [coins, setCoins] = useState(0);
    const [onError, setOnError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

    const getUser = async () => {
        try {
            const random = Math.floor(Math.random() * 100);
            if (random < userData.luck ) {
                setRandomNumber(true);
                const randomCoins = Math.floor(Math.random() * 100);
                if (randomCoins < userData.luck) {
                    setCoins(CHEST_LUCK_SOURCE);
                } else {
                    setCoins(CHEST_NORMAL_SOURCE);
                }
            }

        } catch (error) {
            setOnError(true);
        }
    }

    const updateUserCoins = async () => {
        try {
            setIsLoading(true);
            await addCoinsStatus(coins);
            setRandomNumber(false);
            setIsLoading(false);
        } catch (error) {
            setOnError(true);
        }

    }

    const addCoinsStatus = async (value: number) => {
        try {
            const _userId = sessionStorage.getItem('@pionira/userId');
            const res = await api.get<userDataProps>(`/user/${_userId}`);

            await api.patch<userDataProps>(`/user/coins/${_userId}`, {
                coins: res.data.coins + value
            });
            await getNewUserInfo();
        } catch (error) {
            setOnError(true);
        }
    }

    const rewardModalInfo = {
        title: "Opa! O que é isso?",
        titleColor: colorPalette.inactiveButton,
        subtitle: "Ao explorar a Savana você se deparou com um baú cheio de joias! Dentro dele tinha:",
        icon: rewardOpenChest,
        coins,
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <Tooltip
                isDisabled={!isDesktop}
                hasArrow
                placement='top'
                label={SURPRISE_CHEST}
            >
                <Box width="18%" >
                    {
                        randomNumber &&
                        <motion.div
                            animate={{ scale: [0.8, 1, 0.8] }}
                            transition={{ loop: Infinity }}
                        >
                            <Image _hover={{
                                cursor: 'pointer',
                            }} onClick={() => { onOpen(); }} src={rewardChest} width='32rem' />
                        </motion.div>
                    }
                </Box>
            </Tooltip>
            <RewardModal
            isOpen={isOpen}
            genericModalInfo={rewardModalInfo}
            confirmFunction={onClose}
            error={onError}
            loading={isLoading}
            initFunction={updateUserCoins}
            />
        </>
    );
}

export default RandomRewardModal;
