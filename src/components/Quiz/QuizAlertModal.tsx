import { Flex, Image, Text, Modal, ModalOverlay, ModalContent, Box, ModalHeader, ModalCloseButton, ModalBody, Button } from '@chakra-ui/react';
import React, { FC } from 'react';
import colorPalette from '../../styles/colorPalette';
import fontTheme from '../../styles/base';

type QuizAlertProps = {
    modalIsOpen: boolean;
    modalOnClose: VoidFunction;
    title: string;
    image: string;
    confirmFunction: VoidFunction
}

const QuizAlertModal: FC<QuizAlertProps> = ({ 
    modalIsOpen,
    modalOnClose,
    title,
    image,
    confirmFunction
 }) => {
    return (
		<Modal isOpen={modalIsOpen} onClose={modalOnClose} size='4xl'>
			<ModalOverlay />
			<ModalContent
				maxHeight={{ base: 'none', md: 'auto' }}
				height={{ base: '100%', md: '530px' }}
				margin={{ base: '0', md: '3.75rem' }}
				fontFamily={fontTheme.fonts}
			>
				<Box
					w={{ base: '100vw', md: '20%' }}
					bg={colorPalette.primaryColor}
					h={{ base: '200px', md: '100%' }}
					position='absolute'
					zIndex='-1'
					left='0'
					top='0'
					borderTopStartRadius='5px'
					clipPath={{
						base: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
						md: 'polygon(0% 0%, 70% 0%, 0% 100%)',
					}}
				/>
				<ModalHeader d='flex' justifyContent='center' mt='1.4rem'>
					<Text
						display={{ base: 'none', md: 'block' }}
						ml='2.3rem'
						w='666px'
						fontSize='32px'
						textAlign='center'
						fontWeight='normal'
						fontFamily={fontTheme.fonts}
						color={colorPalette.textColor}
					>
						{title}
					</Text>
					<ModalCloseButton
						color={colorPalette.closeButton}
						size='lg'
					/>
				</ModalHeader>

				<ModalBody
					d='flex'
					mt='-1rem'
					flexDirection='column'
					justifyContent={{ base: 'space-between', md: 'auto' }}
					padding={{ base: '8px 16px', md: '16px' }}
					alignItems='center'
				>
					<div>
						<Image
							src={image}
							w='535px'
							h={{ base: '70%', md: '280px' }}
							objectFit={{ base: 'fill', md: 'cover' }}
							mt={{ base: '10%', md: 'auto' }}
							marginBottom='16px'
							borderRadius='18px'
						/>
						<Text
							display={{ base: 'block', md: 'none' }}
							margin='auto'
							textAlign='center'
							color={colorPalette.textColor}
							fontSize='24px'
						>
							Bote em dia sua sabedoria completando esse desafio
							diário
						</Text>
					</div>

					<Flex
						w={{ base: '100%', md: '65%' }}
						marginBottom={{ base: '32px', md: '16px' }}
						justifyContent={{ base: 'center', md: 'space-between' }}
						columnGap={{ base: '42px', md: 'none' }}
					>
						<Button
							bgColor={colorPalette.confirmButton}
							width={{ base: 'auto', md: '45%' }}
							height='4rem'
							minHeight={{ base: '50px' }}
							fontSize={{ base: "20px", md: '1.2rem' }}
							fontWeight='normal'
							whiteSpace="normal"
							_hover={{
								transform: 'scale(1.1)',
							}}
							color={colorPalette.textColor}
							onClick={confirmFunction}
						>
							Vamos nessa!
						</Button>
						<Button
							bgColor={colorPalette.alertText}
							width={{ base: 'auto', md: '45%' }}
							height='4rem'
							minHeight={{ base: '50px' }}
							fontSize={{ base: "20px", md: '1.2rem' }}
							fontWeight='normal'
							whiteSpace="normal"
							_hover={{
								transform: 'scale(1.1)',
							}}
							onClick={modalOnClose}
							color={colorPalette.textColor}
						>
							Ainda não!
						</Button>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}

export default QuizAlertModal;
