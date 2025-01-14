import api from '../services/api';


async function getDailyQuiz() {
    const response = await api.get(`/trail/dailyQuiz`);

    return response;
}

const getUserAnsweredQuestions = async (module_name: string) => {
    return await api.get(`/module/userCompleteQuestions/${module_name}`);
}

export { getDailyQuiz, getUserAnsweredQuestions };
