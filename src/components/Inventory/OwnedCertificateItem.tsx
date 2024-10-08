import React, { FC } from 'react';
import { IOwnedCertificate } from '../../services/CertificateService';
import CertificateItem from './CertificateItem';
import certificateIcon from '../../assets/icons/certificate/certificate.svg';
import { jsPDF } from 'jspdf';
import { sfProBase64 } from '../../styles/fonts/sfProBase64';

const OwnedCertificateItem: FC<IOwnedCertificate> = ({
    certificate_name,
    description,
    content,
    image,
    issue_date,
    first_name,
    last_name,
    hash
}) => {

    const handleGeneratePDF = () => {
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

            doc.addFileToVFS('SFPro.ttf', sfProBase64);
            doc.addFont('SFPro.ttf', 'SFPro', 'normal');
            doc.setFont('SFPro');

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
            tempDiv.style.color = '#2e1e0b';

            const titleDiv = document.createElement('div');
            titleDiv.innerHTML = 'É com orgulho que conferimos este certificado a';
            titleDiv.style.fontSize = '15px';

            const contentDiv = document.createElement('div');
            contentDiv.innerHTML = content;
            contentDiv.style.width = '800px';
            contentDiv.style.fontSize = '15px';

            const nameDiv = document.createElement('div');
            nameDiv.innerHTML = `${first_name} ${last_name}`;
            nameDiv.style.fontSize = '70px';
            nameDiv.style.marginBottom = '32px';

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

                    doc.save(`${certificate_name}.pdf`);
                }
            });
        };
    };


    return (
        <CertificateItem
            name={certificate_name}
            description={description}
            type='Certificado'
            image={certificateIcon}
            downloadItem={handleGeneratePDF}
        />
    )
}

export default OwnedCertificateItem;
