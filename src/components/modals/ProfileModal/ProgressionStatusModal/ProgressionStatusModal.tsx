import React from 'react';
import {
    Stack,
    Flex,
    Box
} from "@chakra-ui/react"
import { useUser } from '../../../../hooks';

// Components
import LoadingState from '../../../LoadingState';
import IgnoranceProgress from '../../../IgnoranceCoinsDisplay/IgnoranceProgress';
import StatusProgressionBar from './StatusProgressionBar';
import { AGILITY, LEADERSHIP } from '../../../../utils/constants/statusConstants';
import { getStatusPoints } from '../../../../utils/statusUtils';

// Images
import CoinsDisplay from '../../../IgnoranceCoinsDisplay/CoinsDisplay';
import UserAvatar from '../../../UserAvatar';


const ProgressionStatusModal = () => {
    const { userData } = useUser();

    return (
        <Flex h="100%" w="100%" flexDirection="column" alignItems="center" justifyContent="space-evenly">
            {
                userData.status !== undefined ? (
                    <>
                        <Flex w="95%" flexDirection="row" marginTop='1.2rem' alignItems="flex-end" justifyContent="space-between">
                            <Box w="35%">
                                <Stack w="100%">
                                    <StatusProgressionBar color="orange" status={getStatusPoints(userData, AGILITY)} label="Agilidade (AGI)" isOnLeft isBlocked={userData.narrative_status.trail1 < 2} />
                                    <StatusProgressionBar status={0} marginTop="4px" label="Inovação (INO)" isOnLeft isBlocked />
                                    <StatusProgressionBar status={0} marginTop="4px" label="Estratégia (EST)" isOnLeft isBlocked />
                                </Stack>
                            </Box>
                            <Box display='flex' flexDirection='column' alignItems='center'>
                                <UserAvatar customAvatar={userData.custom_avatar} width="180px" height="180px" />
                            </Box>
                            <Box w="35%">
                                <Stack w="100%">
                                    <StatusProgressionBar status={getStatusPoints(userData, LEADERSHIP)} isBlocked label="Liderança (LID)" />
                                    <StatusProgressionBar status={0} isBlocked marginTop="4px" label="Gestão de mudanças (GM)" />
                                    <StatusProgressionBar status={0} isBlocked marginTop="4px" label="Gestão de projetos (GP)" />
                                </Stack>
                            </Box>
                        </Flex>
                        <Flex w="90%" h="25%" flexDirection="row" justifyContent="space-between" alignItems="flex-end" marginBottom='1rem' >
                            <IgnoranceProgress
                                ignorance={userData.ignorance}
                                position='top'
                            />
                            <CoinsDisplay
                                value={userData.coins}
                                position='top'
                            />
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
