import { Center, Image, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';

import icon_map from '../../assets/icons/icon_map.svg';
import icon_map_opened from '../../assets/icons/icon_map_opened.svg';
import colorPalette from '../../styles/colorPalette';
import { PositionProps } from '../../utils/props';

type NavIconProps = {
    image: string;
    onClick: VoidFunction;
    size: 'big' | 'normal' | 'small';
    isMap?: boolean;
    mouseOver: string;
    marginTop?:string;
    position?: PositionProps
}

const NavIcon: FC<NavIconProps> = ({
    image, 
    onClick, 
    size,
    isMap,
    mouseOver,
    marginTop,
    position
}) => {

    const defineSize = () => {
        switch (size) {
            case 'big':
                return '6.55rem'
                break;
            
            case 'normal':
                return '4.5rem'
                break;
            case 'small':
                return '3.75rem'
                break;
        }
    }

    return (
        <Tooltip
            hasArrow
            placement={position || 'right'}
            gutter={14}
            label={mouseOver}
        >
            <Center
            _hover={{
              cursor: 'pointer',
              transform: 'scale(1.1)',
            }}
            transition='all 0.2s ease'
            mt={marginTop || '8px'}
            border={`2px solid ${colorPalette.blackBorder}`}
            borderRadius='4.5rem'
            width= {defineSize()}
            height= {defineSize()}
            bg='white'
            onClick={onClick}
          >
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
          </Center>
        </Tooltip>
    )
}

export default NavIcon;