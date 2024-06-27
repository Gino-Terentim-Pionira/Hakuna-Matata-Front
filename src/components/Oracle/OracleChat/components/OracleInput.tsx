import React, { useState } from 'react';
import { Button, Center, Flex, Input, Tooltip } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import { ICommonQuestion } from '../../../../services/OracleServices';
import { useUser } from '../../../../hooks';
import { NOT_ENOUGH_MESSAGES, ORACLE_INPUT_BLOCK } from '../../../../utils/constants/mouseOverConstants';

export type userMessageFunction = (content: string) => Promise<void>;

type OracleInputType = {
	commonQuestions: ICommonQuestion[];
	userMessage: userMessageFunction;
	isInputReleased?: boolean;
	isMessageLoading: boolean;
}
export const OracleInput = ({
	commonQuestions,
	userMessage,
	isInputReleased = false,
	isMessageLoading
}: OracleInputType) => {
	const { userData } = useUser();
	const [inputReleasedMessage, setInputReleasedMessage] = useState('');
	const IS_USER_HAS_MESSAGES = userData.oracle_messages >= 1;
	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			const inputElement = event.target as HTMLInputElement;
			inputElement.blur();
			send(inputReleasedMessage);
		}
	}

	const send = (message: string) => {
		if (IS_USER_HAS_MESSAGES && !isMessageLoading) {
			userMessage(message);
			setInputReleasedMessage("");
		}
	}

	return (
		<>
			<Center
				paddingY="12px"
				paddingX="16px"
				width="100%"
				height="55px"
				background={colorPalette.whiteText}
				borderTopRadius="4px"
				borderBottomRadius='0'
				justifyContent='flex-start'
				alignItems="center"
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
			>
				{
					commonQuestions.map((item, index) => (
						<Flex height="100%" key={item._id}>
							<Tooltip
								label={NOT_ENOUGH_MESSAGES}
								placement='left'
								hasArrow
								isDisabled={IS_USER_HAS_MESSAGES}
								closeOnClick={false}
							>
								<Button
									paddingX="18px"
									paddingY="2px"
									cursor={IS_USER_HAS_MESSAGES ? 'pointer' : 'help'}
									background={IS_USER_HAS_MESSAGES ? colorPalette.primaryColor : colorPalette.grayBackground}
									color={colorPalette.whiteText}
									height="100%"
									minH="30px"
									fontSize="16px"
									fontWeight="medium"
									isDisabled={isMessageLoading}
									onClick={() => send(item.question)}
								>
									{item.question}
								</Button>
							</Tooltip>
							{
								(index + 1) !== commonQuestions.length && <Flex width="2px" minH="30px" height="100%" background={colorPalette.grayBackground} borderRadius="100px" ml="12px" mr="12px" />
							}
						</Flex>
					))
				}
			</Center>
			<Center
				paddingY="12px"
				paddingX="16px"
				width="100%"
				height="55px"
				background={colorPalette.whiteText}
				borderBottomRadius="4px"
				borderTopRadius='0'
				justifyContent='flex-start'
				alignItems="center"
			>
				<Tooltip 
					label={IS_USER_HAS_MESSAGES ? ORACLE_INPUT_BLOCK : NOT_ENOUGH_MESSAGES} 
					isDisabled={isInputReleased && IS_USER_HAS_MESSAGES} 
					placement="left" 
					hasArrow={true}
				>

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
							disabled={!isInputReleased || !IS_USER_HAS_MESSAGES}
						/>
						<Center height="100%">
							<Flex width="2px" height="100%" background={colorPalette.grayBackground} borderRadius="100px" mr="12px" />
							<Button
								paddingX="18px"
								paddingY="2px"
								cursor={IS_USER_HAS_MESSAGES ? 'pointer' : 'help'}
								background={IS_USER_HAS_MESSAGES && isInputReleased ? colorPalette.primaryColor : colorPalette.grayBackground}
								color={colorPalette.whiteText}
								height="100%"
								fontSize="16px"
								fontWeight="medium"
								isDisabled={isMessageLoading || !isInputReleased}
								onClick={() => send(inputReleasedMessage)}
							>
								Enviar
							</Button>
						</Center>
					</Flex>
				</Tooltip>
			</Center>
		</>
	);
};
