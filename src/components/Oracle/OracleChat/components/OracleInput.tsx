import React from 'react';
import { Button, Center, Flex, Input } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';

export const OracleInput = () => {
	const isInputReleased = false;
	const questionsMock = ['O que é Scrum?','O que é Agile?', 'Quem ganha, Naruto ou Sasuke?', "A dona aranha realmente subiu pela parede?"];

	const inputReleased = () => (
		<>
			<Input color={colorPalette.textColor} _placeholder={{ color: colorPalette.secundaryGrey }}
				   _focus={{ outline: 'none' }} padding="0" placeholder="Escreva sua mensagem..." border="none" />
			<Center height="100%">
				<Flex width="2px" height="100%" background={colorPalette.grayBackground} borderRadius="100px" mr="12px" />
				<Button
					paddingX="18px"
					paddingY="2px"
					background={colorPalette.primaryColor}
					color={colorPalette.whiteText}
					height="100%"
					fontSize="16px"
					fontWeight="medium"
				>
					Enviar
				</Button>
			</Center>
		</>
	);

	const defaultInput = () => (
		<>
			<Center height="100%">
				{
					questionsMock.map((item, index) => (
					<div key={item}>
						<Button
							paddingX="18px"
							paddingY="2px"
							background={colorPalette.primaryColor}
							color={colorPalette.whiteText}
							height="100%"
							fontSize="16px"
							fontWeight="medium"
						>
							{item}
						</Button>
						{
							(index + 1) !== questionsMock.length  && <Flex width="2px" height="100%" background={colorPalette.grayBackground} borderRadius="100px" ml="12px" mr="12px" />
						}
					</div>
					))
				}
			</Center>
		</>
	);

	return (
		<Center
		paddingY="12px"
		paddingX="16px"
		width="100%"
		overflowX="auto"
		height="55px"
		background={colorPalette.whiteText}
		borderRadius="4px"
		justifyContent={isInputReleased ? 'space-between' : 'flex-start'}
		alignItems="center"
	>
			{
				isInputReleased ? inputReleased() : defaultInput()
			}
	</Center>);
};