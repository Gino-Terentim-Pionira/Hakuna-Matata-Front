import React, { FC, useState } from 'react';
import { useDisclosure, Flex, Button } from '@chakra-ui/react';
import { useUser, useTrail } from '../../hooks';
import { updateModuleCooldown } from '../../services/moduleCooldown';

// Components
import RewardModal from '../modals/GenericModal';

// Styles
import colorPalette from '../../styles/colorPalette';

// Images
import Cheetah from '../../assets/icons/cheetahblink.svg';
import Cross from '../../assets/icons/cross.svg';
import GenericQuizModal from './GenericQuizModal';
import { UserServices } from '../../services/UserServices';
import UnlockAnimation from '../modals/UnlockAnimation';
import { S3_VIDEO_FINISHED_MODULE } from '../../utils/constants/constants';
import AlertModal from '../modals/AlertModal';
import { Module } from '../../recoil/trailRecoilState';

interface IModuleQuizV2 {
    openModal: boolean;
    closeModal: VoidFunction;
    onToggle: VoidFunction;
    moduleInfo: Module;
    completeModuleFunction: VoidFunction;
}


const ModuleQuizV2: FC<IModuleQuizV2> = ({
    openModal,
    closeModal,
    moduleInfo,
    onToggle,
    completeModuleFunction,
}) => {
    const userServices = new UserServices();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { getNewUserInfo, userData } = useUser();
    const { trailData, getNewTrailInfo } = useTrail();
    const length = moduleInfo.questions.length;
    const [coins, setCoins] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [passed, setPassed] = useState(Boolean);
    const [questionsId, setQuestionsId] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [onError, setOnError] = useState(false);
    const [videos, setVideos] = useState<string[]>([]);
    const [animationInfo, setAnimationInfo] = useState({
        animation_url: S3_VIDEO_FINISHED_MODULE,
        isOpen: false,
        onClose: () => onCloseFirstAnimation()
    });
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const HAS_USER_FINISHED_MODULE = moduleInfo.coinsRemaining == 0;

    const onCloseFirstAnimation = () => {
        setAnimationInfo(prevState => ({
            ...prevState,
            isOpen: false
        }));

        if (trailData && trailData.oracle.isAvailable) {
            const second_animation_url = trailData.oracle.updatedAnimation;
            setTimeout(() => {
                setAnimationInfo({
                    isOpen: true,
                    animation_url: second_animation_url,
                    onClose: () => setAnimationInfo(prevState => ({
                        ...prevState,
                        isOpen: false
                    }))
                });
            }, 30);
        }
    };

    const onCorrect = (question_id: string) => {
        const questionUserId = userData.question_id;
        const currentQuestion = moduleInfo.questions.find((item) => item._id === question_id);
        const questionsCoins = currentQuestion?.coins as number;
        if (questionUserId.includes(question_id)) {
            setCorrectAnswers(correctAnswers + 1);
        } else {
            setCoins(coins + questionsCoins);
            setCorrectAnswers(correctAnswers + 1);

            setQuestionsId([...questionsId, question_id]);
        }
    };

    const onWrong = (question_id: string) => {
        const currentQuestion = moduleInfo.questions.find((item) => item._id === question_id);
        const video_name = currentQuestion?.videoName as string;
        updateVideoArray(videos, video_name);
    };

    const onEndQuiz = (passed: boolean) => {
        setPassed(passed);
        setCoins(prevCoins => {
            if (!HAS_USER_FINISHED_MODULE && prevCoins >= moduleInfo.coinsRemaining) {
                setAnimationInfo(prevState => ({
                    ...prevState,
                    isOpen: true
                }));
            }
            return prevCoins;
        });
        onOpen();
    };

    const updateVideoArray = (videoArray: string[], video_name: string) => {
        const hasVideoname = videoArray.find((item) => item === video_name);
        if (!hasVideoname) {
            setVideos([...videoArray, video_name]);
        }
    };

    const updateUserQuizTime = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            await updateModuleCooldown(userId as string, moduleInfo._id);
        } catch (error) {
            setOnError(true);
        }
    };

    const updateUserCoins = async () => {
        try {
            setIsLoading(true);
            const SHOULD_UPDATE_USER_FINISHED_QUESTIONS_AND_COINS = moduleInfo.coinsRemaining > 0 && questionsId.length > 0;
            if (SHOULD_UPDATE_USER_FINISHED_QUESTIONS_AND_COINS) {
                const _userId = sessionStorage.getItem('@pionira/userId');
                await userServices.addQuestionsToUser(_userId as string, questionsId, 2);

            }
            await updateUserQuizTime();
            await getNewUserInfo();
            await getNewTrailInfo(moduleInfo.trailName, true);
            if (coins >= moduleInfo.coinsRemaining) {
                completeModuleFunction();
            }
            setIsLoading(false);
        } catch (error) {
            setOnError(true);
        }
    };

    const handleOnCloseReward = () => {
        setCoins(0);
        setCorrectAnswers(0);
        onClose();
    }

    const rewardModalInfo = () => {
        if (moduleInfo.coinsRemaining == 0)
            return {
                title: 'Módulo Finalizado!',
                titleColor: colorPalette.inactiveButton,
                subtitle: 'Você já conseguiu provar todo o seu valor nesse desafio! Pode seguir adiante com sua jornada, caro viajante!',
                icon: Cheetah
            };
        if (passed)
            return {
                title: 'Arrasou!',
                titleColor: colorPalette.inactiveButton,
                subtitle: `Você acertou ${correctAnswers} de ${length} questões! Volte mais tarde para finalizar o módulo.`,
                icon: Cheetah,
                coins,
                video_names: videos
            };
        const oracle_text = trailData?.stamps ? 'aprimorar' : 'desbloquear';
        return {
            title: 'Que pena!',
            titleColor: colorPalette.closeButton,
            subtitle: `Você errou ${length - correctAnswers} de ${length} questões, acerte todas as questões para ${oracle_text} o Oráculo! Tente novamente em 30 minutos`,
            icon: Cross,
            coins,
            video_names: videos
        };
    };

    const handleCloseAlert = () => {
        setIsAlertOpen(false);
    }

    const confirmLeave = async () => {
        const userId = sessionStorage.getItem('@pionira/userId');
        onToggle();
        setIsAlertOpen(false);
        await updateModuleCooldown(userId as string, moduleInfo._id);
    }

    return (
        <>
            <UnlockAnimation animation={animationInfo.animation_url} isOpen={animationInfo.isOpen} onClose={animationInfo.onClose} key={animationInfo.animation_url} />
            <GenericQuizModal
                openModal={openModal}
                closeModal={closeModal}
                onToggle={onToggle}
                questions_id={moduleInfo.questions}
                onCorrect={onCorrect}
                onWrong={onWrong}
                onEndQuiz={onEndQuiz}
                correctAnswers={correctAnswers}
                openAlert={() => setIsAlertOpen(true)}
            />
            <RewardModal
                isOpen={isOpen}
                genericModalInfo={rewardModalInfo()}
                confirmFunction={handleOnCloseReward}
                initFunction={updateUserCoins}
                loading={isLoading}
                error={onError}
            />
            <AlertModal
                isOpen={isAlertOpen}
                onClose={handleCloseAlert}
                alertTitle='Finalizar Desafio'
                alertBody='Tem certeza que deseja sair do desafio? Você terá que esperar 30 minutos para fazê-lo novamente.'
                buttonBody={
                    <Flex
                        color='white'
                    >
                        <Button
                            onClick={handleCloseAlert}
                            bg={colorPalette.closeButton}
                        >
                            Cancelar
                        </Button>
                        <Button
                            bg={colorPalette.primaryColor}
                            _hover={{}}
                            onClick={confirmLeave}
                            marginLeft='16px'
                        >
                            Confirmar
                        </Button>
                    </Flex>
                }
            />
        </>
    );
};

export default ModuleQuizV2;
