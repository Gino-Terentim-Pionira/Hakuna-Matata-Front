import React, { useState } from 'react';
import { Button, Center, Flex, Input, Tooltip, Box } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import { ICommonQuestion } from '../../../../services/OracleServices';
import { useUser } from '../../../../hooks';
import { NOT_ENOUGH_MESSAGES, ORACLE_INPUT_BLOCK } from '../../../../utils/constants/mouseOverConstants';
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import CollapseQuestions from './CollapseQuestions';

export type userMessageFunction = (content: string) => Promise<void>;

type OracleInputType = {
	commonQuestions: ICommonQuestion[];
	userMessage: userMessageFunction;
	isInputReleased?: boolean;
	isMessageLoading: boolean;
	isMessageFree?: boolean;
	inicialMessage?: string;
}

export const OracleInput = ({
	commonQuestions,
	userMessage,
	isInputReleased = false,
	isMessageLoading,
	isMessageFree = false,
	inicialMessage
}: OracleInputType) => {
	const { userData } = useUser();
	const [inputReleasedMessage, setInputReleasedMessage] = useState(inicialMessage || '');
	const IS_USER_HAS_MESSAGES = userData.oracle_messages >= 1 || isMessageFree;
	const [isCommonQuestionOpen, setIsCommonQuestionOpen] = useState(false);

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

	const sendCommonQuestion = (question: string) => {
		setIsCommonQuestionOpen(false);
		send(question);
	}

	return (
		<Box position='relative'>
			<Flex
				position='absolute'
				flexDirection='column'
				width='100%'
				bottom='100%'
			>
				<Center
					paddingY="12px"
					paddingX="16px"
					width="50px"
					height="18px"
					background={colorPalette.primaryColor}
					borderBottomRadius="0px"
					borderTopRadius='4px'
					alignItems="center"
					alignSelf='center'
					cursor="pointer"
					onMouseEnter={() => setIsCommonQuestionOpen(true)}
				>
					{
						isCommonQuestionOpen ? (
							<MdKeyboardDoubleArrowDown color='white' size='20px' />
						) : (
								<MdKeyboardDoubleArrowUp color='white' size='20px' />
							)
					}
				</Center>
				<CollapseQuestions 
					commonQuestions={commonQuestions}
					IS_USER_HAS_MESSAGES={IS_USER_HAS_MESSAGES}
					isMessageLoading={isMessageLoading}
					sendCommonQuestion={sendCommonQuestion}
					isCommonQuestionOpen={isCommonQuestionOpen}
					closeCollapse={()=>setIsCommonQuestionOpen(false)}
				/>
			</Flex>

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
				onMouseEnter={!isInputReleased ? () => setIsCommonQuestionOpen(true) : () => null}
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
		</Box>
	);
};
