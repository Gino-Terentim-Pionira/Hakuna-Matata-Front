import React, { useEffect, useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { useTrail, useUser } from '../hooks';
import trailEnum from '../utils/enums/trail';
import VideoBackground from '../components/VideoBackground';
import LoadingOverlay from '../components/LoadingOverlay';
import IgnorancePremiumIcons from '../components/IgnoranceCoinsDisplay/IgnorancePremiumIcons';
import NavActions from '../components/NavigationComponents/NavActions';
import ModuleModalV2 from '../components/modals/ModuleModalV2';
import NavIcon from '../components/NavigationComponents/NavIcon';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import colorPalette from '../styles/colorPalette';
import { useSoundtrack } from '../hooks/useSoundtrack';

const Trail = () => {

    const { userData, getNewUserInfo } = useUser();
    const { changeSoundtrack } = useSoundtrack();
    const { getNewTrailInfo, trailData } = useTrail();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAnimationLoading, setIsAnimationLoading] = useState<boolean>(true);
    const [trailPageIndex, setTrailPageIndex] = useState(0);

    const modulesPositions = [
        { top: "74vh", left: "19vw" },
        { top: "56vh", left: "45vw" },
        { top: "75vh", left: "60vw" },
        { top: "75vh", left: "78vw" },
    ];

    const handleChangePage = (offset: number) => {
        setIsAnimationLoading(true);
        setTrailPageIndex(trailPageIndex + offset);
    }

    const fetchData = async () => {
        if (!trailData) {
            await getNewTrailInfo(trailEnum.CHEETAH);
        }
        if (!userData._id) {
            await getNewUserInfo();
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (trailData && trailData.soundtrack) {
            changeSoundtrack('', trailData.soundtrack);
        }
    }, [trailData]);

    return (
        <>
            <VideoBackground
                key={trailPageIndex}
                handleLoading={() => setIsAnimationLoading(false)}
                source={trailData?.trailPages[trailPageIndex].backgroundDay || null}
            />
            {
                (isLoading || isAnimationLoading || !trailData) ? <LoadingOverlay /> : (
                    <>
                        <Flex
                            width='92.5%'
                            height='100%'
                            justifyContent='space-between'
                            alignItems='flex-start'
                            margin='auto'
                        >
                            <NavActions logout={() => null} />

                            <IgnorancePremiumIcons
                                ignorance={userData.ignorance}
                                showStatus={false}
                            />


                        </Flex>
                        <Flex
                            justifyContent='space-between'
                            margin='2vw'
                        >
                            {
                                trailPageIndex > 0 && <Box
                                    position='absolute'
                                    top='60vh'
                                    left='5vw'
                                >
                                    <NavIcon
                                        image={<FaArrowLeft size={55} color={colorPalette.secondaryColor} />}
                                        onClick={()=>handleChangePage(-1)}
                                        size='normal'
                                        mouseOver='Voltar na trilha'
                                    />
                                </Box>
                            }
                            {
                                trailData.trailPages[trailPageIndex].modules.slice(0, 4).map((item, index) => (
                                    <ModuleModalV2
                                        key={item._id}
                                        moduleInfo={item}
                                        top={modulesPositions[index].top}
                                        left={modulesPositions[index].left}
                                    />
                                ))
                            }
                            {
                                trailPageIndex < trailData.trailPages.length - 1 && <Box
                                    position='absolute'
                                    top='60vh'
                                    right='5vw'
                                >
                                    <NavIcon
                                        image={<FaArrowRight size={55} color={colorPalette.secondaryColor} />}
                                        onClick={()=>handleChangePage(1)}
                                        size='normal'
                                        mouseOver='Avançar pela trilha'
                                    />
                                </Box>
                            }
                        </Flex>
                    </>
                )
            }
        </>
    )
}

export default Trail;
