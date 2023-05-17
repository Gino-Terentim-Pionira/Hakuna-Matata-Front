import React, { FC } from 'react';
import { useUser } from '../../hooks';
import { Constants } from '../../utils/constants';

// Styles

import hourglass from '../../assets/icons/hourglass_icon.png';
import colorPalette from '../../styles/colorPalette';
import GenericModal from './GenericModal';

interface ITimeModal {
    timeIsOpen: boolean,
    timeOnClose: VoidFunction
}

const TimeModal: FC<ITimeModal> = ({ timeIsOpen, timeOnClose }) => {
    const { userData } = useUser();
    return (
        <GenericModal 
            isOpen={timeIsOpen}
            confirmFunction={timeOnClose}
            loading={false}
            error={false}
            genericModalInfo={
                {
                    title: 'Opa, calma aí!',
                    titleColor: colorPalette.closeButton,
                    subtitle: userData.coins >= Constants.HOURGLASS_SINK 
                        ? 'Você deve esperar no mínimo 30 minutos para refazer um desafio ou vá na loja e compre a ampulheta do ancião!'
                        : 'Você deve esperar no mínimo 30 minutos para refazer um desafio ou junte moedas para comprar a ampulheta do ancião!',
                    icon: hourglass
                }
            }
        />
    )
}

export default TimeModal;
