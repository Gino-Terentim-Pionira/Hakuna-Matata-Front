import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CertificateService } from '../services/CertificateService';
import LoadingOverlay from '../components/LoadingOverlay';
import colorPalette from '../styles/colorPalette';
import { Flex, Box, useToast, Button, useMediaQuery } from '@chakra-ui/react';
import AlertModal from '../components/modals/AlertModal';
import { errorCases } from '../utils/errors/errorsCases';
import MediaQueriesEnum from '../utils/enums/mediaQueries';


const CertificateDisplay = () => {
    const { hash } = useParams();
    const [loading, setLoading] = useState(true);
    const certificateService = new CertificateService();
    const [error, setError] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);
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

    const handleDownloadPDF = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'certificado.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({
                title: 'Download iniciado!',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        }
    }

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const data = await certificateService.getCertificateDetail(hash as string);

                const url = URL.createObjectURL(data);

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
                <>
                    <Flex
                        bg={colorPalette.oracleWhite}
                        minH="100vh"
                        p={{ base: 4, md: 8 }}
                        justify="center"
                        align="center"
                        flexDirection='column'
                    >
                        <Flex
                            direction={isDesktop ? 'row' : 'column'}
                            align="center"
                            justify="center"
                            gap={4}
                            mb={6}
                        >
                            <Button
                                width='150px'
                                height='50px'
                                background={colorPalette.primaryColor}
                                color={colorPalette.buttonTextColor}
                                fontSize='1rem'
                                onClick={handleCopyHash}
                                _hover={{}}
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

                            <Button
                                width="150px"
                                height="50px"
                                background={colorPalette.primaryColor}
                                color={colorPalette.buttonTextColor}
                                fontSize="1rem"
                                onClick={handleDownloadPDF}
                                _hover={{}}
                            >
                                Baixar Certificado
                        </Button>


                        </Flex>
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
                    <AlertModal
                        isOpen={error}
                        onClose={() => window.location.reload()}
                        alertTitle='Ops!'
                        alertBody={errorCases.SERVER_ERROR}

                        buttonBody={
                            <Button
                                color='white'
                                _hover={{ bg: colorPalette.primaryColor }}
                                bg={colorPalette.primaryColor}
                                onClick={() => window.location.reload()}
                            >
                                Recarregar
                    </Button>
                        }
                    />
                </>
            )
    );
};

export default CertificateDisplay;
