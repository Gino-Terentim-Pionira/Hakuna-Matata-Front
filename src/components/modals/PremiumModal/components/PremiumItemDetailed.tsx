import React, { useState, BaseSyntheticEvent } from 'react';
import { Box, Button, Flex, Slide, Text } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import fontTheme from '../../../../styles/base';
import { SuportRequestModal } from '../../SuportRequestModal';
import { PremiumServices } from '../../../../services/PremiumServices';
import { useUser } from '../../../../hooks';
import AlertModal from '../../AlertModal';
import { CONTINUE } from '../../../../utils/constants/buttonConstants';

type PremiumItemDetailedTypes = {
	isOpen: boolean;
	title: string | undefined;
	detail: string | undefined;
	checkoutId: string | undefined;
	productId: string | undefined;
	isSubscribed: boolean | undefined;
	onClose: VoidFunction;
}


export const PremiumItemDetailed = ({ isOpen, onClose, title, detail, isSubscribed, checkoutId, productId }: PremiumItemDetailedTypes) => {
	const [startY, setStartY] = useState<number | null>(null);
	const [translateY, setTranslateY] = useState(0);
	const [closing, setClosing] = useState(false);
	const [suportIsOpen, setSuportIsOpen] = useState(false);
	const [suportMessage, setSuportMessage] = useState<string>("");
	const [alertIsOpen, setAlertIsOpen] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
	const premiumServices = new PremiumServices();
	const { userData } = useUser();

	const handleCancelRequest = async () => {
        setIsLoading(true);
        try {
            await premiumServices.sendSuportRequest(
                userData.email,
                '[SUPORTE] Cancelar Assinatura',
                suportMessage,
                productId || ''
            );
            setAlertTitle('Pedido enviado!');
            setAlertMsg('Seu pedido de cancelamento foi recebido com sucesso. Em breve entraremos em contato por e-mail.');
        } catch (error) {
            setAlertTitle('Erro ao enviar');
            setAlertMsg('Não foi possível enviar seu pedido. Por favor, entre em contato pelo email de suporte: pionira_adm@ginoterentim.com');
        } finally {
            setIsLoading(false);
            setSuportIsOpen(false);
            setAlertIsOpen(true);
        }
    };

	const goToEduzz = () => {
		window.location.href = `/eduzz/${checkoutId}`;
	};

	const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
		setStartY(e.touches[0].clientY);
	};

	const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
		if (startY === null) return;
		const currentY = e.touches[0].clientY;
		const diff = currentY - startY;
		if (diff > 0) setTranslateY(diff);
	};

	const handleTouchEnd = () => {
		if (translateY > 100) {
			setClosing(true);
			onClose();
			setTimeout(() => {
				setClosing(false);
				setTranslateY(0);
			}, 100);
		} else {
			setTranslateY(0);
		}
	};

	return (
		<>
			<Slide direction='bottom' in={isOpen} style={{ zIndex: 1300 }}>
				<Box onClick={onClose} w='100%' h='100vh' />
				<Flex
					position='relative'
					w='100%'
					h={{ base: 'fit-content', md: '360px' }}
					bg={colorPalette.slideBackground}
					rounded='md'
					shadow='md'
					flexDirection='column'
					border='4px solid'
					borderColor={colorPalette.secondaryColor}
					fontFamily={fontTheme.fonts}
					color={colorPalette.textColor}
					style={{
						transform: `translateY(${translateY}px)`,
						transition: closing ? 'transform 0.3s ease-in-out' : '',
					}}
				>
					<Flex
						display={{ base: 'flex', md: 'none' }}
						width='100%'
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
						height='fit-content'
						paddingBottom='8px'
						paddingTop='12px'
					>
						<Flex
							width='50px'
							height='6px'
							borderRadius='1000px'
							backgroundColor={colorPalette.neutralGray}
							margin='auto'
						/>
					</Flex>
					<Text
						display={{ base: 'none', md: 'block' }}
						alignItems='flex-start'
						position='absolute'
						onClick={onClose}
						transition='all 0.2s'
						_hover={{
							cursor: 'pointer',
							opacity: '80%',
						}}
						w='fit-content'
						height='36px'
						color={colorPalette.closeButton}
						fontWeight='bold'
						fontSize='32px'
						right='16px'
						top='4px'
					>
						X
				</Text>
					<Flex
						paddingX={{ base: '16px', md: '24px' }}
						paddingTop={{ base: '8px', md: '16px' }}
						flexDir='column'
						top={{ base: 0, md: '32px' }}
						position={{ base: 'relative', md: 'absolute' }}
						w={{ base: '100%', md: '95%' }}
						height={{ base: '100%', md: 'auto' }}
					>
						<Text
							fontSize={{ base: '18px', md: '28px' }}
							fontWeight='semibold'
							textAlign='left'
							mb={{ base: '16px', md: '8px' }}
						>
							{title}
						</Text>
						<Flex
							flexDirection={{ base: 'column', md: 'row' }}
							alignItems='flex-start'
							justifyContent='space-between'
							columnGap='24px'
							height={{ base: '100%', md: 'auto' }}
						>
							<Box
								maxHeight={{ base: '60dvh', md: 'auto' }}
								overflowY='auto'
								width={{ base: '100%', md: '80%' }}
							>
								<Text
									fontSize={{ base: '16px', md: '18px' }}
									fontWeight='regular'
									textAlign='justify'
								>
									{detail}
								</Text>
							</Box>

							<Button
								w={{ base: "100%", md: '200px' }}
								height='3.5rem'
								marginTop={{ base: "24px", md: "4px" }}
								marginBottom={{ base: '24px', md: '4px' }}
								background={isSubscribed ? colorPalette.closeButton : colorPalette.primaryColor}
								color={colorPalette.buttonTextColor}
								fontSize={{ base: '20px', md: '1.5rem' }}
								borderRadius='8px'
								_hover={{
									opacity: 0.7,
								}}
								onClick={isSubscribed ? () => setSuportIsOpen(true) : goToEduzz}
								cursor={'pointer'}
							>
								{isSubscribed ? 'Cancelar Assinatura' : 'Saiba Mais'}
							</Button>
						</Flex>
					</Flex>
				</Flex>
			</Slide>
			<SuportRequestModal
				isOpen={suportIsOpen}
				inputHeader='Você poderia compartilhar com a gente o motivo do seu cancelamento?'
				inputFooter='Sua opinião é muito importante para que possamos melhorar a Pionira. Após preencher o motivo, é só clicar em “Enviar” para concluir seu pedido de cancelamento'
				buttonText='Confirmar Cancelamento'
				onClose={() => setSuportIsOpen(false)}
				messageOnChange={(e: BaseSyntheticEvent) => setSuportMessage(e.target.value)}
				onButtonClick={handleCancelRequest}
				isLoading={isLoading}
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
		</>
	);
}
