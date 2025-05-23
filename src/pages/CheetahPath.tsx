import React, { useState, useRef, useEffect, SetStateAction } from 'react';
import {
    Box,
    Flex,
    Image,
    Center,
    useDisclosure,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Text,
    ModalHeader,
    ModalCloseButton,
    Tooltip, useMediaQuery,
} from '@chakra-ui/react';
import { useUser } from '../hooks';

//utils
import fontTheme from '../styles/base';
import ignoranceFilterFunction from '../utils/ignorance/ignoranceFilter';
import { useModule } from '../hooks';

//styles
import colorPalette from '../styles/colorPalette';
import './../styles/fadeEffect.css';

// Components
import AlertModal from '../components/modals/AlertModal';
import NarrativeModal from '../components/modals/Narrative/NarrativeModal';
import ModuleModal from '../components/modals/ModuleModal';
import FinalUniversalQuiz from '../components/FinalUniversalQuiz/FinalUniversalQuiz';
import IgnorancePremiumIcons from '../components/IgnoranceCoinsDisplay/IgnorancePremiumIcons';
import NavActions from '../components/NavigationComponents/NavActions';
import LoadingOverlay from '../components/LoadingOverlay';
import IgnoranceFilter from '../components/IgnoranceFilter';
import { CHEETAH_FINAL } from '../utils/constants/mouseOverConstants';
import { STATUS_LEVEL, AGILITY } from '../utils/constants/statusConstants';
import { getStatusPoints, hasEnougthStatusForFinalQuiz } from '../utils/statusUtils';

// Requisitions
import api from '../services/api';
import cheetahFreeLunch from '../utils/scripts/CheetahTrail/CheetahFreeLunch';
import cheetahBeggining from '../utils/scripts/CheetahTrail/CheetahBeggining';
import cheetahConclusion from '../utils/scripts/CheetahTrail/CheetahConclusion';
import cheetahFinalQuiz from '../utils/scripts/CheetahTrail/CheetahFinalQuiz';

// Images
import final_cheetah_icon from '../assets/icons/final_cheetah_icon.svg';
import cheetah from '../assets/sprites/cheetah/cheetah.webp';
import cheetah_bg from '../assets/modal/cheetah_banner.webp';
import ignorance100 from '../assets/ignorance/cheetahPath/ignorance_100.webp';
import ignorance75 from '../assets/ignorance/cheetahPath/ignorance_75.webp';
import ignorance50 from '../assets/ignorance/cheetahPath/ignorance_50.webp';
import ignorance25 from '../assets/ignorance/cheetahPath/ignorance_25.webp';
import { errorCases } from '../utils/errors/errorsCases';
import { FINAL_QUIZ_SINK } from '../utils/constants/constants';
import BlockedModal from '../components/modals/BlockedModal';
import cheetahTeasing from '../utils/scripts/CheetahTrail/CheetahTeasing';
import buildModuleEndScript from '../utils/scripts/BuildModuleEndScript';
import trailEnum from '../utils/enums/trail';
import VideoBackground from '../components/VideoBackground';
import { LogOut } from '../services/auth';
import { getBackgroundAnimation, pathEnum } from '../utils/algorithms/backgroundAnimation';
import { getTrailAccess, trailAccessEnum, setTrailAccess } from '../utils/localStorageUtils';
import { useSoundtrack } from '../hooks/useSoundtrack';
import MediaQueriesEnum from '../utils/enums/mediaQueries';

interface IQuiz {
    _id: string;
    name: string;
    questions_id: [
        {
            _id: string;
            description: string;
            alternatives: string[];
            answer: number;
            dificulty: string;
            score: number[];
            coins: number;
            user_id: string[];
        },
    ];
    user_id: string[];
    total_coins: number;
    dificulty: string;
    tax: number;
}
interface IQuestions {
    alternatives: string[];
    dificulty: string;
    score: number[];
    user_id: string[];
    _id: string;
    description: string;
    answer: number;
    coins: number;
}

interface IScript {
    name: string;
    image: string;
    texts: string[];
}

