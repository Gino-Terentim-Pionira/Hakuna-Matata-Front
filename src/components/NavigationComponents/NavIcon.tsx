import { Center, Image, Tooltip, useMediaQuery } from '@chakra-ui/react';
import React, { FC, ReactElement } from 'react';
import icon_map from '../../assets/icons/icon_map.svg';
import icon_map_opened from '../../assets/icons/icon_map_opened.svg';
import colorPalette from '../../styles/colorPalette';
import { PositionProps } from '../../utils/props';
import UserAvatar from '../UserAvatar';
import { useUser } from '../../hooks';
import MediaQueriesEnum from '../../utils/enums/mediaQueries';

type NavIconProps = {
    image: string | ReactElement;
    onClick: VoidFunction;
    size: 'big' | 'normal' | 'small';
    isMap?: boolean;
    mouseOver: string;
    marginTop?: string;
    position?: PositionProps;
    cursor?: string;
}

const NavIcon: FC<NavIconProps> = ({
    image,
    onClick,
    size,
    isMap,
    mouseOver,
    marginTop,
    position,
    cursor = 'pointer'
}) => {
    const { userData } = useUser();
    const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

    const defineSize: {[key: string]: string} = {
        'big': '6.55rem',
        'normal': '4.5rem',
        'small': '3.75rem'
    }

    const renderIcon = () => {
        if (typeof image === 'string') {
            return (
                image === 'profile' ?
                    <UserAvatar customAvatar={userData.custom_avatar} avatarStyle="Transparent" width="52px" height="52px" marginBottom="4px" />
                    :
                    <Image
                        maxW={isMap ? '' : '50px'}
                        src={image}
                        marginBottom='.1rem'
                        onMouseOverCapture={(e) => {
                            if (isMap) {
                                (e.currentTarget.src = icon_map_opened)
                            }
                        }
                        }
                        onMouseOut={(e) => {
                            if (isMap) {
                                (e.currentTarget.src = icon_map)
                            }
                        }
                        }
                    />
            )
        } else return image;
    }

    return (
        <Tooltip
            isDisabled={!isDesktop}
            hasArrow
            placement={position || 'right'}
            gutter={14}
            label={mouseOver}
        >
            <Center
                _hover={{
                    cursor: cursor,
                    transform: 'scale(1.1)',
                }}
                transition='all 0.2s ease'
                mt={{ base: "0", md: marginTop || '8px'}}
                border={`2px solid ${colorPalette.blackBorder}`}
                borderRadius='4.5rem'
                width={{ base: "53px", md: defineSize[size] }}
                height={{ base: "53px", md: defineSize[size] }}
                bg='white'
                onClick={onClick}
            >
                { renderIcon() }
            </Center>
        </Tooltip>
    )
}

export default NavIcon;
