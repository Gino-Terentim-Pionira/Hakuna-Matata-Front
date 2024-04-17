import React, { useState } from 'react';
import rarityEnum from '../../utils/enums/rarity';
import GenericModal from './GenericModal';
import { getRelicColor, getRelicGradient } from '../../utils/relicsUtil';

export interface IResponseRelics {
    relic_name: string;
    description: string;
    rarity: rarityEnum;
    image: string;
}

const RelicsRewardModal = ({
    relics,
    isOpen,
    onClose
}: {
    relics: IResponseRelics[],
    isOpen: boolean,
    onClose: VoidFunction
}) => {
    const [relicIndex, setRelicIndex] = useState(0);
    const [genericModalInfo, setGenericModalInfo] = useState({
        title: relics[0].relic_name,
        titleColor: getRelicColor(relics[0].rarity),
        subtitle: `Você desbloqueou uma relíquia ${relics[0].rarity}`,
        textBody: relics[0].description,
        icon: relics[0].image,
        iconBackground: getRelicGradient(relics[0].rarity),
        firstButton: 'Continuar'
    });

    const changeRelic = () => {
        const nextIndex = relicIndex + 1;
        if (nextIndex >= relics.length) {
            onClose();
        } else {
            setGenericModalInfo({
                ...genericModalInfo,
                title: relics[nextIndex].relic_name,
                titleColor: getRelicColor(relics[nextIndex].rarity),
                subtitle: `Você desbloqueou uma relíquia ${relics[nextIndex].rarity}`,
                textBody: relics[nextIndex].description,
                icon: relics[nextIndex].image,
                iconBackground: getRelicGradient(relics[nextIndex].rarity)
            });
            setRelicIndex(nextIndex);
        }
    }

    return (
        <GenericModal
            genericModalInfo={genericModalInfo}
            isOpen={isOpen}
            confirmFunction={changeRelic}
            loading={false}
            error={false}
            isStaticModal={true}
        />
    )
}

export default RelicsRewardModal;
