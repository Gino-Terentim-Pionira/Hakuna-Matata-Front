import React, { FC, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useUser, useModule } from '../../hooks';
import { updateModuleCooldown } from '../../services/moduleCooldown';

// Components
import RewardModal from '../modals/GenericModal';
import { UpdateStatus } from '../../services/updateStatus';
import { getStatusName } from '../../utils/statusUtils';

// Styles
import colorPalette from '../../styles/colorPalette';

// Images
import Cheetah from '../../assets/icons/cheetahblink.svg';
import Cross from '../../assets/icons/cross.svg';
import GenericQuizModal from './GenericQuizModal';
import { UserServices } from '../../services/UserServices';
import UnlockAnimation from '../modals/UnlockAnimation';
import { S3_VIDEO_FINISHED_MODULE, S3_VIDEO_ORACLE_UPDATED, S3_VIDEO_ORACLE_AVAILABLE } from '../../utils/constants/constants';
import { numberCompletedModules } from '../../utils/oracleUtils';
import { IQuiz } from '../../recoil/moduleRecoilState';

interface IStatus {
    name: string,
    points: number
}

interface IModuleQuiz {
    openModal: boolean;
    closeModal: VoidFunction;
    onToggle: VoidFunction;
    moduleInfo: IQuiz;
    validateUser: VoidFunction;
    userQuizCoins: number;
    openFinalModuleNarrative: VoidFunction;
    remainingCoins: number;
}


const ModuleQuiz: FC<IModuleQuiz> = ({
    openModal,
    closeModal,
    moduleInfo,
    onToggle,
    validateUser,
    openFinalModuleNarrative,
    userQuizCoins,
    remainingCoins
}) => {
    const userServices = new UserServices();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { getNewUserInfo, userData } = useUser();
    const { moduleData } = useModule();
    const length = moduleInfo.questions_id.length;
    const [coins, setCoins] = useState(0);
    const [status, setStatus] = useState<IStatus>({
        name: getStatusName(moduleInfo.trail),
        points: 0
    });
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

    const onCloseFirstAnimation = () => {
        const second_animation_url = numberCompletedModules(moduleData, userData.module_id) ? S3_VIDEO_ORACLE_UPDATED : S3_VIDEO_ORACLE_AVAILABLE;
        setAnimationInfo(prevState => ({
            ...prevState,
            isOpen: false
        }));

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
    };

    const onCorrect = (question_id: string) => {
        const questionUserId = userData.question_id;
        const currentQuestion = moduleInfo.questions_id.find((item) => item._id === question_id);
        const questionsCoins = currentQuestion?.coins as number;
        const questionStatus = currentQuestion?.score_point as number;

        if (questionUserId.includes(question_id)) {
            setCorrectAnswers(correctAnswers + 1);
        } else {
            setCoins(coins + questionsCoins);
            setCorrectAnswers(correctAnswers + 1);
            setStatus({
                ...status,
                points: status.points + questionStatus
            });

            setQuestionsId([...questionsId, question_id]);
        }
    };

    const onWrong = (question_id: string) => {
        const currentQuestion = moduleInfo.questions_id.find((item) => item._id === question_id);
        const video_name = currentQuestion?.video_name as string;
        updateVideoArray(videos, video_name);
    };

    const onEndQuiz = (passed: boolean) => {
        setPassed(passed);
        setCoins(prevCoins => {
            if (prevCoins >= remainingCoins) {
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

    const incrementStatus = async (userId: string) => {
        await UpdateStatus(userData, userId, status.name, status.points);
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
            const SHOULD_UPDATE_USER_FINISHED_QUESTIONS_AND_COINS = userQuizCoins < moduleInfo.total_coins && questionsId.length > 0;
            if (SHOULD_UPDATE_USER_FINISHED_QUESTIONS_AND_COINS) {
                const _userId = sessionStorage.getItem('@pionira/userId');
                await userServices.addQuestionsToUser(_userId as string, questionsId);

                await incrementStatus(_userId as string);
            }
            await updateUserQuizTime();
            await getNewUserInfo();
            if (coins >= remainingCoins) {
                validateUser();
            }
            setIsLoading(false);
        } catch (error) {
            setOnError(true);
        }
    };

    const handleOnCloseReward = () => {
        if (coins >= remainingCoins) {
            openFinalModuleNarrative();
        }
        onClose();
    }

    const rewardModalInfo = () => {
        if (userQuizCoins >= moduleInfo.total_coins)
            return {
                title: 'Arrasou!',
                titleColor: colorPalette.inactiveButton,
                subtitle: 'Você já conseguiu provar todo o seu valor nesse desafio! Pode seguir adiante com sua jornada, caro viajante!',
                icon: Cheetah
            };
        if (passed)
            return {
                title: 'Quiz finalizado!',
                titleColor: colorPalette.inactiveButton,
                subtitle: `Você acertou ${correctAnswers} de ${length} questões!`,
                icon: Cheetah,
                coins,
                status,
                video_names: videos
            };
        const oracle_text = numberCompletedModules(moduleData, userData.module_id) ? 'aprimorar' : 'desbloquear';
        return {
            title: 'Que pena!',
            titleColor: colorPalette.closeButton,
            subtitle: `Você errou ${length - correctAnswers} de ${length} questões, acerte todas as questões para ${oracle_text} o Oráculo! Tente novamente em 30 minutos`,
            icon: Cross,
            coins,
            status,
            video_names: videos
        };
    };

    return (
        <>
            <UnlockAnimation animation={animationInfo.animation_url} isOpen={animationInfo.isOpen} onClose={animationInfo.onClose} key={animationInfo.animation_url} />
            <GenericQuizModal
                openModal={openModal}
                closeModal={closeModal}
                onToggle={onToggle}
                questions_id={moduleInfo.questions_id}
                onCorrect={onCorrect}
                onWrong={onWrong}
                onEndQuiz={onEndQuiz}
                correctAnswers={correctAnswers}
            />
            <RewardModal
                isOpen={isOpen}
                genericModalInfo={rewardModalInfo()}
                confirmFunction={handleOnCloseReward}
                initFunction={updateUserCoins}
                loading={isLoading}
                error={onError}
            />
        </>
    );
};

export default ModuleQuiz;
