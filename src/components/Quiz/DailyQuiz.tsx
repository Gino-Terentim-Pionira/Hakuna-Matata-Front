import React, { FC, useState, useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useUser } from '../../hooks';

// Components
import RewardModal from '../modals/GenericModal';

// Styles
import colorPalette from '../../styles/colorPalette';
import api from '../../services/api';

// Images
import Cheetah from '../../assets/icons/cheetahblink.svg';
import Cross from '../../assets/icons/cross.svg';
import GenericQuizModal from './GenericQuizModal';
import { getDailyModule } from '../../services/module';

interface IQuestions {
    _id: string,
    description: string,
    alternatives: string[],
    answer: number,
    coins: number,
    video_name: string,
}

interface userDataProps {
    coins: number,
    status: number[],
    ignorance: number
}

interface IDailyQuiz {
    openModal: boolean;
    closeModal: VoidFunction;
    onToggle: VoidFunction;
}


const DailyQuiz: FC<IDailyQuiz> = ({
    openModal,
    closeModal,
    onToggle
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { getNewUserInfo } = useUser();
    const [coins, setCoins] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [passed, setPassed] = useState(Boolean);
    const [isLoading, setIsLoading] = useState(false);
    const [onError, setOnError] = useState(false);
    const [questions, setQuestions] = useState<IQuestions[]>([]);
    const [videos, setVideos] = useState<string[]>([]);

    const updateVideoArray = (videoArray: string[], video_name: string) => {
        const hasVideoname = videoArray.find((item) => item == video_name);
        if (!hasVideoname) {
            setVideos([...videoArray, video_name]);
        }
    }

    const onCorrect = (question_id: string) => {
        const currentQuestion = questions.find((item) => item._id == question_id);
        const questionsCoins = currentQuestion?.coins as number;

        setCoins(coins + (questionsCoins/5));
        setCorrectAnswers(correctAnswers + 1);
    }

    const onWrong = (question_id: string) => {
        const currentQuestion = questions.find((item) => item._id == question_id);
        const video_name = currentQuestion?.video_name as string;
        updateVideoArray(videos, video_name);
    }

    const onEndQuiz = (passed: boolean) => {
        const currentDate = new Date();
        localStorage.setItem('@pionira/dailyQuiz', currentDate.toDateString());
        setPassed(passed);
        onOpen();
    }


    const addCoinsStatus = async (value: number) => {
        try {
            const _userId = sessionStorage.getItem('@pionira/userId');
            const res = await api.get<userDataProps>(`/user/${_userId}`);

            await api.patch<userDataProps>(`/user/coins/${_userId}`, {
                coins: res.data.coins + value
            });
        } catch (error) {
            setOnError(true);
        }
    }

    const updateUserCoins = async () => {
        try {
            setIsLoading(true);
            await addCoinsStatus(coins);
            await getNewUserInfo();
            setIsLoading(false);
        } catch (error) {
            setOnError(true);
        }
    }

    const rewardModalInfo = () => {
        if (passed)
            return {
                title: 'Quiz finalizado!',
                titleColor: colorPalette.inactiveButton,
                subtitle: `Você acertou ${correctAnswers} de ${questions.length} questões!`,
                icon: Cheetah,
                coins,
                video_names: videos
            }
        return {
            title: 'Que pena!',
            titleColor: colorPalette.closeButton,
            subtitle: `Você errou ${questions.length - correctAnswers} de ${questions.length} questões! Tente novamente em 30 minutos`,
            icon: Cross,
            coins,
            video_names: videos
        }
    }

    useEffect(() => {
        getQuestions();
	}, []);

    const getQuestions = async () => {
        const questions = await getDailyModule();
        setQuestions(questions.data);
    }

    return (
    <>
        {
            questions.length > 0 && <GenericQuizModal 
            openModal={openModal}
            closeModal={closeModal}
            onToggle={onToggle}
            questions_id={questions}
            onCorrect={onCorrect}
            onWrong={onWrong}
            onEndQuiz={onEndQuiz}
            correctAnswers={correctAnswers}
        />
        }
        <RewardModal
            isOpen={isOpen}
            genericModalInfo={rewardModalInfo()}
            confirmFunction={()=>history.go(0)}
            loading={isLoading}
            error={onError}
            initFunction={updateUserCoins}
        />
    </>
    );
}

export default DailyQuiz;
