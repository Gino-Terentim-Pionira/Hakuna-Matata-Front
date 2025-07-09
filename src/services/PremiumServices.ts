import api from './api';

export class PremiumServices {
    isUserSubscribed = async (
        email: string
    ) => {
        return await api.post(`/premium/usersubscription`, { email });
    }
}