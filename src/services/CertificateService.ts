import api from "./api"
import trailEnum from "../utils/enums/trail";
import jsPDF from "jspdf";

export interface IOwnedCertificate {
    certificate_name: string,
    description: string,
    hash: string,
    _id: string
}

export interface ICertificateDetails {
    first_name: string,
    last_name: string,
    image: string,
    content: string,
    hash: string,
    issue_date: string
}

export interface IShopCertificate {
    name: string;
    price: number;
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

    getCertificateDetail = async (hash: string): Promise<ICertificateDetails> => {
        const response = await api.get(`certificate/details/${hash}`);

        return response.data;
    }

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
        certificateId: string
    }) => {
        await api.post('certificate/buy', data);
    }

    handleGeneratePDF = (image: string, content: string, first_name: string, last_name: string, issue_date: string, hash: string): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = image + '?r=' + Math.floor(Math.random() * 100000);
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const originalWidth = img.width;
                const originalHeight = img.height;

                const newWidth = 1000;
                const scaleFactor = newWidth / originalWidth;
                const newHeight = originalHeight * scaleFactor;

                const doc = new jsPDF({
                    orientation: 'landscape',
                    unit: 'px',
                    format: [newWidth, newHeight]
                });

                doc.addImage(img, 'PNG', 0, 0, newWidth, newHeight);

                const tempDiv = document.createElement('div');
                tempDiv.style.width = `${newWidth}px`;
                tempDiv.style.height = `${newHeight - 100}px`;
                tempDiv.style.whiteSpace = 'normal';
                tempDiv.style.textAlign = 'center';
                tempDiv.style.display = 'flex';
                tempDiv.style.alignItems = 'center';
                tempDiv.style.justifyContent = 'center';
                tempDiv.style.flexDirection = 'column';

                const titleDiv = document.createElement('div');
                titleDiv.innerHTML = 'É com orgulho que conferimos este certificado a';
                titleDiv.style.fontSize = '15px';

                const contentDiv = document.createElement('div');
                contentDiv.innerHTML = content;
                contentDiv.style.width = '700px';
                contentDiv.style.fontSize = '15px';

                const nameDiv = document.createElement('div');
                nameDiv.innerHTML = `${first_name} ${last_name}`;
                nameDiv.style.fontSize = '36px';
                nameDiv.style.marginBottom = '32px';
                nameDiv.style.fontWeight = 'bold';

                const dateDiv = document.createElement('div');
                dateDiv.innerHTML = issue_date;
                dateDiv.style.fontSize = '15px';
                dateDiv.style.marginTop = '32px';

                tempDiv.appendChild(titleDiv);
                tempDiv.appendChild(nameDiv);
                tempDiv.appendChild(contentDiv);
                tempDiv.appendChild(dateDiv);

                doc.html(tempDiv, {
                    x: 0,
                    y: 50,
                    callback: function (doc) {

                        doc.setFontSize(8);
                        doc.text(hash, newWidth - 250, newHeight - 5);

                        const blob = doc.output('blob');
                        const url = URL.createObjectURL(blob);
                        resolve(url);
                    }
                });
            };
        })
    };
}
