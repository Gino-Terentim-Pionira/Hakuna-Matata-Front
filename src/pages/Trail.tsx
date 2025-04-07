import React, { useEffect, useState, SetStateAction } from 'react';
import { Flex, Box, Center, Tooltip, Image, useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody, Text, Button, ModalHeader, ModalCloseButton } from '@chakra-ui/react';
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
import { FINAL_CHALLENGE } from '../utils/constants/mouseOverConstants';
import FinalChallengeScript from '../utils/scripts/finalChallenge/FinalChallengeScript';
import DefaultNarrativeModal from '../components/modals/Narrative/DefaultNarrativeModal';
import fontTheme from '../styles/base';
import AlertModal from '../components/modals/AlertModal';
import { FINAL_QUIZ_SINK } from '../utils/constants/constants';
import horizon from '../assets/horizon.webp';
import { errorCases } from '../utils/errors/errorsCases';
import { TrailServices } from '../services/TrailServices';
import { Question, IScript } from '../recoil/trailRecoilState';
import FinalChallengeQuiz from '../components/Quiz/FinalChallengeQuiz';
import api from '../services/api';
import { UserServices } from '../services/UserServices';
import { useLocation } from 'react-router-dom';
import { LogOut } from '../services/auth';
import { verifyIsDayTime } from '../utils/algorithms/date';
import QuizAlertModal from '../components/Quiz/QuizAlertModal';

