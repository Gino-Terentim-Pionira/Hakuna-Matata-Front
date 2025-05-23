import React, { useState } from 'react';
import { Button, Center, Flex, Input, Box, useMediaQuery } from '@chakra-ui/react';
import colorPalette from '../../../../styles/colorPalette';
import { ICommonQuestion } from '../../../../services/OracleServices';
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import CollapseQuestions from './CollapseQuestions';
import MediaQueriesEnum from '../../../../utils/enums/mediaQueries';

export type userMessageFunction = (content: string) => Promise<void>;

type OracleInputType = {
	commonQuestions: ICommonQuestion[];
	userMessage: userMessageFunction;
	isMessageLoading: boolean;
	inicialMessage?: string;
}

export const OracleInput = ({
	commonQuestions,
	userMessage,
	isMessageLoading,
	inicialMessage
}: OracleInputType) => {
	const [inputReleasedMessage, setInputReleasedMessage] = useState(inicialMessage || '');
	const [isCommonQuestionOpen, setIsCommonQuestionOpen] = useState(false);
	const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			const inputElement = event.target as HTMLInputElement;
			inputElement.blur();
			send(inputReleasedMessage);
		}
	}

	const send = (message: string) => {
		if (!isMessageLoading) {
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
			{
				commonQuestions.length ? (
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
							onClick={isDesktop ? undefined : () => setIsCommonQuestionOpen(true)}
							onMouseEnter={isDesktop ? () => setIsCommonQuestionOpen(true) : undefined}
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
							isMessageLoading={isMessageLoading}
							sendCommonQuestion={sendCommonQuestion}
							isCommonQuestionOpen={isCommonQuestionOpen}
							closeCollapse={() => setIsCommonQuestionOpen(false)}
						/>
					</Flex>
				) : null
			}

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
							isDisabled={isMessageLoading}
							onClick={() => send(inputReleasedMessage)}
						>
							Enviar
							</Button>
					</Center>
				</Flex>
			</Center>
		</Box>
	);
};
