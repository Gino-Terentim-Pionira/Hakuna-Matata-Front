import React, { FC } from 'react';
import { useUser } from '../../hooks';
import { HOURGLASS_SINK } from '../../utils/constants/constants';
import GenericModal from './GenericModal';
import { REWATCH_VIDEOS } from '../../utils/constants/buttonConstants';

// Styles

import hourglass from '../../assets/icons/hourglass_icon.png';
import colorPalette from '../../styles/colorPalette';

interface ITimeModal {
    timeIsOpen: boolean,
    timeOnClose: VoidFunction
}

const TimeModal: FC<ITimeModal> = ({ timeIsOpen, timeOnClose }) => {
    const { userData } = useUser();
    return (
        <GenericModal 
            isStaticModal={true}
            isOpen={timeIsOpen}
            confirmFunction={timeOnClose}
            closeFunction={timeOnClose}
            loading={false}
            error={false}
            genericModalInfo={
                {
                    title: 'Opa, calma aí!',
                    titleColor: colorPalette.closeButton,
                    subtitle: userData.coins >= HOURGLASS_SINK 
                        ? 'Você deve esperar no mínimo 30 minutos para refazer um desafio ou vá na loja e compre a ampulheta do ancião!'
                        : 'Você deve esperar no mínimo 30 minutos para refazer um desafio ou junte moedas para comprar a ampulheta do ancião!',
                    icon: hourglass,
                    firstButton: REWATCH_VIDEOS
                }
            }
        />
    )
}

export default TimeModal;
