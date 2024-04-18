import api from '../services/api';


class RelicServices {
    async checkAllRelics(userId: string) {
        try {
            const response = await api.get(`/relic/checkrelics/${userId}`);
            return  response.data;
        } catch (e) {
            return []
        }
    }
}


export default RelicServices;