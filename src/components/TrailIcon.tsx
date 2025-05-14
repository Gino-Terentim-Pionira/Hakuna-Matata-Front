import React, { FC } from 'react';
import { Image, Tooltip, useMediaQuery } from '@chakra-ui/react';
import MediaQueriesEnum from '../utils/enums/mediaQueries';

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
    const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

    return (
        <Tooltip
            isDisabled={!isDesktop}
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
            width={{base: "80px", md: "5.74vw"}}
            onClick={onClick}
            />
        </Tooltip>
    )
}

export default TrailIcon;
