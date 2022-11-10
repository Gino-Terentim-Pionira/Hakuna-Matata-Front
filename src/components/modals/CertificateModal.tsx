import React, { FC, useEffect, useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	Box,
	ModalBody,
	Flex,
	Button,
	Text,
	Image,
	Center,
} from '@chakra-ui/react';

// Components
import AlertModal from './AlertModal';
import LoadingState from '../LoadingState';

// Requisitions
import api from '../../services/api';

// Styles
import fontTheme from '../../styles/base';
import colorPalette from '../../styles/colorPalette';

// Images
import certificate from '../../assets/icons/certificate/certificate.svg';

// Utils
import { useHistory } from 'react-router-dom';

interface ICertificate {
	isOpen: boolean;
	onOpen: VoidFunction;
	onClose: VoidFunction;
	trail: number;
	name: string;
}

const CertificateModal: FC<ICertificate> = ({ isOpen, trail, name }) => {
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubflow, setSubflow] = useState(false);

	const [onError, setOnError] = useState(false);
	const history = useHistory();

	const goToPremium = () => {
		history.push('/premium');
	};

	const getUser = async () => {
		try {
			const userId = sessionStorage.getItem('@pionira/userId');
			const user = await api.get(`/user/${userId}`);

			if (user.data.isSubscribed) setIsSubscribed(true);
			else setIsSubscribed(false);
		} catch (error) {
			setOnError(true);
		}
	};

	const updateUserCertificate = async () => {
		try {
			setIsLoading(true);
			const userId = sessionStorage.getItem('@pionira/userId');
			const certificate = await api.get('/certificate/');
			const userCertificate = certificate.data[trail - 1].user_id;
			const certificateId = certificate.data[trail - 1]._id;
			const user = await api.get(`/user/${userId}`);
			console.log("entrou na funcao");

			if (!userCertificate.includes(userId)) {
				console.log("entrou no if");
				userCertificate.push(userId);

				const today = new Date();
				const firstAccess = new Date(user.data.firstAccessDate);
				const monthDic = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
				const date = String(today.getDate()) + " de " + monthDic[today.getMonth()] + " de " + String(today.getFullYear());
				const firstDate = String(firstAccess.getDate()) + " de " + monthDic[firstAccess.getMonth()] + " de " + String(firstAccess.getFullYear());
				console.log(firstDate);

				const res = await api.post('/certificate/generate', {
					id: userId,
					trail: trail,
					first_name: user.data.first_name,
					last_name: user.data.last_name,
					firstDate: firstDate,
					date: date,
				});

				await api.patch(`/certificate/${certificateId}`, {
					user_id: userCertificate,
				});

				await api.patch(`user/certificate/${userId}`, {
					certificateId: certificateId,
					certificateUrl: res.data.location,
				});
			}
			setIsLoading(false);
			
			if (isSubflow) {
				goToPremium();
			} else {
				window.location.reload();
			}
		} catch (error) {
			console.log("entrou no erro");
			console.log("erro foi:",error);
			setOnError(true);
		}
	};

	useEffect(() => {
		getUser();
	}, []);


	useEffect(() => {
		if (isSubflow) {
			updateUserCertificate();
		}
	}, [isSubflow]);

	

	return (
		<Box width='18%'>
			<Modal
				isOpen={isOpen}
				onClose={() => window.location.reload()}
				size='4xl'
			>
				<ModalOverlay />
				<ModalContent paddingBottom='1.5rem'>
					<Box
						w='15%'
						bg={colorPalette.primaryColor}
						h='50vh'
						position='absolute'
						zIndex='0'
						right='-0.3'
						top='-0.2'
						borderTopEndRadius='5px'
						borderBottomStartRadius='23%'
						clipPath='polygon(0% 0%, 100% 0%, 100% 80%)'
					/>
					{isLoading ? (
						<Center w='100%' h='50vh'>
							<LoadingState />
						</Center>
					) : (
						<ModalBody>
							<Flex
								direction='column'
								alignItems='center'
								mt='1.2rem'
								mr='1.5rem'
							>
								<Text
									fontFamily={fontTheme.fonts}
									fontWeight='semibold'
									fontSize='4rem'
									color={colorPalette.secondaryColor}
								>
									Você conseguiu!
								</Text>
								{isSubscribed ? (
									<Text
										w='80%'
										textAlign='center'
										fontFamily={fontTheme.fonts}
										fontWeight='semibold'
										fontSize='1.45rem'
										color={colorPalette.secondaryColor}
									>
										Por ter completado a trilha, você pode
										adquirir o certificado de "Conhecimento
										Ágil"!
									</Text>
								) : (
									<Text
										w='80%'
										textAlign='center'
										fontFamily={fontTheme.fonts}
										fontWeight='semibold'
										fontSize='1.45rem'
										color={colorPalette.secondaryColor}
									>
										Por ter completado a trilha, você pode
										adquirir o certificado do modulo de
										<Text ml='-10rem'>
											"conhecimento agil" ao
										</Text>
										<Text
											ml='15.25rem'
											mt='-2.15rem'
											color='#F05F5F'
										>
											assinar a plataforma!
										</Text>
									</Text>
								)}
							</Flex>

							<Flex
								flexDirection='column'
								justifyContent='center'
								alignItems='center'
								margin='2rem'
							>
								<Image src={certificate} width='14rem' />
								<Text
									fontFamily={fontTheme.fonts}
									fontWeight='medium'
									textDecoration='underline'
									fontSize='1.5rem'
									color={colorPalette.secondaryColor}
									margin='.8rem'
								>
									{name}
								</Text>
							</Flex>

							{isSubscribed ? (
								<>
									<Flex
										w='90%'
										h='12vh'
										margin='auto'
										justifyContent='space-around'
										flexDirection='column'
										alignItems='center'
									>
										<Button
											bgColor={colorPalette.primaryColor}
											fontWeight='normal'
											color='white'
											onClick={updateUserCertificate}
											w='42%'
											h='60px'
											borderRadius='5px'
											fontSize='2.5rem'
											fontFamily={fontTheme.fonts}
										>
											Continuar
										</Button>
										<Text
											w='80%'
											textAlign='center'
											fontFamily={fontTheme.fonts}
											fontWeight='semibold'
											fontSize='1rem'
											color={colorPalette.secondaryColor}
										>
											*Você pode acessar seu certificado
											na seção de "Certificados" do seu
											perfil
										</Text>
									</Flex>
								</>
							) : (
								<>
									<Flex
										w='90%'
										h='12vh'
										margin='auto'
										justifyContent='space-around'
										flexDirection='row'
										alignItems='center'
									>
										<Button
											bgColor={colorPalette.primaryColor}
											fontWeight='normal'
											color='white'
											w='42%'
											h='60px'
											borderRadius='5px'
											fontSize='2.5rem'
											fontFamily={fontTheme.fonts}
											onClick={() => {
												setSubflow(true);
											}}
										>
											Assinar
										</Button>
										<Button
											bgColor='#F05F5F'
											fontWeight='normal'
											color='white'
											onClick={updateUserCertificate}
											w='42%'
											h='60px'
											borderRadius='5px'
											fontSize='2.5rem'
											fontFamily={fontTheme.fonts}
										>
											Ignorar
										</Button>
									</Flex>
								</>
							)}
						</ModalBody>
					)}
				</ModalContent>
			</Modal>

			<AlertModal
				isOpen={onError}
				onClose={() => window.location.reload()}
				alertTitle='Ops!'
				alertBody='Parece que ocorreu um erro durante a nossa viagem, Jovem! tente recarregar!'
				buttonBody={
					<Button
						color='white'
						bg={colorPalette.primaryColor}
						onClick={() => window.location.reload()}
					>
						Recarregar
					</Button>
				}
			/>
		</Box>
	);
};

export default CertificateModal;
