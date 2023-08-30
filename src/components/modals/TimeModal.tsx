import React, { FC } from 'react';
import { useUser } from '../../hooks';
import { Constants } from '../../utils/constants';
import { useHistory, useLocation } from "react-router-dom";
import GenericModal from './GenericModal';
import { BUY_HOUR_GLASS, REWATCH_VIDEOS } from '../../utils/constants/constants';

// Styles

import hourglass from '../../assets/icons/hourglass_icon.png';
import colorPalette from '../../styles/colorPalette';

interface ITimeModal {
    timeIsOpen: boolean,
    timeOnClose: VoidFunction
}

const TimeModal: FC<ITimeModal> = ({ timeIsOpen, timeOnClose }) => {
    const { userData } = useUser();
    const history = useHistory();
    const local = useLocation();

    const handleStore = () => {
        const prePath = local.pathname;
        sessionStorage.setItem('@pionira/prepath', prePath);
        history.push({ pathname: '/shop' });
    }
    return (
        <GenericModal 
            isOpen={timeIsOpen}
            confirmFunction={handleStore}
            secondFunction={timeOnClose}
            closeFunction={timeOnClose}
            loading={false}
            error={false}
            genericModalInfo={
                {
                    title: 'Opa, calma aí!',
                    titleColor: colorPalette.closeButton,
                    subtitle: userData.coins >= Constants.HOURGLASS_SINK 
                        ? 'Você deve esperar no mínimo 30 minutos para refazer um desafio ou vá na loja e compre a ampulheta do ancião!'
                        : 'Você deve esperar no mínimo 30 minutos para refazer um desafio ou junte moedas para comprar a ampulheta do ancião!',
                    icon: hourglass,
                    firstButton: BUY_HOUR_GLASS,
                    secondButton: REWATCH_VIDEOS
                }
            }
        />
    )
}

export default TimeModal;
