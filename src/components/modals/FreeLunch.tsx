import React, { FC, useState } from 'react';
import { useUser } from '../../hooks';

// Components
import RewardModal from './RewardModal';

// Requisitions
import api from '../../services/api';
import { AxiosResponse } from 'axios';

//Styles
import colorPalette from '../../styles/colorPalette';

// Images
import Cheetah from '../../assets/icons/cheetahblink.svg';

interface IFreeLunch {
    isOpen: boolean;
    onClose: VoidFunction;
    coins: number;
    score: number[];
}

interface userDataProps {
    coins: number,
    status: number[],
    lastCollected: number,
    consecutiveDays: number,
}

const FreeLunch: FC<IFreeLunch> = ({
    isOpen,
    onClose,
    coins,
    score,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [onError, setOnError] = useState(false);
    const { getNewUserInfo } = useUser();
    const coinsRecieved = coins;

    const statusPointsRecieved = [{
        name: "AGI",
        points: score[0]
    },
    {
        name: "LID",
        points: score[1]
    }];


    const incrementAtStatusIndex = (res: AxiosResponse<userDataProps>) => {
        for (let i = 0; i < 2; i++) {
            res.data.status[i] = res.data.status[i] + statusPointsRecieved[i].points;
        }
        return res.data.status;
    }

    const addCoinsStatus = async (value: number) => {
        try {
            const _userId = sessionStorage.getItem('@pionira/userId');
            const res = await api.get<userDataProps>(`/user/${_userId}`);

            const currentDate = new Date();

            await api.patch<userDataProps>(`/user/lastCollected/${_userId}`, {
                coins: res.data.coins + value,
                consecutiveDays: 1,
                lastCollected: currentDate.getTime()
            });
            await api.patch<userDataProps>(`/user/status/${_userId}`, {
                status: incrementAtStatusIndex(res)  // first parameter of this func needs to be dynamic
            });

            await getNewUserInfo();
        } catch (error) {
            setOnError(true);
        }
    }


    const updateUserCoins = async () => {
        try {
            setIsLoading(true);
            await addCoinsStatus(coinsRecieved);
            setIsLoading(false);
            onClose();
        } catch (error) {
            setOnError(true);
        }

    }

    const rewardModalInfo = {
        title: 'Surpresa!',
        titleColor: colorPalette.inactiveButton,
        subtitle: 'Aqui está algumas recompensas, aproveite!',
        icon: Cheetah,
        coins: coinsRecieved,
        status: score
    }

    return (
        <RewardModal
            isOpen={isOpen}
            rewardModalInfo={rewardModalInfo}
            confirmFunction={updateUserCoins}
            error={onError}
            loading={isLoading}
        />
    )
}

export default FreeLunch;
