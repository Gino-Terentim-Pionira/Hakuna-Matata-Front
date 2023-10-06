import api from '../services/api';


async function getDailyModule() {
    const response = await api.get(`/module/dailyModule`);

    return response;
}

export { getDailyModule };
