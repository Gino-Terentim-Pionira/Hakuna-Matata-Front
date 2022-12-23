import React, { SetStateAction, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDisclosure, Image, Flex, Center, Button, Box } from '@chakra-ui/react';

// Components
import ProfileModal from '../components/modals/ProfileModal';
import TutorialModal from '../components/modals/TutorialModal';
import PremiumPassport from '../components/modals/PremiumPassport';
import RandomRewardModal from '../components/modals/RandomRewardModal';
import NarrativeModal from '../components/modals/NarrativeModal';
import AlertModal from '../components/modals/AlertModal';
import IgnoranceProgress from '../components/IgnoranceProgress';
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
import icon_profile from '../assets/icons/icon_profile.svg';
import icon_tutorial from '../assets/icons/icon_tutorial.svg';
import icon_shop from '../assets/icons/icon_shop.svg';
import icon_logout from '../assets/icons/icon_logout.svg';
import icon_membership from '../assets/icons/icon_membership.svg';
import icon_cheeta from '../assets/icons/icon_cheeta.svg';
import icon_blackMamba from '../assets/icons/icon_blackMamba.svg';
import icon_leao from '../assets/icons/icone_leao.svg';
import ignorance100 from '../assets/ignorance/mainPage/ignorance100.png';
import ignorance75 from '../assets/ignorance/mainPage/ignorance75.png';
import ignorance50 from '../assets/ignorance/mainPage/ignorance50.png';
import ignorance25 from '../assets/ignorance/mainPage/ignorance25.png';
import LoadingState from '../components/LoadingState';

interface IUser {
	ignorance: number;
	_id: string;
	userName: string;
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	birthday_date: string;
	is_confirmed: boolean;
	status: [number];
	coins: number;
	contribution: number;
	first_certificate: string;
	second_certificate: string;
	isFirstTimeAppLaunching: boolean;
	narrative_status: {
		trail1: number;
		trail2: number;
		mambaQuiz: number;
	};
}

interface IScript {
	name: string;
	image: string;
	texts: string[];
}

