import api from "./api"
import trailEnum from "../utils/enums/trail";
export interface IOwnedCertificate {
    certificate_name: string,
    description: string,
    hash: string,
    _id: string
}

export interface IShopCertificate {
    name: string;
    price: number;
    premiumPrice?: number;
    description: string;
    trail: trailEnum;
    isBlocked: boolean;
    isEnoughVideo: number;
    isEnoughQuestion: number;
    isEnoughFinalQuiz: number;
    message: string;
    id: string;
}

export class CertificateService {

    getCertificateDetail = async (hash: string): Promise<Blob> => {
        const response = await api.get(`certificate/details/${hash}`, {
            responseType: 'blob'
        });

        return response.data;
    };


    listOwnedCertificates = async (
        userId: string
    ): Promise<IOwnedCertificate[]> => {
        const response = await api.get(`certificate/owned/${userId}`);

        return response.data;
    }

    listShopCertificates = async (userid: string): Promise<IShopCertificate[]> => {
        const response = await api.get(`certificate/shop/${userid}`);

        return response.data
    }

    buyCertificate = async (data: {
        userId: string,
        certificateId: string,
        usePremium: boolean
    }) => {
        await api.post('certificate/buy', data);
    }
}
