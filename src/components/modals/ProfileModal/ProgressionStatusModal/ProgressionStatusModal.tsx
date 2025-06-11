import React, { useState, useEffect } from 'react';
import {
	Flex,
	Text,
	Grid,
	Tooltip, useMediaQuery,
} from '@chakra-ui/react';
import { useUser } from '../../../../hooks';

// Components
import LoadingState from '../../../LoadingState';
import IgnoranceProgress from '../../../IgnoranceCoinsDisplay/IgnoranceProgress';

// Images
import CoinsDisplay from '../../../IgnoranceCoinsDisplay/CoinsDisplay';
import { IStamps, TrailServices } from '../../../../services/TrailServices';
import StampIcon from '../../../StampIcon';
import fontTheme from '../../../../styles/base';
import colorPalette from '../../../../styles/colorPalette';
import MediaQueriesEnum from '../../../../utils/enums/mediaQueries';


const ProgressionStatusModal = () => {
    const { userData } = useUser();
    const trailService = new TrailServices();
    const [stamps, setStamps] = useState<IStamps[]>();

    const fetchStampsInfo = async (userId: string) => {
        if (!stamps) {
            const stampsInfo = await trailService.getAllStamps(userId);
            setStamps(stampsInfo);
        }
    }
	const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

    useEffect(() => {
        fetchStampsInfo(userData._id);
    }, []);

    return (
		<Flex h='100%' w='100%' flexDirection='column'>
			<Flex
				w='90%'
				flexDirection={{ base: 'column', md: 'row' }}
				alignSelf='center'
				justifyContent='space-between'
				alignItems='flex-end'
				marginTop='24px'
			>
				<IgnoranceProgress
					width='100%'
					ignorance={userData.ignorance}
					position='top'
				/>
				<CoinsDisplay coins={userData.coins} premiumCoins={userData.premiumCoins} position='top' />
			</Flex>

			{stamps ? (
				<Grid
					marginTop='32px'
					marginLeft='24px'
					marginRight={{ base: '24px', md: 'auto' }}
					templateColumns={{
						base: 'repeat(2, 1fr)',
						md: 'repeat(5, 1fr)',
					}}
					columnGap={{base: "32px", md: "32px"}}
                    rowGap={{base: "0", md: "32px"}}
					maxHeight={{ base: '100%', md: '350px' }}
					overflowY={{ base: 'hidden', md: 'auto' }}
					sx={{
						'&::-webkit-scrollbar': {
							width: '4px',
							height: '4px',
							borderRadius: '8px',
						},
						'&::-webkit-scrollbar-thumb': {
							background: '#9D9D9D',
							borderRadius: '10px',
						},
						'&::-webkit-scrollbar-thumb:hover': {
							background: '#555',
						},
						'&::-moz-scrollbar': {
							width: '4px',
							height: '4px',
							borderRadius: '8px',
						},
						'&::-moz-scrollbar-thumb': {
							background: '#9D9D9D',
							borderRadius: '10px',
						},
						'&::-moz-scrollbar-thumb:hover': {
							background: '#555',
						},
					}}
				>
					{stamps.map((item) => {
						return (
							<Tooltip
								isDisabled={!isDesktop}
								placement='right'
								hasArrow
								label={`Você possui ${item.stamps} carimbo${
									item.stamps == 1 ? '' : 's'
								} de ${item.statusName} da trilha do ${
									item.trailName
								}`}
							>
								<Flex
                                    marginBottom={{base: "32px", md: "40px"}}
									alignItems='center'
								>
									<StampIcon
										stampImage={item.stampImage}
										size='100px'
									/>
									<Text
										marginLeft='12px'
										fontFamily={fontTheme.fonts}
										fontWeight='bold'
										fontSize='36'
										color={colorPalette.greyText}
									>
										{' '}
										{item.stamps}x{' '}
									</Text>
								</Flex>
							</Tooltip>
						);
					})}
				</Grid>
			) : (
				<LoadingState />
			)}
		</Flex>
	);
}

export default ProgressionStatusModal;
