import React, { useState, FC } from 'react';
import api from '../../services/api';
import colorPalette from '../../styles/colorPalette';
import RewardModal from './GenericModal';
import Cheetah from '../../assets/icons/cheetahblink.svg';
import { useUser } from '../../hooks';
import { DAILY_SOURCE } from '../../utils/constants/constants';

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
    isOpen, onClose
}) => {
    const { getNewUserInfo } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [onError, setOnError] = useState(false);
    const coins = DAILY_SOURCE;



    const updateUserDailyReward = async () => {
        try {

            setIsLoading(true);
            await addDailyRewardStatus(coins);
            await getNewUserInfo();
            setIsLoading(false);
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

    return (
        <RewardModal
            isOpen={isOpen}
            genericModalInfo={rewardModalInfo}
            confirmFunction={onClose}
            error={onError}
            loading={isLoading}
            initFunction={updateUserDailyReward}
        />
    )
}

export default DailyRewardModal;