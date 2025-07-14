import api from './api';

export class PremiumServices {
    isUserSubscribed = async (
        email: string
    ) => {
        return await api.post('/premium/usersubscription', { email });
    }

    sendSuportRequest = async (
        email: string,
        subject: string,
        message: string,
        productId: string
    ) => {
        return await api.post('/premium/suportrequest', {email, subject, message, productId});
    }
}