import React, { useState, useEffect, FC } from 'react';
import api from '../../services/api';
import colorPalette from '../../styles/colorPalette';
import RewardModal from './RewardModal';
import Cheetah from '../../assets/icons/cheetahblink.svg';

interface IDailyReward {
    isOpen: boolean;
    onOpen: VoidFunction;
    onClose: VoidFunction;
}

interface userDataProps {
    coins: number,
    lastCollected: number,
    consecutiveDays: number,
}

const DailyRewardModal: FC<IDailyReward> = ({
    isOpen,
}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [onError, setOnError] = useState(false);
    const [coins, setCoins] = useState(0);

    const getUser = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            const user = await api.get(`/user/${userId}`);

            if (user.data.consecutiveDays >= 10) {
                setCoins(25);
            } else if (user.data.consecutiveDays > 0) {
                setCoins(10);
            }

        } catch (error) {
            setOnError(true);
        }
    }

    const coinsRecieved = coins;

    const updateUserDailyReward = async () => {
        try {

            setIsLoading(true);
            await addDailyRewardStatus(coinsRecieved);
            window.location.reload();

        } catch (error) {
            setOnError(true);
        }

    }

    const addDailyRewardStatus = async (value: number) => {
        try {
            const _userId = sessionStorage.getItem('@pionira/userId');
            const res = await api.get<userDataProps>(`/user/${_userId}`);

            const currentDate = new Date();

            await api.patch<userDataProps>(`/user/lastCollected/${_userId}`, {
                coins: res.data.coins + value,
                consecutiveDays: res.data.consecutiveDays + 1,
                lastCollected: currentDate.getTime()
            });

        } catch (error) {
            setOnError(true);
        }
    }

    const rewardModalInfo = {
        title: 'Mantenha o ritmo!',
        titleColor: colorPalette.inactiveButton,
        subtitle: 'Aqui está sua recompensa diária, aproveite!',
        icon: Cheetah,
        coins: coins,
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <RewardModal
            isOpen={isOpen}
            rewardModalInfo={rewardModalInfo}
            confirmFunction={updateUserDailyReward}
            error={onError}
            loading={isLoading}
        />
    )
}

export default DailyRewardModal;