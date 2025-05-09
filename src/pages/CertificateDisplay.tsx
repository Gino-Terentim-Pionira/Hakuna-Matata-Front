import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CertificateService } from '../services/CertificateService';
import LoadingOverlay from '../components/LoadingOverlay';
import colorPalette from '../styles/colorPalette';
import { Flex, Box, useToast, Button, Center } from '@chakra-ui/react';


const CertificateDisplay = () => {
    const { hash } = useParams();
    const [loading, setLoading] = useState(true);
    const certificateService = new CertificateService();
    const [error, setError] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const toast = useToast();

    const handleCopyHash = () => {
        if (hash) {
            navigator.clipboard.writeText(hash);
            toast({
                title: 'Código copiado!',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const handleCopyUrl = () => {
        const fullUrl = window.location.origin + location.pathname;
        navigator.clipboard.writeText(fullUrl);
        toast({
            title: 'URL copiada!',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const data = await certificateService.getCertificateDetail(hash as string);

                const url = await certificateService.handleGeneratePDF(
                    data.image,
                    data.content,
                    data.first_name,
                    data.last_name,
                    data.issue_date,
                    data.hash
                );

                setPdfUrl(url);

            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [hash]);

    return (
        loading ? (
            <LoadingOverlay />
        ) : (
                <Flex
                    bg={colorPalette.oracleWhite}
                    minH="100vh"
                    p={{ base: 4, md: 8 }}
                    justify="center"
                    align="center"
                    flexDirection='column'
                >
                    <Center
                        marginBottom='16px'
                    >
                        <Button
                            width='150px'
                            height='50px'
                            background={colorPalette.primaryColor}
                            color={colorPalette.buttonTextColor}
                            fontSize='1rem'
                            onClick={handleCopyHash}
                            _hover={{}}
                            marginRight='16px'
                        >
                            Copiar Código
                        </Button>

                        <Button
                            width='150px'
                            height='50px'
                            background={colorPalette.primaryColor}
                            color={colorPalette.buttonTextColor}
                            fontSize='1rem'
                            onClick={handleCopyUrl}
                            _hover={{}}
                        >
                            Copiar URL
                        </Button>

                    </Center>
                    <Box
                        w="100%"
                        maxW="900px"
                        h={{ base: '75vh', md: '80vh' }}
                        boxShadow="md"
                        borderRadius="lg"
                        overflow="hidden"
                        bg="white"
                    >
                        <Box as="iframe"
                            src={pdfUrl as string}
                            width="100%"
                            height="100%"
                            title="Certificado PDF"
                            border="none"
                        />
                    </Box>
                </Flex>
            )
    );
};

export default CertificateDisplay;
