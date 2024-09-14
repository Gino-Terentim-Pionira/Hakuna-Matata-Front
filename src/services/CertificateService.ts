import api from "./api"

export interface IOwnedCertificate {
    first_name: string,
    last_name: string,
    certificate_name: string,
    description: string,
    image: string,
    hash: string,
    issue_date: string
}

export interface  IShopCertificate {
    name: string;
    price: number;
    description: string;
    trail: string;
    isBlocked: boolean;
    isEnoughVideo: number;
    isEnoughQuestion: number;
    isEnoughFinalQuiz: number;
    message: string;
    id: string
}

export class CertificateService {

    listOwnedCertificates = async (
        userId: string
    ): Promise<IOwnedCertificate[]> => {
        const response = await api.get(`certificate/owned/${userId}`);

        return response.data;
    }

    listShopCertificates = async (userid: string) => {
        const response = await api.get(`certificate/shop/${userid}`);

        return response.data
    }

    buyCertificate = async (data: {
        userId: string,
        certificateId: string
    }) => {
        await api.post('certificate/buy', data);
    }
}
