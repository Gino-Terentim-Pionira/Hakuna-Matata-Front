import React, { FC, useState } from 'react';
import { useDisclosure, Flex, Button } from '@chakra-ui/react';
import { useUser, useTrail } from '../../hooks';

// Components
import RewardModal from '../modals/GenericModal';

// Styles
import colorPalette from '../../styles/colorPalette';

// Images
import Cheetah from '../../assets/icons/cheetahblink.svg';
import Cross from '../../assets/icons/cross.svg';
import { UserServices } from '../../services/UserServices';
import { FINAL_QUIZ_SINK } from '../../utils/constants/constants';
import AlertModal from '../modals/AlertModal';
import { Question } from '../../recoil/trailRecoilState';
import FinalChallengeQuizModal from './FinalChallengeQuizModal';

interface IFinalChallengeQuiz {
    openModal: boolean;
    closeModal: VoidFunction;
    onToggle: VoidFunction;
    QuestionInfo: Question[];
    totalQuestions: number;
    trailName: string;
    completeModuleFunction: () => Promise<void>;
    image: string;
}


const FinalChallengeQuiz: FC<IFinalChallengeQuiz> = ({
    openModal,
    closeModal,
    QuestionInfo,
    totalQuestions,
    trailName,
    onToggle,
    completeModuleFunction,
    image
}) => {
    const userServices = new UserServices();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { getNewUserInfo, userData } = useUser();
    const { getNewTrailInfo } = useTrail();
    const [coins, setCoins] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [questionsId, setQuestionsId] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [onError, setOnError] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const onCorrect = (question_id: string) => {
        const questionUserId = userData.question_id;
        const currentQuestion = QuestionInfo.find((item) => item._id === question_id);
        const questionsCoins = currentQuestion?.coins as number;
        if (questionUserId.includes(question_id)) {
            setCorrectAnswers(correctAnswers + 1);
        } else {
            setCoins(coins + questionsCoins);
            setCorrectAnswers(correctAnswers + 1);

            setQuestionsId([...questionsId, question_id]);
        }
    };

    const onEndQuiz = () => {
        onOpen();
    };

    const updateUserCoins = async () => {
        try {
            setIsLoading(true);
            const _userId = sessionStorage.getItem('@pionira/userId');
            await userServices.addQuestionsToUser(_userId as string, questionsId, 2);
            if (questionsId.length == QuestionInfo.length) {
                await completeModuleFunction();
            }
 
            await getNewUserInfo();
            await getNewTrailInfo(trailName);
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
        const answaredQuestions = totalQuestions - QuestionInfo.length + correctAnswers;
        const numberQuestion80 = totalQuestions * 0.8;
        const questionsRemainingTo80 = numberQuestion80 - answaredQuestions;
		const questionLabel = questionsRemainingTo80 == 1 ? 'questão' : 'questões';
		if (correctAnswers === QuestionInfo.length)
			return {
				title: 'Parabéns!!',
				titleColor: colorPalette.inactiveButton,
				subtitle: `Você provou por completo o seu valor! Parabéns!`,
				icon: Cheetah,
				coins,
				alert: 'Você está legível para obter o certificado da trilha! Acesse a loja e verifique os outros requisitos.'
			}
		return {
			title: 'Que pena!',
			titleColor: colorPalette.closeButton,
			subtitle: correctAnswers === 0 ? `Você não acertou nenhuma questão! Mas não desista, você poderá vencer a ignorância!` :
			`Você acertou apenas ${correctAnswers} de ${QuestionInfo.length} questões! Mas não desista, você poderá vencer a ignorância!`,
			icon: Cross,
			coins,
			alert: questionsRemainingTo80 <= 0 ? 'Você está legível para obter o certificado da trilha! Acesse a loja e verifique os outros requisitos.' : `Falta acertar ${questionsRemainingTo80} ${questionLabel} para você poder obter o certificado da trilha!`
		}
    };

    const handleCloseAlert = () => {
        setIsAlertOpen(false);
    }

    const confirmLeave = async () => {
        onToggle();
        setIsAlertOpen(false);
    }

    return (
        <>
            <FinalChallengeQuizModal
                openModal={openModal}
                closeModal={closeModal}
                onToggle={onToggle}
                questions_id={QuestionInfo}
                onCorrect={onCorrect}
                onWrong={()=>null}
                onEndQuiz={onEndQuiz}
                correctAnswers={correctAnswers}
                openAlert={() => setIsAlertOpen(true)}
                image={image}
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
                alertBody={`Tem certeza que deseja sair do quiz? Você perderá as ${FINAL_QUIZ_SINK} joias do conhecimento que gastou!`}
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

export default FinalChallengeQuiz;
