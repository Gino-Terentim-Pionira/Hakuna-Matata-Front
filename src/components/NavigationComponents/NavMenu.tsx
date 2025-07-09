import { Center, Flex, Slide, Text, Image, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import colorPalette from '../../styles/colorPalette';
import React, { useEffect, useState } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { FaArrowLeft } from "react-icons/fa";
import fontTheme from '../../styles/base';
import { IoCloseSharp } from "react-icons/io5";
import TutorialTopicBackground from '../../assets/modal/tutorial_topic.png';
import UserAvatar from '../UserAvatar';
import { useUser } from '../../hooks';
import icon_shop from '../../assets/icons/icon_shop.svg';
import inventory_icon from '../../assets/icons/inventory.png';
import icon_tutorial from '../../assets/icons/icon_tutorial.svg';
import daily from '../../assets/icons/daily_quiz.png';
import icon_logout from '../../assets/icons/icon_logout.svg';
import glasses from '../../assets/icons/double-glasses.png';
import glassesOn from '../../assets/icons/double-glasses-on.png';
import premium from '../../assets/icons/icon_membership.svg';

import {
	DAILY_QUIZ,
	IGNORANCE_GLASS,
	INVENTORY,
	LOG_OUT,
	ORACLE,
	STORE,
	TUTORIAL,
	USER_PROFILE,
} from '../../utils/constants/mouseOverConstants';
import TutorialServices from '../../services/TutorialServices';
import ProfileModal from '../modals/ProfileModal/ProfileModal';
import useShopItems from '../../hooks/useShopItems';
import { ShopModal } from '../modals/ShopModal/ShopModal';
import { useOwnedItems } from '../../hooks/useOwnedItems';
import { InventoryModal } from '../modals/InventoryModal/InventoryModal';
import { TutorialModal } from '../modals/Tutorial/TutorialModal';
import { LogOut } from '../../services/auth';
import useIgnoranceFilter from '../../hooks/useIgnoranceFilter';
import QuizAlertModal from '../Quiz/QuizAlertModal';
import { ALERT_QUIZ_MODAL } from '../../utils/constants/textConstants';
import horizon from '../../assets/horizon.webp';
import DailyQuiz from '../Quiz/DailyQuiz';
import chat from '../../assets/icons/chat.png';
import DefaultNarrativeModal from '../modals/Narrative/DefaultNarrativeModal';
import chatScript from '../../utils/scripts/Baboon/chatScript';
import { useHistory } from 'react-router-dom';
import trailEnum from '../../utils/enums/trail';
import OracleIcon from '../../assets/icons/oracle/oracle_icon.webp';
import MediaQueriesEnum from '../../utils/enums/mediaQueries';
import usePremium from '../../hooks/usePremium';
import { PremiumModal } from '../modals/PremiumModal/PremiumModal';

type MobileNavIconTypes = {
	marginTop?: string;
	showGoBack?: boolean;
	showOracle?: boolean;
	trail?: trailEnum;
	showGlasses?: boolean;
}

const MobileNavIcon = ({ marginTop, showGoBack = false, showOracle = false, trail, showGlasses = true }: MobileNavIconTypes) => {
	const tutorialServices = new TutorialServices();
	const { userData } = useUser();
	const { isIgnoranceFilterOn, handleIgnoranceFilter } = useIgnoranceFilter();
	const scriptChat = () => chatScript(userData.ignorance);
	const {
		getNewCertificateItems,
		getNewShopItems,
		shopItemsData,
		certificatesItemData,
		oraclePackagesItemData
	} = useShopItems();

	const {
		ownedCertificateItemData,
		getNewOwnedCertificateItems,
		ownedItemsData,
		getNewOwnedItems
	} = useOwnedItems();

	const { premiumTiers, getNewPremiumTiers } = usePremium();

	const [isOpen, setIsOpen] = useState(false);
	const [onCloseTutorial, setOnCloseTutorial] = useState<VoidFunction>();
	const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
	const [isShopLoading, setIsShopLoading] = useState(true);
	const [isInventoryLoading, setIsInventoryLoading] = useState(true);
	const [isPremiumLoading, setIsPremiumLoading] = useState(true);
	const [isDailyModalOpen, setDailyIsModalOpen] = useState(false);
	const [isDifferentDay, setIsDifferentDay] = useState(false);
	const history = useHistory();
	const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP)

	const {
		isOpen: narrativeIsOpen,
		onOpen: narrativeOnOpen,
		onToggle: narrativeOnToggle,
	} = useDisclosure();

	const {
		isOpen: tutorialTopicIsOpen,
		onClose: tutorialTopicOnClose,
		onOpen: tutorialTopicOnOpen,
	} = useDisclosure();

	const {
		isOpen: profileIsOpen,
		onClose: profileOnClose,
		onOpen: profileOnOpen
	} = useDisclosure();

	const {
		isOpen: shopIsOpen,
		onClose: shopOnClose,
		onOpen: shopOnOpen
	} = useDisclosure();

	const {
		isOpen: inventoryIsOpen,
		onClose: inventoryOnClose,
		onOpen: inventoryOnOpen
	} = useDisclosure();

	const {
		isOpen: premiumIsOpen,
		onClose: premiumOnClose,
		onOpen: premiumOnOpen
	} = useDisclosure();

	const { isOpen: quizIsOpen,
		onClose: quizOnClose,
		onOpen: quizOnOpen,
		onToggle: quizToggle
	} = useDisclosure();

	const handleFirstView = (topic_name: string, action: VoidFunction) => {
		if (tutorialServices.checkFirstVisualization(topic_name)) {
			setOnCloseTutorial(() => action);
			setSelectedTopic(topic_name);
			tutorialTopicOnOpen();
		} else {
			action();
		}
	}

	const handleProfileOpen = () => {
		setIsOpen(false);
		handleFirstView('Perfil de usuário', profileOnOpen);
	}

	const openShop = async () => {
		shopOnOpen();
		await getNewCertificateItems();
		!shopItemsData.length && await getNewShopItems();
		setIsShopLoading(false);
	}

	const handleShop = () => {
		setIsOpen(false);
		handleFirstView('Loja', openShop);
	}

	const openInventory = async () => {
		inventoryOnOpen();
		!ownedCertificateItemData.length && await getNewOwnedCertificateItems();
		!ownedItemsData.length && await getNewOwnedItems();
		setIsInventoryLoading(false);
	}

	const openPremium = async () => {
		setIsOpen(false);
		premiumOnOpen();
		!premiumTiers.length && await getNewPremiumTiers(userData.email);
		setIsPremiumLoading(false);
	}

	const handleInventory = () => {
		setIsOpen(false);
		handleFirstView('Inventário', openInventory);
	}

	const handleTutorialOpen = () => {
		setIsOpen(false);
		tutorialTopicOnOpen()
	}

	const handleTutorialClose = () => {
		tutorialTopicOnClose();
		if (onCloseTutorial) onCloseTutorial();
		setOnCloseTutorial(undefined);
	}

	const handleIgnoranceGlasses = () => {
		setIsOpen(false);
		handleFirstView('Óculos da ignorância', handleIgnoranceFilter);
	}

	const handleDailyQuiz = () => {
		setIsOpen(false);
		handleFirstView('Desafio diário', () => setDailyIsModalOpen(true));
	}

	const handleDaily = () => {
		setDailyIsModalOpen(false)
		quizOnOpen();
	}

	const handleChat = () => {
		narrativeOnOpen();
	}

	const handleMapNavigation = () => {
		const path = '/mainPage';
		history.push(path)
	}

	const handleOracle = () => {
		setIsOpen(false);
		handleFirstView('Oráculo', () => history.push({
			pathname: '/oracle',
			state: {
				trail
			}
		}));
	}

	const renderIconImage = (icon: string) => (
		<Image src={icon} width="45px" height="45px" />
	)

	const oracleItem = showOracle ? {
		label: ORACLE,
		icon: renderIconImage(OracleIcon),
		onClick: handleOracle
	} : {}

	const glassesItem = showGlasses ? {
		label: IGNORANCE_GLASS,
		icon: renderIconImage(isIgnoranceFilterOn ? glassesOn : glasses),
		onClick: handleIgnoranceGlasses
	} : {}

	const itemsWithoutDailyQuiz = [
		oracleItem,
		{
			label: USER_PROFILE,
			icon: <UserAvatar customAvatar={userData.custom_avatar} avatarStyle="Transparent" width="45px" height="45px" marginBottom="4px" />,
			onClick: handleProfileOpen
		}, {
			label: STORE,
			icon: renderIconImage(icon_shop),
			onClick: handleShop
		}, {
			label: INVENTORY,
			icon: renderIconImage(inventory_icon),
			onClick: handleInventory
		}, {
			label: TUTORIAL,
			icon: renderIconImage(icon_tutorial),
			onClick: handleTutorialOpen
		},
		glassesItem,
		{
			label: LOG_OUT,
			icon: renderIconImage(icon_logout),
			onClick: LogOut
		}]

	const items = [
		oracleItem,
		{
			label: USER_PROFILE,
			icon: <UserAvatar customAvatar={userData.custom_avatar} avatarStyle="Transparent" width="45px" height="45px" marginBottom="4px" />,
			onClick: handleProfileOpen
		}, {
			label: STORE,
			icon: renderIconImage(icon_shop),
			onClick: handleShop
		}, {
			label: INVENTORY,
			icon: renderIconImage(inventory_icon),
			onClick: handleInventory
		}, {
			label: TUTORIAL,
			icon: renderIconImage(icon_tutorial),
			onClick: handleTutorialOpen
		},
		glassesItem,
		{
			label: DAILY_QUIZ,
			icon: renderIconImage(daily),
			onClick: handleDailyQuiz
		}, {
			label: LOG_OUT,
			icon: renderIconImage(icon_logout),
			onClick: LogOut
		}]

	useEffect(() => {
		const verifyDailyQuiz = () => {
			const item = localStorage.getItem("@pionira/dailyQuiz");
			if (item) {
				const currentDate = new Date();
				const storedDate = new Date(item);
				setIsDifferentDay(currentDate.toDateString() !== storedDate.toDateString());
			} else {
				setIsDifferentDay(true);
			}
		}
		verifyDailyQuiz();
	}, []);
	const renderItem = () =>
		(isDifferentDay ? items : itemsWithoutDailyQuiz)
        .filter(item => item.label)
        .map((item, idx) => (
				<Flex
					key={`${item.label}-${idx}`}
					width='100%'
					height='80px'
					marginBottom='16px'
					border={`2px solid ${colorPalette.textColor}`}
					justifyContent='space-between'
					alignItems='center'
					padding='12px 16px'
					borderRadius='8px'
					backgroundColor='#FBEFC9'
					onClick={item.onClick}
					cursor='pointer'
				>
					<Text>{item.label}</Text>

					{item.icon}
				</Flex>
		));

	return (
		<>
			<Center
				position='fixed'
				display='flex'
				transition='all 0.2s ease'
				top={marginTop || '24px'}
				left='16px'
				border={`3px solid ${colorPalette.blackBorder}`}
				borderRadius='999px'
				width='53px'
				height='53px'
				bg='white'
				onClick={() => setIsOpen(!isOpen)}
				zIndex={9}
				_hover={{
					cursor: 'pointer',
					transform: 'scale(1.1)',
				}}
			>
				<GiHamburgerMenu size={32} />
			</Center>

			{isIgnoranceFilterOn &&
				<Center
					position='fixed'
					display='flex'
					transition='all 0.2s ease'
					top={marginTop || '83px'}
					left='16px'
					border={`3px solid ${colorPalette.blackBorder}`}
					borderRadius='999px'
					width='53px'
					height='53px'
					bg='white'
					onClick={handleChat}
					zIndex={9}
					_hover={{
						cursor: 'pointer',
						transform: 'scale(1.1)',
					}}
				>
					<Image
						alt="chat_image"
						src={chat}
						width='32px'
						height='32px'
					/>
				</Center>
			}

			{showGoBack &&
				<Center
					position='fixed'
					display='flex'
					transition='all 0.2s ease'
					top={marginTop || '83px'}
					left='16px'
					border={`3px solid ${colorPalette.blackBorder}`}
					borderRadius='999px'
					width='53px'
					height='53px'
					bg='white'
					onClick={handleMapNavigation}
					zIndex={9}
					_hover={{
						cursor: 'pointer',
						transform: 'scale(1.1)',
					}}
				>
					<FaArrowLeft color={colorPalette.closeButton} size={32} />
				</Center>
			}

			<Slide
				direction='left' in={isOpen}
				style={{ zIndex: 1900, display: 'flex' }}
			>
				<Flex
					w={isDesktop ? '30%' : '100%'}
					h='100dvh'
					flexDirection='column'
					justifyContent='flex-start'
					alignItems='center'
					overflowY='auto'
					bgImage={`url(${TutorialTopicBackground})`}
					backgroundPosition="center"
					backgroundRepeat="no-repeat"
					backgroundSize='76vh'
					fontFamily={fontTheme.fonts}
					paddingX='16px'
					paddingTop='16px'
					paddingBottom='16px'
					sx={{
						'&::-webkit-scrollbar': {
							width: '4px',
							height: '4px',
							borderRadius: '8px',
						},
						'&::-webkit-scrollbar-thumb': {
							background: '#9D9D9D',
							borderRadius: '10px',
						},
						'&::-webkit-scrollbar-thumb:hover': {
							background: '#555',
						},
						'&::-moz-scrollbar': {
							width: '4px',
							height: '4px',
							borderRadius: '8px',
						},
						'&::-moz-scrollbar-thumb': {
							background: '#9D9D9D',
							borderRadius: '10px',
						},
						'&::-moz-scrollbar-thumb:hover': {
							background: '#555',
						},
					}}
				>
					<Flex
						alignSelf='flex-end'
						onClick={() => setIsOpen(!isOpen)}
						transition='all 0.2s'
						_hover={{
							cursor: 'pointer',
							opacity: '80%',
						}}
						w='fit-content'
						color={colorPalette.closeButton}
						fontWeight='bold'
						fontSize='32px'
						marginBottom='24px'
					>
						<IoCloseSharp size={40} />
					</Flex>

					<Flex
						width='100%'
						height='80px'
						marginBottom='64px'
						border={`2px solid ${colorPalette.textColor}`}
						color={colorPalette.backgroundColor}
						justifyContent='space-between'
						alignItems='center'
						padding='12px 16px'
						borderRadius='8px'
						backgroundColor={colorPalette.primaryColor}
						onClick={openPremium}
						cursor='pointer'
					>
						<Text>{userData.isSubscribed ? 'Gerencie sua assinatura' : 'Contribua com nosso propósito!'}</Text>

						<Image src={premium} width="45px" height="45px" />
					</Flex>

					{userData?.custom_avatar && renderItem()}
				</Flex>
			</Slide>

			<ProfileModal isOpen={profileIsOpen} onClose={profileOnClose} />

			<ShopModal
				isOpen={shopIsOpen}
				onClose={shopOnClose}
				oraclePackages={oraclePackagesItemData}
				shopItems={shopItemsData}
				certificates={certificatesItemData}
				showQuickFilters
				isLoading={isShopLoading}
			/>

			<InventoryModal
				isOpen={inventoryIsOpen}
				onClose={inventoryOnClose}
				shopItems={ownedItemsData}
				certificates={ownedCertificateItemData}
				isLoading={isInventoryLoading}
			/>

			<PremiumModal 
				isOpen={premiumIsOpen}
				onClose={premiumOnClose}
				premiumTiers={premiumTiers}
				isLoading={isPremiumLoading}
			/>

			<TutorialModal isOpen={tutorialTopicIsOpen} onClose={handleTutorialClose} selectedTopic={selectedTopic} />

			<QuizAlertModal
				modalIsOpen={isDailyModalOpen}
				modalOnClose={() => setDailyIsModalOpen(false)}
				title={ALERT_QUIZ_MODAL}
				image={horizon}
				confirmFunction={handleDaily}
			/>
			<DailyQuiz
				closeModal={quizOnClose}
				onToggle={quizToggle}
				openModal={quizIsOpen}
			/>

			<DefaultNarrativeModal
				isOpen={narrativeIsOpen}
				onToggle={narrativeOnToggle}
				script={scriptChat()}
			/>
		</>
	);
}

export { MobileNavIcon }
