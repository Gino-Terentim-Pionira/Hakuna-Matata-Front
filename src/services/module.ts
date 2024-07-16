import api from '../services/api';


async function getDailyModule() {
    const response = await api.get(`/module/dailyModule`);

    return response;
}

const getUserAnsweredQuestions = async (module_name: string) => {
    return await api.get(`/module/userCompleteQuestions/${module_name}`);
}

export { getDailyModule, getUserAnsweredQuestions };
