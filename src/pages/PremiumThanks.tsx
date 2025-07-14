import React, { useState, BaseSyntheticEvent } from 'react';
import { Flex, Box, Image, Text, Button, useMediaQuery } from '@chakra-ui/react';
import colorPalette from '../styles/colorPalette';
import CheetahBlink from '../assets/icons/cheetahblink.svg';
import fontTheme from '../styles/base';
import MediaQueriesEnum from '../utils/enums/mediaQueries';
import { useHistory } from 'react-router-dom';
import { PremiumServices } from '../services/PremiumServices';
import { SuportRequestModal } from '../components/modals/SuportRequestModal';
import AlertModal from '../components/modals/AlertModal';
import { CONTINUE } from '../utils/constants/buttonConstants';

const PremiumThanks = () => {
    const [suportIsOpen, setSuportIsOpen] = useState(false);
	const [suportMessage, setSuportMessage] = useState<string>("");
	const [alertIsOpen, setAlertIsOpen] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
	const premiumServices = new PremiumServices();
    const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);
    const history = useHistory();

	const goToHome = () => {
		history.push('/mainPage');
	};

    const handleSuportRequest = async () => {
        setIsLoading(true);
        try {
            await premiumServices.sendSuportRequest(
                userEmail,
                '[SUPORTE] Pedido de Ajuda',
                suportMessage
            );
            setAlertTitle('Pedido enviado!');
            setAlertMsg('Seu pedido de ajuda foi recebido com sucesso. Em breve entraremos em contato por e-mail.');
        } catch (error) {
            setAlertTitle('Erro ao enviar');
            setAlertMsg('Não foi possível enviar seu pedido. Por favor, entre em contato pelo email de suporte: pionira_adm@ginoterentim.com');
        } finally {
            setIsLoading(false);
            setSuportIsOpen(false);
            setAlertIsOpen(true);
        }
    };

    return (
        <Flex
            h="100vh"
            w="100vw"
            align="center"
            justify="center"
            flexDirection="column"
            bg={colorPalette.beige}
        >
            <Box position="relative">
                <Box
                    position="absolute"
                    width="110px"
                    height="110px"
                    bg={colorPalette.primaryColor}
                    borderRadius="full"
                    zIndex={1}
                    top="5px"
                    left="10px"
                    filter="blur(0.5px)"
                />
                <Image
                    src={CheetahBlink}
                    width="140px"
                    position="relative"
                    zIndex={2}
                />
            </Box>

            <Text
                fontFamily={fontTheme.fonts}
                fontSize={isDesktop ? '48px' : '36px'}
                fontWeight='bold'
                color={colorPalette.brownText}
                mt='16px'
                width={isDesktop ? '665px' : '280px'}
                textAlign='center'
            >
                Muito obrigado por apoiar a Pionira!
      </Text>

            <Text
                fontFamily={fontTheme.fonts}
                fontSize={isDesktop ? '24px' : '16px'}
                fontWeight='regular'
                color={colorPalette.brownText}
                mt='16px'
                width={isDesktop ? '700px' : '350px'}
                textAlign='center'
            >
                Sua compra não é só um benefício para você: graças ao seu apoio, mais pessoas poderão acessar educação gratuita e transformar suas vidas. Juntos, estamos construindo um futuro com mais oportunidades para todos.
      </Text>

            <Text
                fontFamily={fontTheme.fonts}
                fontSize={isDesktop ? '16px' : '12px'}
                fontWeight='regular'
                color={colorPalette.brownText}
                mt='8px'
                width={isDesktop ? '680px' : '350px'}
                textAlign='center'
            >
                Assim que o pagamento for confirmado, suas recompensas da Pionira serão liberadas automaticamente e você receberá um aviso por e-mail.
      </Text>

            <Flex
                flexDirection='column'
            >
                <Button
                    w='230px'
                    height='50px'
                    marginTop='32px'
                    marginBottom='8px'
                    background={colorPalette.correctAnswer}
                    color={colorPalette.buttonTextColor}
                    fontSize='20px'
                    borderRadius='50px'
                    _hover={{
                        opacity: 0.7,
                    }}
                    onClick={goToHome}
                    cursor={'pointer'}
                >
                    OK
                </Button>

                <Button
                    w='230px'
                    height='50px'
                    background={colorPalette.beige}
                    color={colorPalette.brownText}
                    fontSize='20px'
                    borderWidth='1px'
                    borderColor={colorPalette.brownText}
                    borderRadius='50px'
                    _hover={{
                        opacity: 0.7,
                    }}
                    onClick={()=>setSuportIsOpen(true)}
                    cursor={'pointer'}
                >
                    Preciso de ajuda
                </Button>
            </Flex>

            <SuportRequestModal
				isOpen={suportIsOpen}
				inputHeader='Como podemos te ajudar?'
				inputFooter='Descreva sua dúvida ou dificuldade e nossa equipe de suporte irá te responder o mais rápido possível'
				buttonText='Enviar'
				onClose={() => setSuportIsOpen(false)}
				messageOnChange={(e: BaseSyntheticEvent) => setSuportMessage(e.target.value)}
				onButtonClick={handleSuportRequest}
				isLoading={isLoading}
                hasEmailInput={true}
                email={userEmail}
                onEmailChange={(e: BaseSyntheticEvent) => setUserEmail(e.target.value)}
			/>

            <AlertModal
                isOpen={alertIsOpen}
                onClose={() => setAlertIsOpen(false)}
                alertTitle={alertTitle}
                alertBody={alertMsg}
                buttonBody={
                    <Button backgroundColor={colorPalette.primaryColor} onClick={() => setAlertIsOpen(false)} color={colorPalette.whiteText}>
                        {CONTINUE}
                    </Button>
                }
            />
        </Flex>
    );
};

export default PremiumThanks;
