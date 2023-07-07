import React, { SetStateAction, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDisclosure, Image, Flex, Button } from '@chakra-ui/react';
import { useUser } from '../hooks';
import useInsignias from '../hooks/useInsignias';

// Components
import TutorialModal from '../components/modals/TutorialModal';
import NarrativeModal from '../components/modals/NarrativeModal';
import AlertModal from '../components/modals/AlertModal';
import DailyReward from '../components/modals/DailyRewardModal';
import SubscribedModal from '../components/modals/SubscribedModal';

// Requisitions
import api from '../services/api';
import mainPageScript from '../utils/scripts/MainPage/MainPageScript';

//Utils
import ignoranceFilterFunction from '../utils/ignorance/ignoranceFilter';
import colorPalette from '../styles/colorPalette';

// Images
import map1_bg from '../assets/scenerys/mainPage/map1_bg.png';
import map2_bg from '../assets/scenerys/mainPage/map2_bg.png';
import icon_cheeta from '../assets/icons/icon_cheeta.svg';
import icon_block from '../assets/icons/icon_block.svg';
import ignorance100 from '../assets/ignorance/mainPage/ignorance100.png';
import ignorance75 from '../assets/ignorance/mainPage/ignorance75.png';
import ignorance50 from '../assets/ignorance/mainPage/ignorance50.png';
import ignorance25 from '../assets/ignorance/mainPage/ignorance25.png';
import { errorCases } from '../utils/errors/errorsCases';
import IgnorancePremiumIcons from '../components/IgnorancePremiumIcons';
import NavActions from '../components/NavActions';
import LoadingOverlay from '../components/LoadingOverlay';
import BlockedModal from '../components/modals/BlockedModal';

interface IScript {
	name: string;
	image: string;
	texts: string[];
}

