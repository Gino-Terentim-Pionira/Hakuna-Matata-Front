import React from 'react';
import {
    Stack,
    Text,
    Flex,
    Box,
    Image
} from "@chakra-ui/react"
import { useUser } from '../../../hooks';

// Components
import LoadingState from '../../LoadingState';
import IgnoranceProgress from '../../IgnoranceProgress';
import StatusProgressionBar from './StatusProgressionBar';

// Styles
import fontTheme from '../../../styles/base';

// Images
import Profile from '../../../assets/icons/profile.svg';
import Coins from '../../../assets/icons/coinicon.svg';

const ProgressionStatusModal = () => {
    const { userData } = useUser();

    return (
        <Flex h="100%" w="100%" flexDirection="column" alignItems="center" justifyContent="space-evenly">
            {
                userData.status !== undefined ? (
                    <>
                        <Flex w="95%" flexDirection="row" marginTop='1.2rem' alignItems="flex-end" justifyContent="space-between">
                            <Box w="35%" align='right'>
                                <Stack w="100%">
                                    <StatusProgressionBar status={userData.status[0]} label="Agilidade (AGI)" isBlocked={userData.narrative_status.trail1 < 2} />
                                    <StatusProgressionBar status={userData.status[2]} marginTop="4px" label="Inovação (INO)" isOnLeft isBlocked />
                                    <StatusProgressionBar status={userData.status[4]} marginTop="4px" label="Estratégia (EST)" isOnLeft isBlocked />
                                </Stack>
                            </Box>
                            <Box display='flex' flexDirection='column' alignItems='center'>

                                <Image src={Profile} />
                                <Text fontSize='3.5rem' fontFamily={fontTheme.fonts} width='100%' align='center' marginBottom='-2rem'>
                                    {
                                        userData ? (
                                            Math.ceil((userData.status[0] + userData.status[1] + userData.status[2] + userData.status[3] + userData.status[4] + userData.status[5]) / 6)
                                        ) : null
                                    }
                                </Text>
                            </Box>
                            <Box w="35%">
                                <Stack w="100%">
                                    <StatusProgressionBar status={userData.status[1]} isBlocked label="Liderança (LID)" />
                                    <StatusProgressionBar status={userData.status[3]} isBlocked marginTop="4px" label="Gestão de mudanças (GM)" />
                                    <StatusProgressionBar status={userData.status[5]} isBlocked marginTop="4px" label="Gestão de projetos (GP)" />
                                </Stack>
                            </Box>
                        </Flex>
                        <Flex w="90%" h="25%" flexDirection="row" justifyContent="space-between" alignItems="flex-end" marginBottom='1rem' >
                            <IgnoranceProgress ignorance={userData.ignorance} />
                            <Flex align="center">
                                <Text fontSize="1.8rem" fontWeight="normal" fontFamily={fontTheme.fonts} marginRight="8px">{userData.coins}</Text>
                                <Image src={Coins} />
                            </Flex>
                        </Flex>
                    </>
                ) : (
                    <LoadingState />
                )
            }
        </Flex>

    )
}

export default ProgressionStatusModal;
