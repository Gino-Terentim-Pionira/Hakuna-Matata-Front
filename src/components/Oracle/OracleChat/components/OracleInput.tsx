import React, { useState } from 'react';
import { Button, Center, Flex, Input } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import { ICommonQuestion } from '../../../../services/OracleServices';
import { useUser } from '../../../../hooks';

export type userMessageFunction = (name: string) => void;

type OracleInputType = {
	commonQuestions: ICommonQuestion[];
	userMessage: userMessageFunction;
	isInputReleased?: boolean
}
export const OracleInput = ({
	commonQuestions,
	userMessage,
	isInputReleased = false,
}: OracleInputType) => {
	const { userData } = useUser();
	const [inputReleasedMessage, setInputReleasedMessage] = useState('');
	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputElement = event.target as HTMLInputElement;
            inputElement.blur();
            sendMessage();
        }
    }

	const sendMessage = () => {
		if (userData.oracle_messages >= 1) {
			userMessage(inputReleasedMessage);
			setInputReleasedMessage("");
		}
	}

	const inputReleased = () => (
		<Flex justifyContent="space-between" alignItems="center" width="100%" height="100%">
			<Input
				color={colorPalette.textColor}
				_placeholder={{ color: colorPalette.secundaryGrey }}
				_focus={{ outline: 'none' }}
				padding="0"
				placeholder="Escreva sua mensagem..."
				border="none"
				value={inputReleasedMessage}
				onChange={(e) => setInputReleasedMessage(e.target.value)}
				onKeyDown={handleKeyPress}
			/>
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
					isDisabled={userData.oracle_messages <= 0}
					onClick={sendMessage}
				>
					Enviar
				</Button>
			</Center>
		</Flex>
	);

	const defaultInput = () => (
		<>
			<Center height="100%">
				{
					commonQuestions.map((item, index) => (
						<Flex height="100%" key={item._id}>
							<Button
								paddingX="18px"
								paddingY="2px"
								background={colorPalette.primaryColor}
								color={colorPalette.whiteText}
								height="100%"
								minH="30px"
								fontSize="16px"
								fontWeight="medium"
								isDisabled={userData.oracle_messages <= 0}
								onClick={() => {
									userMessage(item.question);
								}}
							>
								{item.question}
							</Button>
							{
								(index + 1) !== commonQuestions.length && <Flex width="2px" minH="30px" height="100%" background={colorPalette.grayBackground} borderRadius="100px" ml="12px" mr="12px" />
							}
						</Flex>
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
			overflowY="hidden"
			sx={{
				"&::-webkit-scrollbar": {
					width: "4px",
					height: "4px",
					borderRadius: "8px"
				},
				"&::-webkit-scrollbar-thumb": {
					background: "#9D9D9D",
					borderRadius: "10px"
				},
				"&::-webkit-scrollbar-thumb:hover": {
					background: "#555",
				},
				"&::-moz-scrollbar": {
					width: "4px",
					height: "4px",
					borderRadius: "8px"
				},
				"&::-moz-scrollbar-thumb": {
					background: "#9D9D9D",
					borderRadius: "10px"
				},
				"&::-moz-scrollbar-thumb:hover": {
					background: "#555",
				},
			}}
			height="55px"
			background={colorPalette.whiteText}
			borderRadius="4px"
			justifyContent='flex-start'
			alignItems="center"
		>
			{
				isInputReleased ? inputReleased() : defaultInput()
			}
		</Center>);
};
