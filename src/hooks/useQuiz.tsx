import { useRecoilState } from "recoil"
import { cheetahQuizState } from "../recoil/quizRecoilState"
import api from "../services/api";

export const useQuiz = () => {
    const [quizData, setQuizData] = useRecoilState(cheetahQuizState);

    // Criar outros quizes

    const getNewQuizInfo = async () => {
        try {
            const res = await api.get('/quizz');

            setQuizData(res.data);
        } catch (error) {
            console.log('');
        }
    }
    return {
        quizData,
        setQuizData,
        getNewQuizInfo,
    }
}

export default useQuiz;