const CheetahPath = () => {
    const { userData, setUserData } = useUser();
    const { getNewModuleInfo, moduleData } = useModule();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const isAlertOnClose = () => setIsAlertOpen(false);
    const isAlertCoinsOnClose = () => {
        setIsAlertCoins(false);
        setIsLoading(false);
    };
    const [cheetahText, setCheetahText] = useState<string>();
    const [alertCoins, setAlertCoins] = useState<string | undefined>('');
    0;
    const [alertQuiz, setAlertQuiz] = useState<string | undefined>('');
    const [onError, setOnError] = useState(false);
    const [completeTrail, setCompleteTrail] = useState(false);
    const [isBlockedOpen, setIsBlockedOpen] = useState(false);

    const ignoranceArray = [
        ignorance100,
        ignorance75,
        ignorance50,
        ignorance25,
    ];

    const {
        isOpen: narrativeIsOpen,
        onOpen: narrativeOnOpen,
        onToggle: narrativeOnToggle,
    } = useDisclosure();

    const {
        isOpen: modalIsOpen,
        onClose: modalOnClose,
        onOpen: modalOnOpen,
    } = useDisclosure();

    const {
        isOpen: quizIsOpen,
        onClose: quizOnClose,
        onOpen: quizOnOpen,
    } = useDisclosure();

    const [questions, setQuestions] = useState<IQuestions[]>([
        {
            alternatives: [''],
            dificulty: '',
            score: [0],
            user_id: [''],
            _id: '',
            description: '',
            answer: 0,
            coins: 0,
        },
    ]);

    const [quiz, setQuiz] = useState<IQuiz>({
        _id: '',
        name: '',
        questions_id: [
            {
                _id: '',
                description: '',
                alternatives: [''],
                answer: 0,
                dificulty: '',
                score: [0],
                coins: 0,
                user_id: [''],
            },
        ],
        user_id: [''],
        total_coins: 0,
        dificulty: '',
        tax: 0,
    });

    const finishQuestionIncludes = (
        questions: IQuestions[],
        _userId: string,
    ) => {
        const res = questions.filter(
            (data: {
                alternatives: string[];
                dificulty: string;
                score: number[];
                user_id: string[];
                _id: string;
                description: string;
                answer: number;
                coins: number;
            }) => {
                return !data.user_id.includes(_userId as string);
            },
        );
        return res;
    };

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const alertOnClose = () => setIsConfirmOpen(false);
    const [alertAnswer, setAlertAnswer] = useState<string | undefined>('');
    const [isAlertCoins, setIsAlertCoins] = useState(false);
    const cancelRef = useRef<HTMLButtonElement>(null);
    const [ignoranceImage, setIgnoranceImage] = useState('');

    const [script, setScript] = useState<IScript[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAnimationLoading, setIsAnimationLoading] = useState<boolean>(true);
    const [payLoading, setPayLoading] = useState<boolean>(false);
    const [blockedMessage, setBlockedMessage] = useState<string>('');
    const { changeSoundtrack} = useSoundtrack();
    const [canDoFinalQuiz, setCanDoFinalQuiz] = useState(false);
    const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

    const logout = () => {
        setAlertAnswer('Tem certeza que você deseja sair da Savana?');
        setIsConfirmOpen(true);
    };

    const setIgnoranceFilter = (
        ignorance: number,
        ignoranceArray: string[],
    ) => {
        const filterBackgroung = ignoranceFilterFunction(
            ignorance,
            ignoranceArray,
        );
        setIgnoranceImage(filterBackgroung);
    };

    const handleNarrativeModal = (script: IScript[]) => {
        setScript(script);
        narrativeOnOpen();
    }

    const getFinalQuiz = async () => {
        const _userId: SetStateAction<string> | null = sessionStorage.getItem(
            '@pionira/userId',
        );
        const newQuiz = await api.get('/finalcheetahquiz');

        setQuiz(newQuiz.data[0]);

        const finishQuestions = finishQuestionIncludes(
            newQuiz.data[0].questions_id,
            _userId as string,
        );

        if (finishQuestions.length <= 0) {
            setQuestions(newQuiz.data[0].questions_id);
        } else {
            setQuestions(finishQuestions);
        }
    };
    //Lógica para verificar a progressão da narrativa e autalizar o script
    const checkNarrative = async () => {
        let userInfoData;
        const _userId = sessionStorage.getItem('@pionira/userId');
        if (!userData._id) {
            const { data } = await api.get(`/user/${_userId}`);
            userInfoData = data;
        } else userInfoData = userData;

        if (
            userInfoData.narrative_status.trail1 == 0 &&
            userInfoData.narrative_status.trail2 == 0
        ) {
            //Verifica se é a primeira vez do usuário em uma trilha
            const newScript = cheetahFreeLunch();
            handleNarrativeModal(newScript);
        } else if (userInfoData.narrative_status.trail1 == 0) {
            //Verifica se é a primeira vez do usuário na trilha da cheetah
            const newScript = cheetahBeggining();
            handleNarrativeModal(newScript);
        } else if (userInfoData.narrative_status.trail1 != 3) { // Se não for a primera vez e se não for o diálogo final, começará a contagem de acessos
            const cheetah_access = getTrailAccess(trailAccessEnum.CHEETAH);
            if (cheetah_access) {
                const number_access = parseInt(cheetah_access);
                if (number_access < 3) {
                    setTrailAccess(trailAccessEnum.CHEETAH, `${number_access + 1}`);
                } else {
                    setTrailAccess(trailAccessEnum.CHEETAH, '1');
                    const newScript = cheetahTeasing();
                    handleNarrativeModal(newScript);
                }
            } else {
                setTrailAccess(trailAccessEnum.CHEETAH, '1');
            }
        }
    };

    const challengeNarrative = async () => {
        const newChallengeScript = await cheetahFinalQuiz(userData);
        handleNarrativeModal(newChallengeScript);
    };

    const handleChallengeNarrative = async () => {
        if (!completeTrail) {
            await challengeNarrative();
        }
        if (hasEnougthStatusForFinalQuiz(userData, AGILITY) == 'enoughStatus') {
            setCanDoFinalQuiz(true);
        } else {
            setCheetahText(`Seu nível de ${AGILITY} não é suficiente! É necessário 90% ou mais de ${AGILITY} para acessar o Desafio Final.`);
        }
        modalOnOpen();
    }

    const finalCheetahNarrative = () => {
        const newChallengeScript = cheetahConclusion();
        handleNarrativeModal(newChallengeScript);
    };

    const alertQuizConfirm = () => {
        setAlertQuiz(
            `Para fazer o desafio final da Cheetah são necessárias ${FINAL_QUIZ_SINK} joias do conhecimento! Tem certeza que deseja prosseguir?`,
        );
        setIsAlertOpen(true);
    };

    const handleModal = async () => {
        modalOnClose();
        closeAlert();
        quizOnOpen();
    };

    const paxTax = async () => {
        const value = FINAL_QUIZ_SINK;
        setIsConfirmOpen(false);
        setPayLoading(true);
        const _userId: SetStateAction<string> | null = sessionStorage.getItem(
            '@pionira/userId',
        );
        const userCoins = userData.coins;

        if (userCoins >= value) {
            const newCoins = userCoins - value;
            try {
                await api.patch(`/user/coins/${_userId}`, {
                    coins: newCoins,
                });

                setPayLoading(false);
                handleModal();
            } catch (error) {
                setPayLoading(false);
                setOnError(true);
            }
        }

        setPayLoading(false);
        if (userCoins < value) {
            setAlertCoins('Poxa! Parece que você não tem moedas suficientes!');
            setIsAlertCoins(true);
        }
    };

    const closeAlert = () => {
        if (!payLoading) isAlertOnClose();
    }

    const handleStatusRequirement = () => {
        setBlockedMessage(`Seu nível de ${AGILITY} não é suficiente!`);
        setIsBlockedOpen(true);
    }

    const handleBlockedModule = () => {
        setBlockedMessage("Esse treinamento ainda não está disponível!");
        setIsBlockedOpen(true);
    }

    const moduleEndNarrativeScript = (quizIndex: number) => {
        const script = buildModuleEndScript('Cheetah', moduleData[quizIndex].final_message);
        handleNarrativeModal(script)
    }

    useEffect(() => {
        changeSoundtrack('/trilha-cheetah');

        const getUser = async () => {
            try {
                let userInfoData;
                const _userId = sessionStorage.getItem('@pionira/userId');
                if (moduleData.length === 0) {
                    await getNewModuleInfo();
                }
                if (!userData._id) {
                    const { data } = await api.get(`/user/${_userId}`);
                    setUserData(data);
                    userInfoData = data;
                } else userInfoData = userData;

                setIgnoranceFilter(userInfoData.ignorance, ignoranceArray);
                const isComplete = userInfoData.finalQuizComplete.cheetahFinal;
                await checkNarrative();
                await getFinalQuiz();
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000)

                if (isComplete) {
                    setCheetahText(
                        `"Você já alcançou o máximo da sua agilidade  ${userInfoData.userName}! Vamos com tudo contra a ignorância!"`,
                    );
                    setCompleteTrail(true);
                    if (userInfoData.narrative_status.trail1 === 3) {
                        finalCheetahNarrative();
                    }
                } else {
                    if (userInfoData.ignorance > 80)
                        setCheetahText(
                            'Tenha cuidado, viajante! Você não se preparou o suficente para vencer a Cheetah!',
                        );
                    else if (userInfoData.ignorance > 40)
                        setCheetahText(
                            'Você está definitivamente mais forte, viajante! Mas temo que a Cheetah é um desafio muito grande para você!',
                        );
                    else
                        setCheetahText(
                            'Você está pronto, viajante! Lembre-se de toda a sua jornada para vencer esse desafio!',
                        );
                }
            } catch (error) {
                setOnError(true);
            }
        };
        getUser().then();
    }, []);

    return (
        <>
            <VideoBackground handleLoading={() => setIsAnimationLoading(false)} source={getBackgroundAnimation(pathEnum.CHEETAH)} />
            {
                (isLoading || isAnimationLoading) ? <LoadingOverlay /> : (
                    <>
                        <IgnoranceFilter
                            ignoranceImage={ignoranceImage}
                        />
                        <Flex
                            width='92.5%'
                            justifyContent='space-between'
                            alignItems='flex-start'
                            margin='auto'
                        >
                            {narrativeIsOpen ? null : (
                                <NavActions logout={logout} />
                            )}

                            {narrativeIsOpen ? null : (
                                <IgnorancePremiumIcons
                                    ignorance={userData.ignorance}
                                    showStatus={true}
                                    statusText={STATUS_LEVEL(AGILITY)}
                                    statusPoints={getStatusPoints(userData, AGILITY)}
                                    statusColor={colorPalette.primaryColor}
                                    trail={trailEnum.CHEETAH}
                                />
                            )}
                        </Flex>

                        {narrativeIsOpen ? null : (
                            <>
                                <Flex
                                    margin='2vw'
                                    justifyContent='space-between'
                                >
                                    <ModuleModal
                                        left='19vw'
                                        top='74vh'
                                        quizIndex={0}
                                        openFinalModuleNarrative={() => moduleEndNarrativeScript(0)}
                                        blockedFunction={handleStatusRequirement}
                                    />
                                    <ModuleModal
                                        left='45vw'
                                        top='56vh'
                                        quizIndex={1}
                                        openFinalModuleNarrative={() => moduleEndNarrativeScript(1)}
                                        blockedFunction={handleStatusRequirement}
                                    />
                                    <ModuleModal
                                        left='68vw'
                                        top='75vh'
                                        quizIndex={2}
                                        openFinalModuleNarrative={() => moduleEndNarrativeScript(0)}
                                        blockedFunction={handleBlockedModule}
                                    />
                                    <ModuleModal
                                        left='89vw'
                                        top='65vh'
                                        quizIndex={0}
                                        isBlocked={true}
                                        openFinalModuleNarrative={() => moduleEndNarrativeScript(0)}
                                        blockedFunction={handleBlockedModule}
                                    />
                                    <Center
                                        _hover={{
                                            cursor: 'pointer',
                                            transform: 'scale(2.2)',
                                        }}
                                        transition='all 0.2s ease'
                                        width='4rem'
                                        height='4rem'
                                        onClick={() => {
                                            handleChallengeNarrative();
                                        }}
                                        position='absolute'
                                        top='40vh'
                                        left='70vw'
                                    >
                                        <Tooltip
                                            isDisabled={!isDesktop}
                                            hasArrow
                                            placement='top'
                                            gutter={12}
                                            label={CHEETAH_FINAL}
                                        >
                                            <Image
                                                src={final_cheetah_icon}
                                                width='90%'
                                                height='90%'
                                            />
                                        </Tooltip>
                                    </Center>
                                </Flex>

                                <Modal
                                    isOpen={modalIsOpen}
                                    onClose={modalOnClose}
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
                                        {completeTrail || !canDoFinalQuiz ? (
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
                                                            {cheetahText}
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
                                                            onClick={modalOnClose}
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
                                                            {cheetahText}
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
                                                            src={cheetah_bg}
                                                            w='65%'
                                                            h='75%'
                                                        />

                                                        <Flex
                                                            w='65%'
                                                            justifyContent='space-between'
                                                            marginBottom='0.8rem'
                                                        >
                                                            <Button
                                                                bgColor={
                                                                    colorPalette.confirmButton
                                                                }
                                                                width='45%'
                                                                height='4rem'
                                                                fontSize='1.2rem'
                                                                _hover={{
                                                                    transform: 'scale(1.1)',
                                                                }}
                                                                onClick={alertQuizConfirm}
                                                            >
                                                                Vamos nessa!
                                                </Button>
                                                            <Button
                                                                bgColor={
                                                                    colorPalette.closeButton
                                                                }
                                                                width='45%'
                                                                height='4rem'
                                                                fontSize='1.2rem'
                                                                _hover={{
                                                                    transform: 'scale(1.1)',
                                                                }}
                                                                onClick={modalOnClose}
                                                            >
                                                                Ainda não estou pronto!
                                                </Button>
                                                        </Flex>
                                                    </ModalBody>
                                                </>
                                            )}
                                    </ModalContent>
                                </Modal>

                                <FinalUniversalQuiz
                                    openModal={quizIsOpen}
                                    closeModal={quizOnClose}
                                    quiz={quiz}
                                    questions={questions}
                                    imgName={cheetah}
                                    routeQuestions={'cheetahquestions'}
                                    routeQuiz={'finalcheetahquiz'}
                                    trail={1}
                                />
                            </>
                        )}
                    </>
                )
            }

            {
                script.length > 0 && <NarrativeModal
                    isOpen={narrativeIsOpen}
                    script={script}
                    onToggle={narrativeOnToggle}
                    narrative="cheetah"
                />
            }

            <AlertModal
                isOpen={isConfirmOpen}
                onClose={alertOnClose}
                alertTitle='Logout'
                alertBody={alertAnswer}
                buttonBody={
                    <Button
                        ref={cancelRef}
                        color='white'
                        _hover={{ bg: colorPalette.primaryColor }}
                        bg={colorPalette.primaryColor}
                        onClick={LogOut}
                    >
                        Sair
                        </Button>
                }
            />

            <AlertModal
                isOpen={isAlertOpen}
                onClose={closeAlert}
                onClickClose={closeAlert}
                alertTitle='Desafio Final'
                alertBody={alertQuiz}
                buttonBody={
                    <Button
                        ref={cancelRef}
                        color='white'
                        _hover={{ bg: colorPalette.primaryColor }}
                        bg={colorPalette.primaryColor}
                        onClick={paxTax}
                        isLoading={payLoading}
                    >
                        Pagar
                    </Button>
                }
            />

            <AlertModal
                isOpen={isAlertCoins}
                onClose={isAlertCoinsOnClose}
                alertTitle='Moedas Insuficientes'
                alertBody={alertCoins}
                buttonBody={
                    <>
                        <Box
                            w='100%'
                            display='flex'
                            justifyContent='space-between'
                        >
                            <Button
                                ref={cancelRef}
                                color='white'
                                _hover={{ bg: colorPalette.primaryColor }}
                                bg={colorPalette.primaryColor}
                                onClick={() => {
                                    isAlertCoinsOnClose();
                                    setIsLoading(false);
                                }}
                            >
                                Cancelar
                            </Button>
                        </Box>
                    </>
                }
            />

            <AlertModal
                isOpen={onError}
                onClose={() => window.location.reload()}
                alertTitle='Ops!'
                alertBody={errorCases.SERVER_ERROR}
                buttonBody={
                    <Button
                        color='white'
                        _hover={{ bg: colorPalette.primaryColor }}
                        bg={colorPalette.primaryColor}
                        onClick={() => window.location.reload()}
                    >
                        Recarregar
                    </Button>
                }
            />

            <BlockedModal
                isOpen={isBlockedOpen}
                onClose={() => { setIsBlockedOpen(false) }}
                subtitle={blockedMessage}
            />
        </>
    );
};

export default CheetahPath;
