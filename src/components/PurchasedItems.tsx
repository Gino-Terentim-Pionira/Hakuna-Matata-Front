import React, { FC, useState } from 'react';
import {
	Flex,
	Button,
	Box,
	Image,
	Text,
	Slide,
	useDisclosure,
} from '@chakra-ui/react';

// Styles
import fontTheme from '../styles/base';
import colorPalette from '../styles/colorPalette';

// Images
import bookicon from '../assets/icons/shop1.svg';
import cardicon from '../assets/icons/shop2.svg';

//API
//import api from '../services/api';

type ShopItemProps = {
	current_user_id: string;
	users_id: Array<string>;
	_id: string;
	name: string;
	value: number;
	description: string;
	type: string;
	id_link: string;
};

const ShopItem: FC<ShopItemProps> = ({
	_id,
	name,
	description,
	type,
	users_id,
	current_user_id,
	id_link
}) => {
	const { isOpen, onToggle } = useDisclosure();
	const [show, setShow] = useState(false);
	const idLink = `https://docs.google.com/uc?export=download&id=${id_link}`;

	const changeShow = () => {
		setShow(!show);
	};

	const showDescription = () => {
		setTimeout(changeShow, 100);
		onToggle();
	};

	const dowloadItem = () => {
		window.open(idLink);
	}

	const itemType: {[key:string] : string} = {
		"item1": "E-books",
		"item2": "Utilitários",
		"item3": "Especiais"
	}

	return (
		<>
			{users_id.includes(current_user_id) ? (
				<Box>
					<Flex
						_hover={{
							cursor: 'pointer',
							transform: 'scale(1.05)',
						}}
						onClick={showDescription}
						flexDirection='column'
						alignItems='center'
						key={_id}
						mb='2rem'
						mr='1rem'
						borderRadius='7.5%'
						transform={show ? `scale(1.05)` : ' '}
						transition='150ms cubic-bezier(.38, .5, .5, 1.5)'
					>
						<Box maxHeight='300px'>
							{type == 'item3' ? null : (
								type === 'item2' ? (
									<Box w='100%'>
										<Image
											maxWidth='300px'
											transition='50ms'
											bg={show ? '#00000012' : colorPalette.backgroundHighlight}											
											w='100%'
											h='18.75rem'
											mt='0.5rem'
											src={bookicon}
											alt='bookicon'
											padding='5rem 3.5rem'
											mb='1rem'
											borderRadius='7.5%'
										/>
									</Box>
								) : (
									<Box w='100%'>
										<Image
											maxWidth='300px'
											transition='50ms'
											bg={show ? '#00000012' : colorPalette.backgroundHighlight}											
											w='100%'
											h='18.75rem'
											mt='0.5rem'
											src={cardicon}
											alt='cardicon'
											padding='5rem 5rem'
											mb='1rem'
											borderRadius='7.5%'
										/>
									</Box>
								)
							)}
						</Box>
						<Flex
							flexDirection='column'
							maxWidth='300px'
							w='90%'
							alignItems='right'
							mt='1rem'
						>
							<Text
								fontFamily={fontTheme.fonts}
								fontWeight='semibold'
								mb='0.3rem'
							>
								{name}
							</Text>
							<Text
								fontFamily={fontTheme.fonts}
								fontWeight='regular'
								color={colorPalette.infoTextColor}
								mb='0.3rem'
							>
								Tipo: {itemType[type]}
							</Text>
						</Flex>
					</Flex>
					{show ? (
						<Slide
							direction='bottom'
							in={isOpen}
							style={{ zIndex: 10 }}
						>
							<Box onClick={showDescription} w='100%' h='100vh' />
							<Flex
								w='100%'
								h='16rem'
								bg={colorPalette.slideBackground}
								rounded='md'
								shadow='md'
								flexDirection='column'
								justifyContent='space-between'
								border='4px solid'
								borderColor={colorPalette.secondaryColor}
							>
								<Flex
									justifyContent='flex-end'
									paddingRight='20px'
									paddingTop='9px'
									fontSize='2rem'
									fontWeight='bold'
									color={colorPalette.closeButton}
								>
									<Text
										onClick={showDescription}
										transition='all 0.2s'
										_hover={{
											cursor: 'pointer',
											opacity: '80%',
										}}
										_active={{
											opacity: '50%',
										}}
										w='2.5rem'
									>
										X
									</Text>
								</Flex>
								<Flex
									w='92%'
									marginTop='2rem'
									position='absolute'
									marginLeft='1.5rem'
									justifyContent='space-between'
								>
									<Flex flexDirection='column' w='80%'>
										<Text
											fontSize={[
												'0.5rem',
												'1.2rem',
												'1.5rem',
											]}
											w='60%'
											fontWeight='semibold'
											textAlign='left'
											mb='8px'
										>
											{name}
										</Text>
										<Text
											fontSize={[
												'0.3rem',
												'0.8rem',
												'1rem',
											]}
											fontWeight='regular'
											textAlign='left'
											overflow="auto"
											maxH="160px"
										>
											{description}
										</Text>
									</Flex>
									<Flex
										flexDirection='column'
										alignSelf='flex-start'
									>
										<Button
											width='100%'
											height='3.5rem'
											background={colorPalette.primaryColor}
											color={colorPalette.buttonTextColor}
											fontSize='1.5rem'
											borderRadius='8px'
											onClick={() => dowloadItem()}
										>
											Download
										</Button>
									</Flex>
								</Flex>
							</Flex>
						</Slide>
					) : null}
				</Box>
			) : null}
		</>
	);
};

export default ShopItem;
