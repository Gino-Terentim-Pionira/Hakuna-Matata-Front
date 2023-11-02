import React, { FC, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useUser } from '../../hooks';
import { updateModuleCooldown } from '../../services/moduleCooldown';

// Components
import RewardModal from '../modals/GenericModal';
import { UpdateStatus } from '../../services/updateStatus';
import { getStatusName } from '../../utils/statusUtils';

// Styles
import colorPalette from '../../styles/colorPalette';
import api from '../../services/api';

// Images
import Cheetah from '../../assets/icons/cheetahblink.svg';
import Cross from '../../assets/icons/cross.svg';
import GenericQuizModal from './GenericQuizModal';

interface IStatus {
    name: string,
    points: number
}

interface userDataProps {
    coins: number,
    status: number[],
    ignorance: number
}

interface IModuleQuiz {
    openModal: boolean;
    closeModal: VoidFunction;
    onToggle: VoidFunction;
    moduleInfo: {
        questions_id: [{
            _id: string,
            description: string,
            alternatives: string[],
            answer: number,
            coins: number,
            score_point: number,
            video_name: string,
        }];
        dificulty: string;
        total_coins: number;
        trail: string;
        _id: string;
    };
    validateUser: VoidFunction;
    firsTimeChallenge: boolean;
    userQuizCoins: number;
}


const ModuleQuiz: FC<IModuleQuiz> = ({
    openModal,
    closeModal,
    moduleInfo,
    onToggle,
    validateUser,
    firsTimeChallenge,
    userQuizCoins
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { getNewUserInfo, userData } = useUser();
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

    const onCorrect = (question_id: string) => {
        const questionUserId = userData.question_id;
        const currentQuestion = moduleInfo.questions_id.find((item) => item._id == question_id);
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
    }

    const onWrong = (question_id: string) => {
        const currentQuestion = moduleInfo.questions_id.find((item) => item._id == question_id);
        const video_name = currentQuestion?.video_name as string;
        updateVideoArray(videos, video_name);
    }

    const onEndQuiz = (passed: boolean) => {
        setPassed(passed);
        onOpen();
    }

    const updateVideoArray = (videoArray: string[], video_name: string) => {
        const hasVideoname = videoArray.find((item) => item == video_name);
        if (!hasVideoname) {
            setVideos([...videoArray, video_name]);
        }
    }

    const incrementStatus = async (userId: string) => {
        await UpdateStatus(userData, userId, status.name, status.points);
    }

    const addCoinsStatus = async (value: number) => {
        try {
            const _userId = sessionStorage.getItem('@pionira/userId');
            const res = await api.get<userDataProps>(`/user/${_userId}`);

            if (userQuizCoins < moduleInfo.total_coins) {
                await api.patch<userDataProps>(`/user/coins/${_userId}`, {
                    coins: res.data.coins + value
                });

                incrementStatus(_userId as string);
            }
        } catch (error) {
            setOnError(true);
        }
    }

    const updateUserQuizTime = async () => {
        try {
            const userId = sessionStorage.getItem('@pionira/userId');
            await updateModuleCooldown(userId as string, moduleInfo._id);
        } catch (error) {
            setOnError(true);
        }
    }

    const updateUserCoins = async () => {
        try {
            setIsLoading(true);
            await addCoinsStatus(coins);
            if (questionsId) {
                const userId = sessionStorage.getItem('@pionira/userId');
                const length = questionsId.length;
                for (let i = 0; i < length; i++) {
                    await api.patch(`/user/addquestion/${userId}`, {
                        question_id: questionsId[i]
                    });
                }
            }
            firsTimeChallenge ? validateUser() : null

            await updateUserQuizTime();
            await getNewUserInfo();
            onClose();
        } catch (error) {
            setOnError(true);
        }
    }

    const rewardModalInfo = () => {
        if (userQuizCoins >= moduleInfo.total_coins)
            return {
                title: 'Arrasou!',
                titleColor: colorPalette.inactiveButton,
                subtitle: 'Você já conseguiu provar todo o seu valor nesse desafio! Pode seguir adiante com sua jornada, caro viajante!',
                icon: Cheetah
            }
        if (passed)
            return {
                title: 'Quiz finalizado!',
                titleColor: colorPalette.inactiveButton,
                subtitle: `Você acertou ${correctAnswers} de ${length} questões!`,
                icon: Cheetah,
                coins,
                status,
                video_names: videos
            }
        return {
            title: 'Que pena!',
            titleColor: colorPalette.closeButton,
            subtitle: `Você errou ${length - correctAnswers} de ${length} questões! Tente novamente em 30 minutos`,
            icon: Cross,
            coins,
            status,
            video_names: videos
        }
    }

    return (
    <>
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
            confirmFunction={updateUserCoins}
            loading={isLoading}
            error={onError}
        />
    </>
    );
}

export default ModuleQuiz;
