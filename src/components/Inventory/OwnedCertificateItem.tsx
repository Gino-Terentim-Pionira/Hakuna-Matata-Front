import React, { FC } from 'react';
import { IOwnedCertificate } from '../../services/CertificateService';
import InventoryItem from './InventoryItem';
import certificateIcon from '../../assets/icons/certificate/certificate.svg';
import { jsPDF } from 'jspdf';

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
            const imgWidth = img.width;
            const imgHeight = img.height;

            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [imgWidth, imgHeight]
            });

            doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

            doc.setFontSize(30);
            doc.text(`${first_name} ${last_name}`, imgWidth / 2, imgHeight * 0.4, { align: 'center' });

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            tempDiv.style.width = '500px';
            tempDiv.style.whiteSpace = 'normal';
            tempDiv.style.textAlign = 'center'


            doc.html(tempDiv, {
                x: imgWidth / 4,
                y: imgHeight * 0.48 ,
                callback: function (doc) {
                    doc.setFontSize(16);
                    doc.text(issue_date, imgWidth / 2, imgHeight * 0.70, { align: 'center' });

                    doc.setFontSize(16);
                    doc.text(hash, 0, imgHeight - 5);

                    doc.save(`${certificate_name}.pdf`);
                }
            });
        };
    };

    return (
        <InventoryItem
            name={certificate_name}
            description={description}
            type='Certificado'
            image={certificateIcon}
            downloadItem={handleGeneratePDF}
        />
    )
}

export default OwnedCertificateItem;
