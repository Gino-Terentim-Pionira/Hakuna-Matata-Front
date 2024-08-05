import { Box, Center, Flex, Image } from '@chakra-ui/react';
import React, { useEffect } from 'react';
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
			<VideoBackground isLoading={()=>null} source={getBackgroundAnimation(pathEnum.HOME)} />
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
		</Flex>
	);
};

export default Home;