const MainPage = () => {
	const { isOpen, onClose, onOpen } = useDisclosure();
	const history = useHistory();
	const {
		isOpen: tutorialIsOpen,
		onClose: tutorialOnClose,
		onOpen: tutorialOnOpen,
		onToggle: tutorialOnToggle,
	} = useDisclosure();

	const {
		isOpen: premiumIsOpen,
		onClose: premiumOnClose,
		onOpen: premiumOnOpen,
		onToggle: premiumOnToggle,
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

	const [user, setUser] = useState<IUser>({} as IUser);
	const [script, setScript] = useState<IScript[]>([]);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const alertOnClose = () => setIsConfirmOpen(false);
	const [alertAnswer, setAlertAnswer] = useState<string | undefined>('');
	const cancelRef = useRef<HTMLButtonElement>(null);
	const [onError, setOnError] = useState(false);
	const [ignoranceImage, setIgnoranceImage] = useState('');
	const [isSubscribedModal, setIsSubscribedModal] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const ignoranceArray = [
		ignorance100,
		ignorance75,
		ignorance50,
		ignorance25,
	];

	//logic for checking and switching if first time is set to true
	const tutorialFirstOnClose = async () => {
		try {
			if (user.isFirstTimeAppLaunching) {
				const newScript = await mainPageScript();
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
		try {
			const _userId: SetStateAction<string> | null = sessionStorage.getItem(
				'@pionira/userId',
			);
			const res = await api.get(`/user/${_userId}`);
			setUser(res.data);

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

	const goToShop = () => {
		history.push('/shop');
	};

	const goToPath1 = () => {
		history.push('/finalTrail');
	};

	const goToPath2 = () => {
		history.push('/trilha-cheetah');
	};

	const goToPath3 = () => {
		history.push('/trilha-leao');
	};

	const quit = async () => {
		alertOnClose();
		sessionStorage.clear();
		location.reload();
	};

	const logout = () => {
		setAlertAnswer('Tem certeza que você deseja sair da savana?');
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

	const validIsPrime = async () => {
		const userId = sessionStorage.getItem('@pionira/userId');
		try {
			const res = await api.get(`user/${userId}`);
			const isSubscribed = res.data.isSubscribed;

			if (isSubscribed) {
				setIsSubscribedModal(true);
			}
			else
				premiumOnOpen();
		} catch (error) {
			setOnError(true);
		}
	}

	const checkSubscription = async () => {
		const userId = sessionStorage.getItem('@pionira/userId');
		try {
			const res = await api.get(`user/${userId}`);
			const subscribeId = res.data.subscribeId;
			if (subscribeId) {
				const subscription = await api.get(`user/subscription/${userId}`);
				const isSubscribed = subscription.data.response.status;
				
				if (isSubscribed === "canceled") {
					await api.patch(`user/updateSubscription/${userId}`, {
						isSubscribed: false
					})
				}		
			}
		} catch (error) {
			setOnError(true);
		}
	}

	useEffect(() => {
		getUserRequisition();
		updateImageOnTime();
		checkSubscription();
	}, []);

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
				<Flex
					maxWidth='4.5rem'
					marginTop='1.5rem'
					flexDirection='column'
					alignItems='center'
				>
					<Center
						_hover={{
							cursor: 'pointer',
							transform: 'scale(1.1)',
						}}
						transition='all 0.2s ease'
						mb='.75rem'
						border='2px solid black'
						borderRadius='4.5rem'
						width='4.5rem'
						height='4.5rem'
						bg='white'
						onClick={onOpen}
					>
						<Image src={icon_profile} marginBottom='.5rem' />
					</Center>

					<Center
						_hover={{
							cursor: 'pointer',
							transform: 'scale(1.1)',
						}}
						transition='all 0.2s ease'
						mb='.75rem'
						border='2px solid black'
						borderRadius='4.5rem'
						width='4.5rem'
						height='4.5rem'
						bg='white'
						onClick={() => goToShop()}
					>
						<Image src={icon_shop} marginBottom='.1rem' />
					</Center>

					<Center
						_hover={{
							cursor: 'pointer',
							transform: 'scale(1.1)',
						}}
						transition='all 0.2s ease'
						mb='.75rem'
						border='2px solid black'
						borderRadius='4.5rem'
						width='3.75rem'
						height='3.75rem'
						bg='white'
						onClick={tutorialOnOpen}
					>
						<Image src={icon_tutorial} />
					</Center>

					<Center
						_hover={{
							cursor: 'pointer',
							transform: 'scale(1.1)',
						}}
						transition='all 0.2s ease'
						mb='.75rem'
						border='2px solid black'
						borderRadius='4.5rem'
						width='3.75rem'
						height='3.75rem'
						bg='white'
						onClick={() => logout()}
					>
						<Image src={icon_logout} />
					</Center>
				</Flex>
				{narrativeIsOpen ? null : (
					<Flex
						flexDirection='column'
						justifyContent='space-between'
						alignItems='flex-end'
						h='85.5vh'
						marginTop='1.5rem'
					>
						<Image
							src={icon_membership}
							width='5.5rem'
							_hover={{
								cursor: 'pointer',
								transform: 'scale(1.1)',
							}}
							transition='all 0.2s ease'
							onClick={validIsPrime}
						/>
						<Flex
							flexDirection='row'
							marginTop='64vh'
							justifyContent='flex-end'
							alignItems='center'
						>
							<RandomRewardModal />
							<IgnoranceProgress
								fontSize='1.7rem'
								marginTop='0'
								size='6rem'
								ignorance={user.ignorance}
								position='absolute'
							/>
						</Flex>
					</Flex>
				)}
			</Flex>

			<ProfileModal isOpen={isOpen} onClose={onClose} />
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
			<PremiumPassport
				isOpen={premiumIsOpen}
				onClose={premiumOnClose}
				onToggle={premiumOnToggle}
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
							src={icon_blackMamba}
							_hover={{
								cursor: 'pointer',
								transform: 'scale(1.1)',
							}}
							transition='all 0.2s ease'
							position='absolute'
							width='5.74vw'
							left='50.5vw'
							top='57.5vh'
							onClick={() => goToPath1()}
						/>

						<Image
							src={icon_leao}
							_hover={{
								cursor: 'pointer',
								transform: 'scale(1.1)',
							}}
							transition='all 0.2s ease'
							position='absolute'
							width='4vw'
							right='7vw'
							top='50vh'
							onClick={() => goToPath3()}
						/>
					</>
				)}
				{
					isLoading ? (
						<Box 
						position='fixed' 
						top='0' 
						left='0' 
						right='0' 
						bottom='0' 
						backgroundColor={colorPalette.primaryColor}>
							<LoadingState />
						</Box>
					) : (null)
				}
			</Flex>


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
		</>
	);
};

export default MainPage;
