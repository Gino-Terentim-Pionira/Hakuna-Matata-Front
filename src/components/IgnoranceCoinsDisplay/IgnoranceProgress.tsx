import React from 'react';
import { Box, Text, Tooltip, useMediaQuery } from '@chakra-ui/react';

// Styles
import font from '../../styles/base';
import colorPalette from '../../styles/colorPalette';
import { WISDOM } from '../../utils/constants/mouseOverConstants';
import { PositionProps } from '../../utils/props';
import useIgnoranceFilter from '../../hooks/useIgnoranceFilter';
import MediaQueriesEnum from '../../utils/enums/mediaQueries';


const IgnoranceProgress = ({ ignorance, position, width }: {
    ignorance: number,
    position: PositionProps,
    width?: string
}) => {
    const progressBar = Math.floor(100 - ignorance);
    const {isIgnoranceFilterOn} = useIgnoranceFilter();
	const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

	return (
		<Tooltip isDisabled={!isDesktop} hasArrow placement={position} label={WISDOM}>
			<Box
				position='relative'
				height='32px'
				width={ width ?? '392px'}
				maxWidth="392px"
				backgroundColor={colorPalette.grayBackground}
				borderWidth='3px'
				borderColor={colorPalette.blackBorder}
				borderRadius='100'
				overflow='hidden'
				boxShadow='0px 4px 5px rgba(0, 0, 0, 0.14)'
			>
				<Box
					position='relative'
					width={`${progressBar}%`}
					height='100%'
					backgroundColor={colorPalette.progressOrange}
				>
					<Text
						position='absolute'
						marginLeft='17px'
						whiteSpace='nowrap'
						top='5%'
						color={colorPalette.blackBorder}
						fontFamily={font.fonts}
						fontWeight='bold'
						fontSize='16px'
					>
						Nível de sabedoria
					</Text>
				</Box>
				{isIgnoranceFilterOn && (
					<Text
						position='absolute'
						top='5%'
						right='16px'
						color={colorPalette.backgroundColor}
						fontFamily={font.fonts}
						fontWeight='bold'
						fontSize='16px'
					>
						{`${progressBar}%`}
					</Text>
				)}
			</Box>
		</Tooltip>
	);
}

export default IgnoranceProgress;