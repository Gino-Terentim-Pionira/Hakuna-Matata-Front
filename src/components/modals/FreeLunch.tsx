import React, { FC, useState } from 'react';
import { useUser } from '../../hooks';
import { useHistory } from 'react-router-dom';

// Components
import RewardModal from './GenericModal';

// Requisitions
import api from '../../services/api';

//Styles
import colorPalette from '../../styles/colorPalette';

// Images
import Cheetah from '../../assets/icons/cheetahblink.svg';
import { UpdateStatus } from '../../services/updateStatus';

interface IFreeLunch {
    isOpen: boolean;
    onClose: () => Promise<void>;
    coins: number;
    score?: {
        name: string;
        points: number;
    };
}

interface userDataProps {
    coins: number,
    status: [{
        name: string;
        points: number;
    }],
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
    const { getNewUserInfo, userData } = useUser();
    const history = useHistory();
    const coinsRecieved = coins;


    const incrementStatus = async (userId: string) => {
        if (score) {
            await UpdateStatus(userData, userId, score.name, score.points);
        }
    }

    const addCoinsStatus = async (value: number) => {
        try {
            const _userId = sessionStorage.getItem('@pionira/userId');

            const currentDate = new Date();

            await api.patch<userDataProps>(`/user/lastCollected/${_userId}`, {
                coins: userData.coins + value,
                consecutiveDays: 1,
                lastCollected: currentDate.getTime()
            });

            incrementStatus(_userId as string);

            await getNewUserInfo();
            history.go(0);
        } catch (error) {
            setOnError(true);
        }
    }


    const updateUserCoins = async () => {
        try {
            setIsLoading(true);
            await addCoinsStatus(coinsRecieved);
            setIsLoading(false);
            await onClose();
        } catch (error) {
            setOnError(true);
        }

    }

    const rewardModalInfo = {
        title: 'Surpresa!',
        titleColor: colorPalette.inactiveButton,
        subtitle: 'Aqui estão algumas recompensas, aproveite!',
        icon: Cheetah,
        coins: coinsRecieved,
        status: score
    }

    return (
        <RewardModal
            isOpen={isOpen}
            genericModalInfo={rewardModalInfo}
            confirmFunction={updateUserCoins}
            error={onError}
            loading={isLoading}
        />
    )
}

export default FreeLunch;
