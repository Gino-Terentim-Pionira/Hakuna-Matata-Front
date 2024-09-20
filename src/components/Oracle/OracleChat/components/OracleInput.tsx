import React, { useState } from 'react';
import { Button, Center, Flex, Input, Tooltip, Collapse, Box, Text } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import { ICommonQuestion } from '../../../../services/OracleServices';
import { useUser } from '../../../../hooks';
import { NOT_ENOUGH_MESSAGES, ORACLE_INPUT_BLOCK } from '../../../../utils/constants/mouseOverConstants';
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

export type userMessageFunction = (content: string) => Promise<void>;

type OracleInputType = {
	commonQuestions: ICommonQuestion[];
	userMessage: userMessageFunction;
	isInputReleased?: boolean;
	isMessageLoading: boolean;
}
interface IGroupedQuestions {
	[module_name: string]: {
		[topic: string]: ICommonQuestion[];
	};
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
	const [isCommonQuestionOpen, setIsCommonQuestionOpen] = useState(false);
	const groupedQuestions = commonQuestions.reduce<IGroupedQuestions>((acc, question) => {
		const { module_name, topic } = question;

		if (!acc[module_name]) {
			acc[module_name] = {};
		}

		if (!acc[module_name][topic]) {
			acc[module_name][topic] = [];
		}

		acc[module_name][topic].push(question);
		return acc;
	}, {});

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

	const renderGroupedQuestions = () => (
		Object.keys(groupedQuestions).map((moduleName) => (
			<Box key={moduleName} marginTop='28px' marginLeft='16px' marginRight='65px'>
				<Text fontWeight='bold' fontSize='20px'>
					{moduleName}
				</Text>

				{Object.keys(groupedQuestions[moduleName]).map((topic) => (
					<Box key={topic} marginTop='12px'>
						<Text fontWeight='bold' fontSize='16px' color={colorPalette.greyText} marginTop="12px">
							{topic}
						</Text>

						{groupedQuestions[moduleName][topic].map((question) => (
							<Tooltip
								label={NOT_ENOUGH_MESSAGES}
								placement='left'
								hasArrow
								isDisabled={IS_USER_HAS_MESSAGES}
								closeOnClick={false}
							>
								<Button
									key={question._id}
									paddingX="18px"
									paddingY="2px"
									cursor={IS_USER_HAS_MESSAGES ? 'pointer' : 'help'}
									background={IS_USER_HAS_MESSAGES ? colorPalette.primaryColor : colorPalette.grayBackground}
									color={colorPalette.whiteText}
									height="auto"
									width="100%"
									minH="30px"
									fontSize="16px"
									fontWeight="medium"
									whiteSpace="normal"
									textAlign='left'
									isDisabled={isMessageLoading}
									_hover={{}}
									marginBottom="8px"
									onClick={() => {
										setIsCommonQuestionOpen(false);
										send(question.question);
									}}
								>
									{question.question}
								</Button>
							</Tooltip>
						))}
					</Box>
				))}
			</Box>
		))
	);

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
				<Collapse in={isCommonQuestionOpen} animateOpacity>
					<Box
						borderTopRadius='4px'
						background={colorPalette.whiteText}
						height='60vh'
						overflowY='auto'
						onMouseLeave={() => setIsCommonQuestionOpen(false)}
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
							renderGroupedQuestions()
						}
					</Box>
				</Collapse>
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
