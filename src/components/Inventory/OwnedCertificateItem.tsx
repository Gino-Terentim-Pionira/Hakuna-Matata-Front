import React, { FC } from 'react';
import { IOwnedCertificate } from '../../services/CertificateService';
import InventoryItem from './InventoryItem';
import certificateIcon from '../../assets/icons/certificate/certificate.svg';
import { Button } from '@chakra-ui/react';
import colorPalette from '../../styles/colorPalette';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const OwnedCertificateItem: FC<IOwnedCertificate> = ({
    certificate_name,
    description,
    image,
    issue_date,
    first_name,
    last_name,
    hash
}) => {

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        }
    });

    // Create Document Component
    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    );

    return (
        <InventoryItem
            name={certificate_name}
            description={description}
            type='Certificado'
            image={certificateIcon}
            customButton={
                <PDFDownloadLink document={<MyDocument />} fileName={`${certificate_name}.pdf`}>
                    {({ loading }) => {
                        <Button
                            width='100%'
                            height='3.5rem'
                            background={colorPalette.primaryColor}
                            color={colorPalette.buttonTextColor}
                            fontSize='1.5rem'
                            borderRadius='8px'
                            _hover={{ bg: colorPalette.primaryColor }}
                            isDisabled={loading}
                        >
                            Download
                        </Button>
                    }}
                </PDFDownloadLink>
            }
        />
    )
}

export default OwnedCertificateItem;
