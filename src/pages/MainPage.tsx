import React, { SetStateAction, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
	useDisclosure,
	Flex,
	Button,
} from '@chakra-ui/react';
import { useUser } from '../hooks';

// Components
import WelcomeVideoModal from '../components/modals/WelcomeVideoModal';
import NarrativeModal from '../components/modals/Narrative/NarrativeModal';
import AlertModal from '../components/modals/AlertModal';
import DailyReward from '../components/modals/DailyRewardModal';
import SubscribedModal from '../components/modals/SubscribedModal';

// Requisitions
import api from '../services/api';
import mainPageScript from '../utils/scripts/Baboon/MainPageScript';

//Utils
import ignoranceFilterFunction from '../utils/ignorance/ignoranceFilter';
import colorPalette from '../styles/colorPalette';

// Images
import icon_cheeta from '../assets/icons/icon_cheeta.svg';
import icon_block from '../assets/icons/icon_block.svg';
import ignorance100 from '../assets/ignorance/mainPage/ignorance_100.webp';
import ignorance75 from '../assets/ignorance/mainPage/ignorance_75.webp';
import ignorance50 from '../assets/ignorance/mainPage/ignorance_50.webp';
import ignorance25 from '../assets/ignorance/mainPage/ignorance_25.webp';
import { errorCases } from '../utils/errors/errorsCases';
import IgnorancePremiumIcons from '../components/IgnoranceCoinsDisplay/IgnorancePremiumIcons';
import NavActions from '../components/NavigationComponents/NavActions';
import LoadingOverlay from '../components/LoadingOverlay';
import BlockedModal from '../components/modals/BlockedModal';
import IgnoranceFilter from '../components/IgnoranceFilter';
import TrailIcon from '../components/TrailIcon';
import { CHEETAH_TRAIL, BLOCKED_TRAIL } from '../utils/constants/mouseOverConstants';
import { share } from '../services/linkedin';
import { verifySocialShare } from '../services/socialShare';
import Cheetah from '../assets/icons/cheetahblink.svg';
import GenericModal from '../components/modals/GenericModal';
import VideoBackground from '../components/VideoBackground';
import { LogOut } from '../services/auth';
import { getBackgroundAnimation, pathEnum } from '../utils/algorithms/backgroundAnimation';
import { motion } from 'framer-motion';
import { trailAccessEnum, getTrailAccess } from '../utils/localStorageUtils';
import { useSoundtrack } from "../hooks/useSoundtrack";

interface IScript {
	name: string;
	image: string;
	texts: string[];
}