const MainPage = () => {
	const history = useHistory();
	const {
		isOpen: tutorialIsOpen,
		onClose: tutorialOnClose,
		onOpen: tutorialOnOpen,
		onToggle: tutorialOnToggle,
	} = useDisclosure();

	const {
		isOpen: narrativeIsOpen,
		onOpen: narrativeOnOpen,
		onToggle: narrativeOnToggle,
	} = useDisclosure();


	const {
		isOpen: dailyIsOpen,
		onOpen: dailyOnOpen,
		onClose: dailyOnClose,
	} = useDisclosure();

	const { getNewUserInfo, setUserData, userData } = useUser();
	const { getInsignias } = useInsignias();
	const [script, setScript] = useState<IScript[]>([]);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const alertOnClose = () => setIsConfirmOpen(false);
	const [alertAnswer, setAlertAnswer] = useState<string | undefined>('');
	const cancelRef = useRef<HTMLButtonElement>(null);
	const [onError, setOnError] = useState(false);
	const [ignoranceImage, setIgnoranceImage] = useState('');
	const [isSubscribedModal, setIsSubscribedModal] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [openBlockedModal, setOpenBlockedModal] = useState<boolean>(false);

	const ignoranceArray = [
		ignorance100,
		ignorance75,
		ignorance50,
		ignorance25,
	];

	//logic for checking and switching if first time is set to true
	const tutorialFirstOnClose = () => {
		try {
			if (userData.isFirstTimeAppLaunching) {
				const newScript = mainPageScript(userData.userName);
				setScript(newScript);
				narrativeOnOpen();
			}

			tutorialOnClose();
		} catch (error) {
			setOnError(true);
		}
	};

	const checkCanCollectDaily = async (value: number) => {
		const lastDate = new Date(value);
		const currentDate = new Date();

		const diffDays = currentDate.getDate() - lastDate.getDate();
		const sameMonth = lastDate.getMonth() === currentDate.getMonth();
		const sameYear = lastDate.getFullYear() === currentDate.getFullYear();
		if (sameMonth && sameYear && diffDays === 1) dailyOnOpen();
		else if (diffDays > 1) {
			dailyOnClose();

			try {
				const _userId: SetStateAction<string> | null = sessionStorage.getItem(
					'@pionira/userId',
				);
				const res = await api.get(`/user/${_userId}`);

				await api.patch(`/user/lastCollected/${_userId}`, {
					consecutiveDays: 0,
					lastCollected: currentDate.getTime(),
					coins: res.data.coins,
				});
				setUserData(res.data);
			} catch (error) {
				setOnError(true);
			}
		}
	};

	const setIgnoranceFilter = (
		ignorance: number,
		ignoranceArray: string[],
	) => {
		const filterBackgroung = ignoranceFilterFunction(
			ignorance,
			ignoranceArray,
		);
		setIgnoranceImage(filterBackgroung);
	};

	const getUserRequisition = async () => {
		if (userData._id) {
			setIgnoranceFilter(userData.ignorance, ignoranceArray);
			return
		};
		try {
			setIsLoading(true);
			const _userId: SetStateAction<string> | null = sessionStorage.getItem(
				'@pionira/userId',
			);
			const res = await api.get(`/user/${_userId}`);
			await getInsignias();
			setUserData(res.data);

			setIgnoranceFilter(res.data.ignorance, ignoranceArray);

			if (res.data.isFirstTimeAppLaunching) {
				tutorialOnOpen();
			}

			await checkCanCollectDaily(res.data.lastCollected);
			setIsLoading(false);
		} catch (error) {
			setOnError(true);
		}
	};

	/*
		const goToPath1 = () => {
			history.push('/finalTrail');
		};
	*/

	const goToPath2 = () => {
		history.push('/trilha-cheetah');
	};

	/*
		const goToPath3 = () => {
			history.push('/trilha-leao');
		};
	*/

	const quit = async () => {
		alertOnClose();
		sessionStorage.clear();
		location.reload();
	};

	const logout = () => {
		setAlertAnswer('Tem certeza que você deseja sair da Savana?');
		setIsConfirmOpen(true);
	};

	const updateImageOnTime = () => {
		const currentDate = new Date();
		const hour = currentDate.getHours();
		const minutes = currentDate.getMinutes();
		const currentSeconds = hour * 3600 + minutes * 60;

		if (currentSeconds >= 25200 && currentSeconds < 66600) {
			return true;
		} else {
			return false;
		}
	};

	// To add later:
	// const validIsPrime = async () => {
	// 	const userId = sessionStorage.getItem('@pionira/userId');
	// 	try {
	// 		const res = await api.get(`user/${userId}`);
	// 		const isSubscribed = res.data.isSubscribed;

	// 		if (isSubscribed) {
	// 			setIsSubscribedModal(true);
	// 		}
	// 		else
	// 			premiumOnOpen();
	// 	} catch (error) {
	// 		setOnError(true);
	// 	}
	// }
	// const checkSubscription = async () => {
	// 	const userId = sessionStorage.getItem('@pionira/userId');
	// 	try {
	// 		const res = await api.get(`user/${userId}`);
	// 		const subscribeId = res.data.subscribeId;
	// 		if (subscribeId) {
	// 			const subscription = await api.get(`user/subscription/${userId}`);
	// 			const isSubscribed = subscription.data.response.status;

	// 			if (isSubscribed === "canceled") {
	// 				await api.patch(`user/updateSubscription/${userId}`, {
	// 					isSubscribed: false
	// 				})
	// 				await getNewUserInfo();
	// 			}
	// 		}
	// 	} catch (error) {
	// 		setOnError(true);
	// 	}
	// }

	useEffect(() => {
		getUserRequisition();
		updateImageOnTime();
		getNewUserInfo();
	}, []);

	if (isLoading) {
		return <LoadingOverlay />
	}

	return (
		<>
			{updateImageOnTime() ? (
				<Image
					src={map1_bg}
					position='absolute'
					h='100vh'
					w='100%'
					zIndex='-3'
					left='0'
					top='0'
				/>
			) : (
				<Image
					src={map2_bg}
					position='absolute'
					h='100vh'
					w='100%'
					zIndex='-3'
					left='0'
					top='0'
				/>
			)}
			<Image
				src={ignoranceImage}
				position='absolute'
				h='100vh'
				w='100%'
				zIndex='-3'
				left='0'
				top='0'
			/>
			<Flex
				width='92.5%'
				justifyContent='space-between'
				alignItems='flex-start'
				margin='auto'
			>
				<NavActions logout={logout} dontShowMap prePath={history.location.pathname} />
				{narrativeIsOpen ? null : (
					<IgnorancePremiumIcons ignorance={userData.ignorance} />
				)}
			</Flex>

			{script.length > 0 ? (
				//verifica se o script possui algum conteúdo
				<NarrativeModal
					isOpen={narrativeIsOpen}
					script={script}
					onToggle={narrativeOnToggle}
				/>
			) : null}

			<DailyReward
				isOpen={dailyIsOpen}
				onOpen={dailyOnOpen}
				onClose={dailyOnClose}
			/>
			<TutorialModal
				isOpen={tutorialIsOpen}
				onClose={tutorialFirstOnClose}
				onToggle={tutorialOnToggle}
			/>

			<Flex margin='2vw' justifyContent='space-between'>
				{narrativeIsOpen ? null : (
					<>
						<Image
							src={icon_cheeta}
							_hover={{
								cursor: 'pointer',
								transform: 'scale(1.1)',
							}}
							transition='all 0.2s ease'
							position='absolute'
							width='5.74vw'
							left='15.75vw'
							top='49.5vh'
							onClick={() => goToPath2()}
						/>

						<Image
							src={icon_block}
							_hover={{
								cursor: 'pointer',
								transform: 'scale(1.1)',
							}}
							transition='all 0.2s ease'
							position='absolute'
							width='5.74vw'
							left='50.5vw'
							top='57.5vh'
							onClick={() => setOpenBlockedModal(true)}
						/>

						<Image
							src={icon_block}
							_hover={{
								cursor: 'pointer',
								transform: 'scale(1.1)',
							}}
							transition='all 0.2s ease'
							position='absolute'
							width='5.74vw'
							right='7vw'
							top='50vh'
							onClick={() => setOpenBlockedModal(true)}
						/>
					</>
				)}
			</Flex>


			<AlertModal
				isOpen={onError}
				onClose={() => window.location.reload()}
				alertTitle='Ops!'
				alertBody={errorCases.SERVER_ERROR}
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

			<AlertModal
				isOpen={isConfirmOpen}
				onClose={alertOnClose}
				alertTitle='Logout'
				alertBody={alertAnswer}
				buttonBody={
					<Button
						ref={cancelRef}
						color='white'
						bg={colorPalette.primaryColor}
						onClick={() => {
							quit();
						}}
					>
						Sair
					</Button>
				}
			/>

			<SubscribedModal
				isOpen={isSubscribedModal}
				onFunction={() => setIsSubscribedModal(false)}
			/>

			<BlockedModal 
				isOpen={openBlockedModal} 
				onClose={() => {setOpenBlockedModal(false)}} 
				subtitle = "Esse horizonte ainda não pode se explorado, por enquanto..."
			/>
		</>
	);
};

export default MainPage;
