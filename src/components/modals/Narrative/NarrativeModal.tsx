import React, { FC, useState, SetStateAction } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useUser } from '../../../hooks';

// Components
import FreeLunch from '../FreeLunch';

// Requisitions
import api from '../../../services/api';

import { FREE_LUNCH_SOURCE } from '../../../utils/constants/constants';
import DefaultNarrativeModal from './DefaultNarrativeModal';
import { AGILITY, LEADERSHIP } from '../../../utils/constants/statusConstants';
import { TutorialModal } from '../Tutorial/TutorialModal';
import trailEnum from '../../../utils/enums/trail';
import { IUser } from '../../../recoil/useRecoilState';

interface IScript {
    name: string,
    image: string,
    texts: string[],
}

interface IStatus {
    name: string,
    points: number
}

type NarrativeModalProps = {
    isOpen: boolean,
    onToggle: VoidFunction,
    script: IScript[],
    narrative?: 'cheetah' | 'lion' | undefined
}

const NarrativeModal: FC<NarrativeModalProps> = ({
    isOpen,
    onToggle,
    script,
    narrative
}) => {
    const { userData, setUserData, getNewUserInfo } = useUser();
    const { isOpen: lunchIsOpen, onOpen: lunchOnOpen, onClose: lunchOnClose } = useDisclosure();
    const [freeLunchClose, setFreeLunchClose] = useState<VoidFunction>(() => lunchOnClose());

    const freeCoins = FREE_LUNCH_SOURCE;
    const [freeStatus, setFreeStatus] = useState<IStatus>();
    const {
        isOpen: tutorialIsOpen,
        onClose: tutorialOnClose,
        onOpen: tutorialOnOpen,
    } = useDisclosure();

    const handleCloseTutorial = () => {
        tutorialOnClose();
        lunchOnOpen();
    }

    const handleCloseFreeLunch = async (trail: trailEnum) => {
        const user = userData;
        const narrateiveObject = {
            'Cheetah': {
                trail1: 2,
                trail2: user.narrative_status.trail2
            },
            'Leão e Leoa': {
                trail1: user.narrative_status.trail1,
                trail2: 2
            }
            ,'Mamba Negra': {
                trail1: user.narrative_status.trail1,
                trail2: user.narrative_status.trail2
            }
        }
        await api.patch(`/user/narrative/${user._id}`, {
            narrative_status: {
                ...user.narrative_status,
                ...narrateiveObject[trail]
            }
        });

        lunchOnClose();
    }

    const handleMainFreeLunch = async (userId: string) => {
        await api.patch(`/user/updateFirstTime/${userId}`, {
            isFirstTimeAppLaunching: false,
        });
    }

    //logic for checking and switching if first time is set to true
    const updateNarrative = async () => {
        try {
            let user: IUser;
            const _userId: SetStateAction<string> | null = sessionStorage.getItem('@pionira/userId');
            if (!userData._id) {
                const res = await api.get(`/user/${_userId}`);
                user = res.data;
                setUserData(res.data);
            } else user = userData;

            if (user.isFirstTimeAppLaunching) { //Verifica se é a primeira vez do usuário na plataforma
                setFreeLunchClose(() => handleMainFreeLunch.bind(null, user._id));
                lunchOnOpen();
            } else if (user.narrative_status.trail1 === 0 && user.narrative_status.trail2 === 0) { //Verifica se é a primeira vez do uso em qualquer trilha  
                if (narrative === 'cheetah') {
                    setFreeStatus({
                        name: AGILITY,
                        points: 20
                    });
                    setFreeLunchClose(() => handleCloseFreeLunch.bind(null, trailEnum.CHEETAH, user));
                } else if (narrative === 'lion') {
                    setFreeStatus({
                        name: LEADERSHIP,
                        points: 20
                    });
                    setFreeLunchClose(() => handleCloseFreeLunch.bind(null, trailEnum.LION, user));
                }
                await getNewUserInfo();
                tutorialOnOpen();
            } else if (user.narrative_status.trail1 == 0 && narrative == 'cheetah') { //Verifica se é a primeira vez do usuário na trilha da cheetah
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        ...user.narrative_status,
                        trail1: 2
                    }
                });
                await getNewUserInfo();
            } else if (user.narrative_status.trail2 == 0 && narrative == 'lion') { //Verifica se é a primeira vez do usuário na trilha do leao e da leoa
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        ...user.narrative_status,
                        trail2: 2
                    }
                });
                await getNewUserInfo();
            } else if (user.narrative_status.trail1 == 3 && narrative == 'cheetah') { //Verifica se o usuário terminou o desafio da trilha
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        ...user.narrative_status,
                        trail1: 4
                    }
                });
            } else if (user.narrative_status.trail2 == 3 && narrative == 'lion') { //Verifica se o usuário terminou o desafio da trilha
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        ...user.narrative_status,
                        trail2: 4
                    }
                });
            }
            onToggle();
        } catch (error) {
            alert(error);
        }
    }

    return (
        <>
            <DefaultNarrativeModal
                isOpen={isOpen}
                onToggle={onToggle}
                script={script}
                endScriptFunction={updateNarrative}
            />
            <FreeLunch
                isOpen={lunchIsOpen}
                coins={freeCoins}
                score={freeStatus}
                onClose={freeLunchClose}
            />
            <TutorialModal 
                isOpen={tutorialIsOpen}
                onClose={handleCloseTutorial}
                selectedTopic={'Trilhas'}
            />
        </>
    )
}

export default NarrativeModal;
