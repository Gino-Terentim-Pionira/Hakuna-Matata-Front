import React from 'react';
import { Tooltip, Image } from '@chakra-ui/react';
import { BACK_BUTTON } from '../utils/constants/constants';
import sidearrow from '../assets/icons/sidearrow.png';

const BackButton = ({
    onClick
}: {
    onClick: VoidFunction
}) => {
    return (
        <Tooltip
            hasArrow
            gutter={14}
            label={BACK_BUTTON}
        >
            <Image
                w='3rem'
                transition='all 150ms ease'
                _hover={{
                    cursor: 'pointer',
                    transform: 'scale(1.2)'
                }}
                onClick={onClick}
                src={sidearrow}
                alt='sidearrow'
                zIndex='2'
                ml='2rem'
            />
        </Tooltip>
    )
}

export default BackButton;