const Trail = () => {

    const location = useLocation();
    const trailName = location.state.trail as trailEnum;
    const trailService = new TrailServices();
    const userService = new UserServices();
    const { userData, getNewUserInfo } = useUser();
    const { changeSoundtrack } = useSoundtrack();
    const { getNewTrailInfo, trailData } = useTrail();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAnimationLoading, setIsAnimationLoading] = useState<boolean>(true);
    const [trailPageIndex, setTrailPageIndex] = useState(0);
    const [script, setScript] = useState<IScript[]>([]);
    const [challengeText, setChallengeText] = useState<string>("");
    const [challengeInfo, setChallengeInfo] = useState({
        isAvailable: false,
        isComplete: false,
        isBlocked: true,
        remainingModules: 0
    });
    const [onEndNarrative, setOnEndNarrative] = useState<(() => void) | undefined>(undefined);
    const [alertInfo, setAlertInfo] = useState<{
        isOpen: boolean,
        title: string | undefined,
        body: string | undefined,
        buttonText: string | undefined,
        buttonFunction: (() => void) | undefined,
        isLoading: boolean
    }>({
        isOpen: false,
        title: undefined,
        body: undefined,
        buttonText: undefined,
        buttonFunction: undefined,
        isLoading: false
    });
    const [finalChallengeInfo, setFinalChallengeInfo] = useState<{
        questions: Question[],
        totalQuestions: number
    }>();

    const { isOpen: narrativeIsOpen,
        onOpen: narrativeOnOpen,
        onClose: narrativeOnClose,
        onToggle: narrativeOnToggle
    } = useDisclosure();

    const {
        isOpen: modalIsOpen,
        onClose: modalOnClose,
        onOpen: modalOnOpen,
    } = useDisclosure();

    const {
        isOpen: finalChallengeIsOpen,
        onClose: finalChallengeOnClose,
        onOpen: finalChallengeOnOpen,
        onToggle: finalChallengeOnToggle
    } = useDisclosure();

    const modulesPositions = [
        { top: "74vh", left: "19vw" },
        { top: "56vh", left: "45vw" },
        { top: "75vh", left: "60vw" },
        { top: "75vh", left: "78vw" },
    ];

    const finishFinalChallenge = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            await api.patch(`user/addmodule/${userId}`, {
                module_id: trailData?.finalChallenge.id
            });
        } catch (error) {
            handleError();
        }
    }

    const payChallengeTax = async () => {
        const value = FINAL_QUIZ_SINK;
        const _userId: SetStateAction<string> | null = sessionStorage.getItem(
            '@pionira/userId',
        );
        const userCoins = userData.coins;

        if (userCoins >= value) {
            try {
                setAlertInfo((prevAlertInfo) => ({
                    ...prevAlertInfo,
                    isLoading: true
                }));
                const finalQuestions = await trailService.startFinalChallenge(_userId as string, trailName as string);
                getNewUserInfo();

                setFinalChallengeInfo(finalQuestions);
                finalChallengeOnOpen();

                handleCloseAlert();
            } catch (error) {
                setAlertInfo((prevAlertInfo) => ({
                    ...prevAlertInfo,
                    body: 'Houve um erro, tente novamente mais tarde',
                    buttonText: 'Voltar',
                    isLoading: false,
                    buttonFunction: handleCloseAlert
                }));
            }
        } else {
            setAlertInfo((prevAlertInfo) => ({
                ...prevAlertInfo,
                body: 'Poxa! Parece que você não tem moedas suficientes!',
                buttonText: 'Voltar',
                isLoading: false,
                buttonFunction: handleCloseAlert
            }));
        }

        handleCloseChallengeModal();
    }

    const handleLogOut = () => {
        setAlertInfo((prevAlertInfo) => ({
            ...prevAlertInfo,
            isOpen: true,
            title: 'Logout',
            body: `Tem certeza que você deseja sair da Savana?`,
            buttonText: 'Sair',
            buttonFunction: LogOut
        }));
    }

    const openChallengeConfirmation = () => {
        setAlertInfo((prevAlertInfo) => ({
            ...prevAlertInfo,
            isOpen: true,
            title: 'Desafio Final',
            body: `Para fazer o desafio final são necessárias ${FINAL_QUIZ_SINK} joias do conhecimento! Tem certeza que deseja prosseguir?`,
            buttonText: 'Pagar',
            buttonFunction: payChallengeTax
        }));
    }

    const handleCloseAlert = () => {
        setAlertInfo({
            isOpen: false,
            title: undefined,
            body: undefined,
            buttonText: undefined,
            buttonFunction: undefined,
            isLoading: false
        });
    }

    const handleError = () => {
        setAlertInfo({
            isOpen: true,
            title: 'Ops!',
            body: errorCases.SERVER_ERROR,
            buttonText: 'Recarregar',
            buttonFunction: () => window.location.reload(),
            isLoading: false
        });
    }

    const handleChangePage = (offset: number) => {
        setIsAnimationLoading(true);
        setTrailPageIndex(trailPageIndex + offset);
    }

    const handleCloseChallengeModal = () => {
        setOnEndNarrative(undefined);
        modalOnClose();
    }

    const handleOpenChallengeModal = () => {
        narrativeOnClose();
        modalOnOpen();
    }

    const handleFinalChallenge = () => {
        if (trailData) {
            if (challengeInfo.isComplete) {
                setChallengeText('Você já completou este desafio, Viajante. Parabéns, novos horizontes te esperam!');
                handleOpenChallengeModal();
            } else {
                const challengeScript = FinalChallengeScript(
                    trailData.finalChallenge.image as string,
                    trailName,
                    challengeInfo.remainingModules,
                    challengeInfo.isAvailable,
                    challengeInfo.isBlocked
                );

                setScript(challengeScript);

                if (!challengeInfo.isAvailable) {
                    setChallengeText('Este desafio ainda não está disponível, Viajante.');
                } else if (challengeInfo.isBlocked) {
                    setChallengeText(`Você ainda não pode realizar este desafio. Complete ${challengeInfo.remainingModules} módulo${challengeInfo.remainingModules > 1 ? 's' : null} e volte novamente!`);
                } else {
                    setChallengeText('Você está pronto para este desafio, Viajante!');
                }

                setOnEndNarrative(() => handleOpenChallengeModal);
                narrativeOnOpen();
            }
        }
    }

    const handleAddNarrativeToUser = async (userId: string, narrativeId: string) => {
        await userService.addNarrativeToUser(userId, narrativeId);
        await getNewTrailInfo(trailName, true);
    }

    const handleCloseTrailNarrative = (userId: string, narrativeId: string) => {
        handleAddNarrativeToUser(userId, narrativeId);
        narrativeOnClose();
    }

    const getBackgroundAnimation = () => {
        if (trailData) {
            const animationURL = verifyIsDayTime() ? trailData?.trailPages[trailPageIndex].backgroundDay : trailData?.trailPages[trailPageIndex].backgroundNight;
    
            return animationURL;
        }
    }

    const fetchData = async () => {
        try {
            await getNewTrailInfo(trailName);
            if (!userData._id) {
                await getNewUserInfo();
            }
            setIsLoading(false);
        } catch (error) {
            handleError();
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (trailData && trailData.soundtrack) {
            changeSoundtrack('', trailData.soundtrack);
            setChallengeInfo({
                isAvailable: trailData.finalChallenge.isAvailable,
                isBlocked: trailData.finalChallenge.isBlocked,
                isComplete: trailData.finalChallenge.isComplete,
                remainingModules: trailData.totalModules - trailData.stamps
            });
        }
        if (trailData && userData && trailData.newScript) {
            const narrativeId = trailData.newScript._id;
            setScript(trailData.newScript.scriptObject);
            setOnEndNarrative(() => () => handleCloseTrailNarrative(userData._id, narrativeId));
            narrativeOnOpen();
        }
    }, [trailData, userData]);

    return (
        <>
            <VideoBackground
                key={`${trailData?.trailName}-${trailPageIndex}`}
                handleLoading={() => setIsAnimationLoading(false)}
                source={getBackgroundAnimation()}
            />
            <AlertModal
                isOpen={alertInfo.isOpen}
                onClose={handleCloseAlert}
                onClickClose={handleCloseAlert}
                alertTitle={alertInfo.title}
                alertBody={alertInfo.body}
                buttonBody={
                    <Button
                        color='white'
                        _hover={{ bg: colorPalette.primaryColor }}
                        bg={colorPalette.primaryColor}
                        onClick={alertInfo.buttonFunction}
                        isLoading={alertInfo.isLoading}
                    >
                        {alertInfo.buttonText}
                    </Button>
                }
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
                            <NavActions logout={handleLogOut} />

                            <IgnorancePremiumIcons
                                ignorance={userData.ignorance}
                                showStatus={false}
                                dontShowIgnorance={true}
                                trail={trailName}
                                dontShowOracle={!trailData.oracle.isAvailable}
                                modules={trailData.trailPages[trailPageIndex].modules}
                                stampImage={trailData.stampImage}
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
                                    left='10vw'
                                >
                                    <NavIcon
                                        image={<FaArrowLeft size={55} color={colorPalette.secondaryColor} />}
                                        onClick={() => handleChangePage(-1)}
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
                                        top={item.top || modulesPositions[index].top}
                                        left={item.left || modulesPositions[index].left}
                                    />
                                ))
                            }
                            {
                                trailData.finalChallenge.icon ? (
                                    <Center
                                        _hover={{
                                            cursor: 'pointer',
                                            transform: 'scale(2.2)',
                                        }}
                                        transition='all 0.2s ease'
                                        width='4rem'
                                        height='4rem'
                                        onClick={() => {
                                            handleFinalChallenge()
                                        }}
                                        position='absolute'
                                        top='40vh'
                                        left='70vw'
                                    >
                                        <Tooltip
                                            hasArrow
                                            placement='top'
                                            gutter={35}
                                            label={FINAL_CHALLENGE(trailName)}
                                        >
                                            <Image
                                                src={trailData.finalChallenge.icon}
                                                width='90%'
                                                height='90%'
                                            />
                                        </Tooltip>
                                    </Center>
                                ) : null
                            }
                            {
                                trailPageIndex < trailData.trailPages.length - 1 && <Box
                                    position='absolute'
                                    top='60vh'
                                    right='5vw'
                                >
                                    <NavIcon
                                        image={<FaArrowRight size={55} color={colorPalette.secondaryColor} />}
                                        onClick={() => handleChangePage(1)}
                                        size='normal'
                                        mouseOver='Avançar pela trilha'
                                    />
                                </Box>
                            }
                        </Flex>

                        {
                            script.length ? (
                                <DefaultNarrativeModal
                                    isOpen={narrativeIsOpen}
                                    onToggle={narrativeOnToggle}
                                    script={script}
                                    endScriptFunction={onEndNarrative}
                                />
                            ) : null
                        }

                        <QuizAlertModal
                            modalIsOpen={modalIsOpen}
                            modalOnClose={handleCloseChallengeModal}
                            title={challengeText}
                            image={horizon}
                            confirmFunction={challengeInfo.isComplete || !challengeInfo.isAvailable || challengeInfo.isBlocked ? handleCloseChallengeModal : openChallengeConfirmation}
                            firstButtonLabel={challengeInfo.isComplete || !challengeInfo.isAvailable || challengeInfo.isBlocked ? "Voltar!" : undefined}
                            oneButtonOption={true}
                        />

                        {
                            finalChallengeInfo?.questions ? (
                                <FinalChallengeQuiz
                                    openModal={finalChallengeIsOpen}
                                    closeModal={finalChallengeOnClose}
                                    onToggle={finalChallengeOnToggle}
                                    QuestionInfo={finalChallengeInfo.questions}
                                    totalQuestions={finalChallengeInfo.totalQuestions}
                                    trailName={trailName}
                                    image={trailData.finalChallenge.image as string}
                                    completeModuleFunction={finishFinalChallenge}
                                />
                            ) : null
                        }
                    </>
                )
            }
        </>
    )
}

export default Trail;