const MainPage = () => {
	const history = useHistory();
	const {
		isOpen: welcomeVideoIsOpen,
		onClose: welcomeVideoOnClose,
		onOpen: welcomeVideoOnOpen,
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
	const { changeSoundtrack } = useSoundtrack();
	const [script, setScript] = useState<IScript[]>([]);
	const [onAlert, setOnAlert] = useState(false);
	const [ignoranceImage, setIgnoranceImage] = useState('');
	const [isSubscribedModal, setIsSubscribedModal] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isAnimationLoading, setIsAnimationLoading] = useState<boolean>(true);
	const [openBlockedModal, setOpenBlockedModal] = useState<boolean>(false);
	const [alert, setAlert] = useState<{
		title: string,
		body: string,
		closeFunction: VoidFunction,
		buttonFunction: VoidFunction,
		buttonText: string
	}>({
		title: 'Ops!',
		body: errorCases.SERVER_ERROR,
		closeFunction: () => window.location.reload(),
		buttonFunction: () => window.location.reload(),
		buttonText: 'Recarregar'
	});
	const [rewardOpen, setRewardOpen] = useState(false);
	const [rewardLoading, setRewardLoading] = useState(false);

	const ignoranceArray = [
		ignorance100,
		ignorance75,
		ignorance50,
		ignorance25,
	];

	const handleErrorAlert = () => {
		setAlert({
			title: 'Ops!',
			body: errorCases.SERVER_ERROR,
			closeFunction: () => window.location.reload(),
			buttonFunction: () => window.location.reload(),
			buttonText: 'Recarregar'
		});

		setOnAlert(true);
	}

	const handleLogOutAlert = () => {
		setAlert({
			title: 'Logout',
			body: 'Tem certeza que você deseja sair da Savana?',
			closeFunction: () => setOnAlert(false),
			buttonFunction: () => {
				LogOut();
			},
			buttonText: 'Sair'
		});

		setOnAlert(true);
	}

	//logic for checking and switching if first time is set to true
	const tutorialFirstOnClose = () => {
		try {
			if (userData.isFirstTimeAppLaunching) {
				const newScript = mainPageScript(userData.userName);
				setScript(newScript);
				narrativeOnOpen();
			}

			welcomeVideoOnClose();
		} catch (error) {
			handleErrorAlert();
		}
	};

	const checkCanCollectDaily = async (value: number, coins: number) => {
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
				await api.patch(`/user/lastCollected/${_userId}`, {
					consecutiveDays: 0,
					lastCollected: currentDate.getTime(),
					coins: coins,
				});
				await getNewUserInfo();
			} catch (error) {
				handleErrorAlert();
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

	const socialShareCoins = async () => {
		setRewardLoading(true);
		await api.patch(`/user/coins/${userData._id}`, {
			coins: userData.coins + 3,
		});
		getNewUserInfo();
		setRewardOpen(false);
		setRewardLoading(false);
	}

	const rewardModalInfo = () => {
		return {
			title: 'Parabéns!',
			titleColor: colorPalette.inactiveButton,
			subtitle: `Publicação foi feita com sucesso!`,
			icon: Cheetah,
			coins: 3,
		}
	}

	const verifySocialLoginRedirect = async () => {
		const queryParameters = new URLSearchParams(window.location.search);
		const code = queryParameters.get("code");
		if (code) {
			try {
				await share(code);
				const validation = await verifySocialShare();
				if (validation) {
					setRewardOpen(true);
				} else {
					setAlert({
						title: 'Linkedin',
						body: 'Publicação feita com sucesso! Recompensas somente no primeiro compartilhamento de cada plataforma',
						closeFunction: () => { setOnAlert(false) },
						buttonFunction: () => { setOnAlert(false) },
						buttonText: 'Voltar'
					});
					setOnAlert(true);
				}
			} catch (error) {
				setAlert({
					...alert,
					body: 'Ocorreu um erro ao fazer a publicação. Tente novamente mais tarde'
				});
				setOnAlert(true);
			}
			history.replace(history.location.pathname);
		}
	}

	/*
		const goToPath1 = () => {
			history.push('/finalTrail');
		};
	*/

	const goToPath2 = () => {
		const path = '/trilha-cheetah';
		history.push(path);
	};

	/*
		const goToPath3 = () => {
			history.push('/trilha-leao');
		};
	*/

	const logout = () => {
		handleLogOutAlert();
	};

	const checkFirstTrailAcess = (trail: trailAccessEnum) => {
		const trailFirstAcess = getTrailAccess(trail);

		return !trailFirstAcess;
	}

	useEffect(() => {
		changeSoundtrack("/mainPage");
		const getUserRequisition = async () => {
			if (userData._id) {
				setIgnoranceFilter(userData.ignorance, ignoranceArray);
				setTimeout(() => {
					setIsLoading(false);
				}, 500)
				return
			};
			try {
				setIsLoading(true);
				const _userId: SetStateAction<string> | null = sessionStorage.getItem(
					'@pionira/userId',
				);
				const res = await api.get(`/user/${_userId}`);
				setUserData(res.data);

				setIgnoranceFilter(res.data.ignorance, ignoranceArray);

				if (res.data.isFirstTimeAppLaunching) {
					welcomeVideoOnOpen();
				}

				await checkCanCollectDaily(res.data.lastCollected, res.data.coins);
				await verifySocialLoginRedirect();

			} catch (error) {
				handleErrorAlert();
			}
		};

		getUserRequisition().finally(() => {
			setTimeout(() => {
				setIsLoading(false);
			}, 1000)
		})
	}, []);

	return (
		<>
			<VideoBackground handleLoading={() => setIsAnimationLoading(false)} source={getBackgroundAnimation(pathEnum.MAINPAGE)} />
			{
				(isLoading || isAnimationLoading) ? (
					<LoadingOverlay />
				) : (
						<>
							<IgnoranceFilter
								ignoranceImage={ignoranceImage}
							/>
							<Flex
								width='92.5%'
								justifyContent='space-between'
								alignItems='flex-start'
								margin='auto'
							>
								<NavActions logout={logout} dontShowMap />
								{narrativeIsOpen ? null : (
									<IgnorancePremiumIcons ignorance={userData.ignorance} dontShowOracle />
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
							<WelcomeVideoModal
								isOpen={welcomeVideoIsOpen}
								onClose={tutorialFirstOnClose}
							/>

							<Flex margin='2vw' justifyContent='space-between'>
								{narrativeIsOpen ? null : (
									<>
										<Flex
											position='absolute'
											left='18vw'
											top='49.5vh'
										>
											<motion.div
												animate={checkFirstTrailAcess(trailAccessEnum.CHEETAH) ? { scale: [0.8, 1, 0.8] } : false}
												transition={{ loop: Infinity }}
											>
												<TrailIcon
													image={icon_cheeta}
													onClick={goToPath2}
													mouseOver={CHEETAH_TRAIL}
												/>
											</motion.div>
										</Flex>

										<Flex
											position='absolute'
											left='43.5vw'
											top='57.5vh'
										>
											<TrailIcon
												image={icon_block}
												onClick={() => setOpenBlockedModal(true)}
												mouseOver={BLOCKED_TRAIL}
											/>
										</Flex>

										<Flex
											position='absolute'
											right='2vw'
											top='50vh'
										>
											<TrailIcon
												image={icon_block}
												onClick={() => setOpenBlockedModal(true)}
												mouseOver={BLOCKED_TRAIL}
											/>
										</Flex>

									</>
								)}
							</Flex>
						</>
					)
			}


			<AlertModal
				isOpen={onAlert}
				onClose={alert.closeFunction}
				alertTitle={alert.title}
				alertBody={alert.body}
				buttonBody={
					<Button
						color='white'
						bg={colorPalette.primaryColor}
						onClick={alert.buttonFunction}
					>
						{alert.buttonText}
					</Button>
				}
			/>

			<GenericModal
				isOpen={rewardOpen}
				genericModalInfo={rewardModalInfo()}
				loading={rewardLoading}
				error={false}
				confirmFunction={socialShareCoins}
			/>

			<SubscribedModal
				isOpen={isSubscribedModal}
				onFunction={() => setIsSubscribedModal(false)}
			/>

			<BlockedModal
				isOpen={openBlockedModal}
				onClose={() => { setOpenBlockedModal(false) }}
				subtitle="Esse horizonte ainda não pode ser explorado, por enquanto..."
			/>
		</>
	);
};

export default MainPage;
