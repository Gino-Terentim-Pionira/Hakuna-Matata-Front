import React, { useEffect, useState } from 'react';
import { Box, Flex, Spacer, Text } from '@chakra-ui/layout';
import { Center, Image, SimpleGrid } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useUser } from '../hooks';
import usePath from '../hooks/usePath';

// Components
import ShopItem from '../components/shopItem';
import LoadingOverlay from '../components/LoadingOverlay';

// Requisitions
import api from '../services/api';

// styles
import fontTheme from '../styles/base';
import colorPalette from '../styles/colorPalette';

// Images
import icon_inventory from '../assets/icons/icon_inventory.svg';
import BackButton from '../components/BackButton';
import { getStatusPoints } from '../utils/statusUtils';
import { useSoundtrack } from "../hooks/useSoundtrack";
import { CertificateService, IShopCertificate } from "../services/CertificateService";
import { IoMdCloseCircle } from "react-icons/io";
import { BiSolidCheckCircle } from "react-icons/bi";
import trailEnum from '../utils/enums/trail';

const Shop = () => {
	const { handleBack } = usePath();
	const { getNewUserInfo, userData } = useUser();
	const { soundtrackData, audio } = useSoundtrack();
	const [shopItem, setShopItem] = useState([]);
	const [certificates, setCertificates] = useState([]);
	const [currentUserId, setCurrentUserId] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	const history = useHistory();

	const goToInventory = async () => {
		const userId = sessionStorage.getItem('@pionira/userId');
		history.push(`/inventory/${userId}`);
	}

	const goBack = () => {
		handleBack();
	};

	const generateLabel = (count: number, singular: string, plural: string): string => {
		return !count ? 'Finalizado!' : `Falta ${count > 1 ? plural : singular}`;
	};

	const RequirementItem = ({ isCompleted, label, requirementText }: { isCompleted: boolean; label: string; requirementText: string }) => (
		<Flex
			fontFamily={fontTheme.fonts}
			color={isCompleted ? colorPalette.correctAnswer : colorPalette.alertText}
			alignItems='center'
		>
			{isCompleted ? <BiSolidCheckCircle size='20px' /> : <IoMdCloseCircle size='20px' />}
			<Text marginLeft='4px'>{requirementText} ({label})</Text>
		</Flex>
	);

	const certificateItemDescription = (description: string, trail: trailEnum, isEnoughVideo: number, isEnoughQuestion: number, isEnoughFinalQuiz: number) => {
		const videoLabel = generateLabel(isEnoughVideo, 'assistir 1 vídeo', `assistir ${isEnoughVideo} vídeos`);
		const questionLabel = generateLabel(isEnoughQuestion, 'acertar 1 questão', `acertar ${isEnoughQuestion} questões`);
		const finalQuizLabel = generateLabel(isEnoughFinalQuiz, 'acertar 1 questão', `acertar ${isEnoughFinalQuiz} questões`);

		return (
			<>
				{description}.
				<Text fontFamily={fontTheme.fonts} fontWeight="bold">
					Requisitos para a compra, na Trilha do {trail}:
			</Text>
				<RequirementItem
					isCompleted={!isEnoughVideo}
					label={videoLabel}
					requirementText="Assistir 80% dos vídeos"
				/>
				<RequirementItem
					isCompleted={!isEnoughQuestion}
					label={questionLabel}
					requirementText="Acertar 80% dos desafios"
				/>
				<RequirementItem
					isCompleted={!isEnoughFinalQuiz}
					label={finalQuizLabel}
					requirementText="Acertar 80% do desafio final"
				/>
			</>
		);
	};

	useEffect(() => {
		const getShopItens = async () => {
			try {
				if (Object.keys(userData).length == 0) {
					await getNewUserInfo();
				}
				const res = await api.get('/shopItem/');
				const userId = sessionStorage.getItem('@pionira/userId');
				const userIdString = '' + userId;
				setShopItem(res.data);
				setCurrentUserId(userIdString);
			} catch (error) {
				setShopItem([]);
			}
		};

		const getCertificates = async () => {
			try {
				const userId = sessionStorage.getItem('@pionira/userId');
				const userIdString = '' + userId;
				const res = await new CertificateService().listShopCertificates(userIdString)
				setCertificates(res);
			} catch {
				setCertificates([])
			}
		}

		const getShopInfo = async () => {
			setIsLoading(true)
			await getShopItens();
			await getCertificates();
			setIsLoading(false);
		}

		if (!soundtrackData.isPlaying) {
			audio.src = sessionStorage.getItem("lastSoundtrack") as string;
		}

		getShopInfo();
	}, []);
	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			bg={colorPalette.backgroundColor}
			h='100vh'
			overflow='hidden'
		>
			<Box
				w='40%'
				bg={colorPalette.primaryColor}
				h='100vh'
				position='absolute'
				zIndex='0'
				left='0'
				top='0'
				clipPath='polygon(0% 0%, 45% 0%, 0% 35%, 0 10%)'
			/>
			<Flex
				w='100%'
				flexDirection='row'
				alignItems='center'
				justifyContent='center'
			>
				<BackButton
					onClick={goBack}
				/>
				<Spacer />
				<Text
					fontFamily={fontTheme.fonts}
					mt='1.5rem'
					fontSize='80px'
					color={colorPalette.primaryColor}
					fontWeight='semibold'
					alignSelf='center'
				>
					LOJA
				</Text>
				<Spacer />
				<Box display='flex' flexDirection='column' justifyContent='flex-end' mr='2rem' mt='1rem'>
					<Center
						_hover={{
							cursor: 'pointer',
							transform: 'scale(1.1)',
						}}
						transition='all 200ms cubic-bezier(.38, .5, .5, 1.5)'
						border='2px solid black'
						borderRadius='4.5rem'
						width='5rem'
						height='5rem'
						bg='white'
						onClick={() => goToInventory()}
					>
						<Image width='3.5rem' src={icon_inventory} marginBottom='.1rem' />
					</Center>
					<Text
						color={colorPalette.linkTextColor}
						fontFamily={fontTheme.fonts}
						fontSize='20px'
						fontWeight='regular'
						alignSelf='center'
					>
						Inventário
					</Text>
				</Box>
			</Flex>
			{isLoading ? (
				<LoadingOverlay />
			) : (
					<>
						<SimpleGrid w='72%' columns={3} overflowY='auto' mt='2rem'>
							{
								certificates.map((certificate: IShopCertificate) => (
									<ShopItem
										key={certificate.name}
										_id={certificate.id}
										current_user_id={currentUserId}
										items_id={userData.items_id}
										userCoins={userData.coins}
										name={certificate.name}
										value={certificate.price}
										description={certificateItemDescription(certificate.description, certificate.trail, certificate.isEnoughVideo, certificate.isEnoughQuestion, certificate.isEnoughFinalQuiz)}
										type='item4'
										userStatus={getStatusPoints(userData, "agilidade")}
										itemStatus={{ status_name: "agilidade", points: 1 }}
									/>
								))
							}
							{shopItem.map(
								({
									_id,
									name,
									value,
									description,
									type,
									status_requirement
								}: {
									_id: string;
									name: string;
									value: number;
									description: string;
									type: string;
									status_requirement: {
										status_name: string;
										points: number;
									}
								}) => {
									if (!userData?.items_id?.includes(_id)) {
										return (
											<ShopItem
												key={_id}
												_id={_id}
												current_user_id={currentUserId}
												items_id={userData.items_id}
												userCoins={userData.coins}
												name={name}
												value={value}
												description={description}
												type={type}
												userStatus={getStatusPoints(userData, status_requirement.status_name)}
												itemStatus={status_requirement}
											/>
										);
									}
								},
							)}
						</SimpleGrid>
					</>
				)}
		</Box>
	);
};

export default Shop;
