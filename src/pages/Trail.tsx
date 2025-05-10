import React, { useEffect, useState, SetStateAction, useRef } from 'react';
import {
    Flex,
    Box,
    Center,
    Tooltip,
    Image,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Text,
    Button,
    ModalHeader,
    ModalCloseButton,
    useMediaQuery,
} from '@chakra-ui/react';
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
import { FINAL_QUIZ_SINK, S3_LOCKED_STAMP } from '../utils/constants/constants';
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
import { MobileIgnorancePremiumIcons } from '../components/IgnoranceCoinsDisplay/MobileIgnorancePremiumIcons';
import { MobileNavIcon } from '../components/NavigationComponents/MobileNavIcon';
import StampIcon from '../components/StampIcon';
import MediaQueriesEnum from '../utils/enums/mediaQueries';

const Trail = () => {

    const location = useLocation();
    const trailName = location.state.trail as trailEnum;
    const trailService = new TrailServices();
    const userService = new UserServices();
    const { userData, getNewUserInfo } = useUser();
    const { changeSoundtrack } = useSoundtrack();
    const { getNewTrailInfo, trailData } = useTrail();
    const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP)
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAnimationLoading, setIsAnimationLoading] = useState<boolean>(true);
    const [trailPageIndex, setTrailPageIndex] = useState(0);
    const [script, setScript] = useState<IScript[]>([]);
    const [challengeText, setChallengeText] = useState<string>();
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

    const modulesMobilePositions = [
        { top: "69dvh", left: "260px" },
        { top: "52dvh", left: "650px" },
        { top: "71dvh", left: "1000px" },
        { top: "64dvh", left: "1260px" },
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

        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: 0,
                behavior: 'smooth',
            });
        }
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

    const renderMobileStamps = () => (
        <Flex
            top="20px"
            right="16px"
            gap="2px"
            position="absolute"
        >
            {
                trailData?.trailPages[trailPageIndex].modules.map((item, index) => {
                    return (
                        <StampIcon
                            key={index}
                            size="60px"
                            stampImage={item.isCompleted ? trailData?.stampImage as string : S3_LOCKED_STAMP}
                        />
                    )
                })
            }
        </Flex>
    )

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
		<Box
			position='relative'
			top='0'
			left='0'
			w='100vw'
			h='100dvh'
			backgroundSize='cover'
            overflowY="hidden"
		>
			<MobileIgnorancePremiumIcons />
			<MobileNavIcon
				showGoBack
				showOracle={trailData?.oracle.isAvailable}
				trail={trailName}
			/>

			{!isDesktop && renderMobileStamps()}
			<Box
				position={{ base: 'absolute', md: 'static' }}
				margin={{ base: '0 auto', md: 'initial' }}
				overflowX={{ base: 'scroll', md: 'visible' }}
				overflowY={{ base: 'hidden', md: 'visible' }}
				width={{ base: '100%', md: 'auto' }}
				height={{ base: '100dvh', md: 'auto' }}
				ref={scrollRef}
			>
				<Box
					display={{ base: 'flex', md: 'block' }}
					width={{ base: '1500px', md: 'auto' }}
				>
					<VideoBackground
						key={`${trailData?.trailName}-${trailPageIndex}`}
						position={isDesktop ? 'absolute' : 'relative'}
						handleLoading={() => setIsAnimationLoading(false)}
						source={getBackgroundAnimation()}
					/>

					{isLoading || isAnimationLoading || !trailData ? (
						<></>
					) : (
						<Flex justifyContent='space-between'>
							{trailPageIndex > 0 && (
								<Box position='absolute' top='60vh' left='10vw'>
									<NavIcon
										image={
											<FaArrowLeft
												size={55}
												color={
													colorPalette.secondaryColor
												}
											/>
										}
										onClick={() => handleChangePage(-1)}
										size='normal'
										mouseOver='Voltar na trilha'
									/>
								</Box>
							)}
							{trailData.trailPages[trailPageIndex].modules
								.slice(0, 4)
								.map((item, index) => {
									const top = isDesktop
										? item.top ||
										  modulesPositions[index].top
										: item.topMobile ??
										  modulesMobilePositions[index].top;
									const left = isDesktop
										? item.left ||
										  modulesPositions[index].left
										: item.leftMobile ??
										  modulesMobilePositions[index].left;
									return (
										<ModuleModalV2
											key={item._id}
											moduleInfo={item}
											top={top}
											left={left}
										/>
									);
								})}
							{trailData.finalChallenge.icon ? (
								<Center
									_hover={{
										cursor: 'pointer',
										transform: 'scale(2.2)',
									}}
									transition='all 0.2s ease'
									width='4rem'
									height='4rem'
									onClick={() => {
										handleFinalChallenge();
									}}
									position='absolute'
									top={'40vh'}
									left={isDesktop ? '70vw' : '1000px'}
								>
									<Tooltip
                                        isDisabled={!isDesktop}
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
							) : null}
							{trailPageIndex <
								trailData.trailPages.length - 1 && (
								<Box
									position='absolute'
									top='60vh'
									right={isDesktop ? '5vw' : undefined}
									left={isDesktop ? undefined : '1400px'}
								>
									<NavIcon
										image={
											<FaArrowRight
												size={55}
												color={
													colorPalette.secondaryColor
												}
											/>
										}
										onClick={() => handleChangePage(1)}
										size='normal'
										mouseOver='Avançar pela trilha'
									/>
								</Box>
							)}
						</Flex>
					)}
				</Box>
			</Box>

			{isLoading || isAnimationLoading || !trailData ? (
				<LoadingOverlay />
			) : (
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
							modules={
								trailData.trailPages[trailPageIndex].modules
							}
							stampImage={trailData.stampImage}
						/>
					</Flex>

					{script.length ? (
						<DefaultNarrativeModal
							isOpen={narrativeIsOpen}
							onToggle={narrativeOnToggle}
							script={script}
							endScriptFunction={onEndNarrative}
						/>
					) : null}

					<Modal
						isOpen={modalIsOpen}
						onClose={handleCloseChallengeModal}
						size='4xl'
					>
						<ModalOverlay />
						<ModalContent
							height='34rem'
							fontFamily={fontTheme.fonts}
						>
							<Box
								w='25%'
								bg={colorPalette.primaryColor}
								h='25rem'
								position='absolute'
								zIndex='-1'
								left='0'
								top='0'
								borderTopStartRadius='5px'
								clipPath='polygon(0% 0%, 55% 0%, 0% 100%)'
							/>
							{challengeInfo.isComplete ||
							!challengeInfo.isAvailable ||
							challengeInfo.isBlocked ? (
								<>
									<ModalBody
										d='flex'
										mt='-1rem'
										flexDirection='column'
										alignItems='center'
										justifyContent='space-between'
									>
										<Flex
											w='65%'
											h='100%'
											justifyContent='space-between'
											flexDirection='column'
											marginBottom='0.8rem'
										>
											<Text
												w='100%'
												marginTop='5rem'
												fontSize='2rem'
												lineHeight='9vh'
												textAlign='center'
												fontWeight='normal'
											>
												{challengeText}
											</Text>
											<Button
												bgColor={
													colorPalette.secondaryColor
												}
												width='45%'
												alignSelf='center'
												color={
													colorPalette.buttonTextColor
												}
												height='4rem'
												fontSize='1.4rem'
												_hover={{
													transform: 'scale(1.1)',
												}}
												onClick={
													handleCloseChallengeModal
												}
											>
												Okay!
											</Button>
										</Flex>
									</ModalBody>
								</>
							) : (
								<>
									<ModalHeader
										d='flex'
										justifyContent='center'
										mt='1.4rem'
									>
										<Text
											ml='2.3rem'
											w='75%'
											fontSize='1.4rem'
											textAlign='center'
											fontWeight='normal'
										>
											{challengeText}
										</Text>
										<ModalCloseButton
											color={colorPalette.closeButton}
											size='lg'
										/>
									</ModalHeader>

									<ModalBody
										d='flex'
										mt='-1rem'
										flexDirection='column'
										alignItems='center'
										justifyContent='space-between'
									>
										<Image
											src={horizon}
											w={{ base: '100%', md: '65%' }}
											h={{ base: '60%', md: '75%' }}
										/>

										<Flex
											w={{ base: "100%", md: '65%' }}
                                            gap="16px"
											justifyContent='space-between'
											marginBottom='0.8rem'
										>
											<Button
												bgColor={
													colorPalette.confirmButton
												}
												width={{
													base: '200px',
													md: '45%',
												}}
												height='4rem'
												fontSize='1.2rem'
												_hover={{
													transform: 'scale(1.1)',
												}}
												onClick={
													openChallengeConfirmation
												}
											>
												Vamos nessa!
											</Button>
											<Button
												bgColor={
													colorPalette.closeButton
												}
												width={{
													base: 'fit-content',
													md: '45%',
												}}
												height='4rem'
												fontSize='1.2rem'
												_hover={{
													transform: 'scale(1.1)',
												}}
												onClick={
													handleCloseChallengeModal
												}
											>
												Ainda não!
											</Button>
										</Flex>
									</ModalBody>
								</>
							)}
						</ModalContent>
					</Modal>
					{finalChallengeInfo?.questions ? (
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
					) : null}
				</>
			)}

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
		</Box>
	);
}

export default Trail;
