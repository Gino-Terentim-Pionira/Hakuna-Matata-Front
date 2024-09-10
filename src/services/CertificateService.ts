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

export class CertificateService {

    listOwnedCertificates = async (
        userId: string
    ): Promise<IOwnedCertificate[]> => {
        const response = await api.get(`certificate/owned/${userId}`);

        return response.data;
    }
}
