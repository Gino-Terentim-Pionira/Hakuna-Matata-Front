import { Box, Center, Flex, Image, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Requisitions
import { useAuth } from '../contexts/authContext';

//styles
import colorPalette from '../styles/colorPalette';
import './../styles/fadeEffect.css';

// Images
import initalScreen from '../assets/Tela_de_inicio.png';
import registerImg from '../assets/icons/registerImg.svg';
import loginImg from '../assets/icons/loginImg.svg';
import PioniraLogo from '../assets/PioniraLogo.png';
import GinoLogo from '../assets/GinoLogo.png';

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
			style={{
				backgroundImage: `url(${initalScreen})`,
				backgroundSize: 'cover',
				backgroundPositionX: 'center',
				backgroundRepeat: 'no-repeat',
			}}
		>
			<Box w='100vw' mt='5%'>
				<Center flexDir="column">
					<Image ml="40px" filter="drop-shadow(0px 10px 1px rgba(0, 0, 0, 0.14))" width="530px" src={PioniraLogo} alt="Logo pionira" />
					<Flex
						gap="108px"
						flexDirection='row'
						align='center'
						mt="8px"
					>
						<Flex
							width='320px'
							h='170px'
							padding='2rem'
							border='0.1rem  solid'
							borderColor={colorPalette.primaryColor}
							background='rgba(255, 255, 255, 0.51)'
							borderRadius='8px'
							flexDirection='column'
							justifyContent='flex-end'
							alignItems='center'
							transition='all 0.3s'
							_hover={{
								cursor: 'pointer',
								boxShadow:
									'0 10px 20px rgba(0, 0, 0, 0.25), 10px 10px 10px rgba(0, 0, 0, 0.22)',
							}}
							onClick={() => history.push('/login')}
						>
							<Flex
								flexDirection='column'
								width='100%'
								h='80%'
								justifyContent='space-around'
								alignItems='center'
							>
								<Image w='17%' src={loginImg} mb='1rem' />
								<Text
									fontSize={{ lg: '28px', md: '28px', sm: '25px' }}
									color='#926021'
								>
									Entrar na Savana
								</Text>
							</Flex>
						</Flex>
						<Flex
							width='320px'
							h='170px'
							padding='2rem'
							border='0.1rem solid'
							background='rgba(255, 255, 255, 0.51)'
							borderColor={colorPalette.primaryColor}
							borderRadius='8px'
							flexDirection='column'
							justifyContent='flex-end'
							alignItems='center'
							transition='all 0.3s'
							_hover={{
								cursor: 'pointer',
								boxShadow:
									'0 10px 20px rgba(0, 0, 0, 0.25), 10px 10px 10px rgba(0, 0, 0, 0.22)',
							}}
							onClick={() => history.push('/register')}
						>
							<Flex
								flexDirection='column'
								width='100%'
								h='80%'
								justifyContent='space-around'
								alignItems='center'
							>
								<Image w='17%' src={registerImg} mb='1rem' />
								<Text
									fontSize={{ lg: '28px', md: '28px', sm: '25px' }}
									color='#926021'
								>
									Criar Passaporte
								</Text>
							</Flex>
						</Flex>
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
