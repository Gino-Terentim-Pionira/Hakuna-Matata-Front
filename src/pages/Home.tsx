import { Box, Center, Flex, Image } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Requisitions
import { useAuth } from '../contexts/authContext';

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

const Home = () => {
	const { authenticated } = useAuth();
	const history = useHistory();

	useEffect(() => {
		if (authenticated) {
			history.replace('/mainPage');
		}
	}, [authenticated]);

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
					<Image
						ml={{ base: '0px', md: '40px' }}
						mt={{ base: '64px', md: '0px' }}
						filter="drop-shadow(0px 10px 1px rgba(0, 0, 0, 0.14))"
						width={{ base: '80%', md: '530px' }}
						maxW={{ base: '600px', md: 'none' }}
						src={PioniraLogo}
						alt="Logo pionira"
					/>
					<Flex
						gap={{ base: "24px", md: "72px" }}
						flexDirection={{ base: 'column', md: 'row' }}
						align='center'
						mt="16px"
						w={{ base: "100%", md: "auto" }}
						px={{ base: "32px", md: "0" }}
						m={{ base: "8px", md: "0" }}
					>
						<HomeButton
							text='Entrar na Savana'
							image={loginImg}
							onClick={() => history.push('/login')}
							mouseOver={LOGIN}
							subText="(Acessar conta)"
						/>
						<HomeButton
							text='Criar Passaporte'
							image={registerImg}
							onClick={() => history.push('/register')}
							mouseOver={REGISTER}
							subText="(Cadastrar conta)"
						/>
					</Flex>
				</Center>
				<a target="_blank" href='https://novo.ginoterentim.com/'>
					<Image
						filter="drop-shadow(0px 4px 1px rgba(0, 0, 0, 0.14))"
						position="absolute"
						left="0"
						right="0"
						margin="auto"
						bottom="40px"
						width="125px"
						src={GinoLogo}
						alt="Logo gino"
					/>
				</a>
			</Box>
		</Flex>
	);
};

export default Home;
