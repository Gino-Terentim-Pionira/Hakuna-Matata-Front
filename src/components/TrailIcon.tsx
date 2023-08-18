import React, { FC } from 'react';
import { Image, Tooltip } from '@chakra-ui/react';

type TrailIconProps = {
    image: string;
    onClick: VoidFunction;
    mouseOver: string;
}

const TrailIcon: FC<TrailIconProps> = ({
    image,
    onClick,
    mouseOver,
}) => {

    return (
        <Tooltip
            hasArrow
            placement='top'
            gutter={14}
            label={mouseOver}
        >
            <Image
            src={image}
            _hover={{
                cursor: 'pointer',
                transform: 'scale(1.1)',
            }}
            transition='all 0.2s ease'
            width='5.74vw'
            onClick={onClick}
            />
        </Tooltip>
    )
}

export default TrailIcon;
