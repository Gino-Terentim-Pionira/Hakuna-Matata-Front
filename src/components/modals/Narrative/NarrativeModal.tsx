import React, { FC, useState, SetStateAction } from 'react';
import { useDisclosure  } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useUser } from '../../../hooks';

// Components
import FreeLunch from '../FreeLunch';

// Requisitions
import api from '../../../services/api';

import { Constants } from '../../../utils/constants';
import DefaultNarrativeModal from './DefaultNarrativeModal';

interface IScript {
    name: string,
    image: string,
    texts: string[],
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
    const history = useHistory();
    const { userData, setUserData, getNewUserInfo } = useUser();
    const { isOpen: lunchIsOpen, onOpen: lunchOnOpen, onClose: lunchOnClose } = useDisclosure();

    const freeCoins = Constants.FREE_LUNCH_SOURCE;
    const [freeStatus, setFreeStatus] = useState([0, 0, 0, 0, 0, 0, 0]);

    //logic for checking and switching if first time is set to true
    const updateNarrative = async () => {
        try {
            let user;
            const _userId: SetStateAction<string> | null = sessionStorage.getItem('@pionira/userId');
            if (!userData._id) {
                const res = await api.get(`/user/${_userId}`);
                user = res.data;
                setUserData(res.data);
            } else user = userData;

            if (user.isFirstTimeAppLaunching) { //Verifica se é a primeira vez do usuário na plataforma
                lunchOnOpen();
                await api.patch(`/user/updateFirstTime/${user._id}`, {
                    isFirstTimeAppLaunching: false,
                });
            } else if (user.narrative_status.trail1 === 0 && user.narrative_status.trail2 === 0) { //Verifica se é a primeira vez do uso em qualquer trilha                
                lunchOnOpen();
                if (narrative === 'cheetah') {
                    setFreeStatus([15, 0, 0, 0, 0, 0]);
                    await api.patch(`/user/narrative/${_userId}`, {
                        narrative_status: {
                            ...user.narrative_status,
                            trail1: 2
                        }
                    });
                } else if (narrative === 'lion') {
                    setFreeStatus([0, 15, 0, 0, 0, 0]);
                    await api.patch(`/user/narrative/${_userId}`, {
                        narrative_status: {
                            ...user.narrative_status,
                            trail2: 2
                        }
                    });
                }
                await getNewUserInfo();
            } else if (user.narrative_status.trail1 == 0 && narrative == 'cheetah') { //Verifica se é a primeira vez do usuário na trilha da cheetah
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        ...user.narrative_status,
                        trail1: 2
                    }
                });
                await getNewUserInfo();
                history.go(0);
            } else if (user.narrative_status.trail2 == 0 && narrative == 'lion') { //Verifica se é a primeira vez do usuário na trilha do leao e da leoa
                await api.patch(`/user/narrative/${_userId}`, {
                    narrative_status: {
                        ...user.narrative_status,
                        trail2: 2
                    }
                });
                await getNewUserInfo();
                history.go(0);
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
                onClose={() => { lunchOnClose() }}
            />
        </>
    )
}

export default NarrativeModal;
