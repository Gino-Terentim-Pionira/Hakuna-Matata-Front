import { Box, Center, Flex, Image } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Requisitions
import { useAuth } from '../contexts/authContext';

//styles
import './../styles/fadeEffect.css';

// Images
import registerImg from '../assets/icons/registerImg.svg';
import loginImg from '../assets/icons/loginImg.svg';
import PioniraLogo from '../assets/PioniraLogo.webp';
import GinoLogo from '../assets/GinoLogo.webp';
import HomeButton from '../components/HomeButton';
import { LOGIN, REGISTER } from '../utils/constants/mouseOverConstants';
import VideoBackground from '../components/VideoBackground';
import { getBackgroundAnimation, pathEnum } from '../utils/algorithms/backgroundAnimation';
import { NavSoundtrackIcon } from "../components/NavigationComponents/NavSoundtrackIcon";
import GenericModal from '../components/modals/GenericModal';
import { PiWarningFill } from 'react-icons/pi';
import {CONTINUE} from '../utils/constants/buttonConstants';

const Home = () => {
	const { authenticated } = useAuth();
	const history = useHistory();
	const [isAlertOpen, setIsAlertOpen] = useState(false);

	const useWindowSize = () => {
		const [size, setSize] = useState([window.innerHeight, window.innerWidth]);
		useEffect(() => {
			const handleResize = () => {
				setSize([window.innerHeight, window.innerWidth]);
			}
			window.addEventListener("resize", handleResize);
			return () => {
				window.removeEventListener("resize", handleResize);
			}
		}, []);
		return size;
	}

	const [height, width] = useWindowSize();

	useEffect(() => {
		if (authenticated) {
			history.replace('/mainPage');
		}
	}, [authenticated]);

	useEffect(() => {
		if (height < 550 || width < 600) {
			setIsAlertOpen(true);
		}
	}, []);
	return (
		<Flex
			className="fadeIn"
			h='100vh'
			position="relative"
			overflow="hidden"
		>
			<VideoBackground source={getBackgroundAnimation(pathEnum.HOME)} />
			<NavSoundtrackIcon position="absolute" left="16px" top="12px" />

			<Box w='100vw' mt='5%'>
				<Center flexDir="column">
					<Image ml="40px" filter="drop-shadow(0px 10px 1px rgba(0, 0, 0, 0.14))" width="530px" src={PioniraLogo} alt="Logo pionira" />
					<Flex
						gap="108px"
						flexDirection='row'
						align='center'
						mt="8px"
					>
						<HomeButton
							text='Entrar na Savana'
							image={loginImg}
							onClick={() => history.push('/login')}
							mouseOver={LOGIN}
						/>
						<HomeButton
							text='Criar Passaporte'
							image={registerImg}
							onClick={() => history.push('/register')}
							mouseOver={REGISTER}
						/>
					</Flex>
				</Center>
				<a target="_blank" href='https://www.ginoterentim.com'>
					<Image filter="drop-shadow(0px 4px 1px rgba(0, 0, 0, 0.14))" position="absolute" left="0" right="0" margin="auto" bottom="40px" width="125px" src={GinoLogo} alt="Logo gino" />
				</a>
			</Box>

			<GenericModal
				genericModalInfo={{
					title: "Espere um pouco!",
					titleColor: "#F0C05D",
					subtitle: "Você está acessando a Pionira por um tela pequena. Recomendamos que você ative o modo 'Para computador' nas configurações do seu browser e use a tela horizontalmente para uma experiência melhor.",
					icon: <PiWarningFill size={80} fill="#FFBC33" />,
					firstButton: CONTINUE
				}}
				isOpen={isAlertOpen}
				confirmFunction={() => {setIsAlertOpen(false)}}
				loading={false}
				error={false}
			/>
		</Flex>
	);
};

export default Home;
