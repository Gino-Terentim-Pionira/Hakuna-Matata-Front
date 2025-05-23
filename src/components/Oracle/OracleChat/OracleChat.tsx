import React, { useRef } from 'react';
import { Flex, Box, useMediaQuery } from '@chakra-ui/react';
import { OracleInput, userMessageFunction } from './components/OracleInput';
import { ICommonQuestion, IMessages } from '../../../services/OracleServices';
import OracleMessage from './components/OracleMessage';
import MediaQueriesEnum from '../../../utils/enums/mediaQueries';

type OracleChatType = {
	commonQuestions: ICommonQuestion[];
	messages: IMessages[];
	userMessage: userMessageFunction;
	isMessageLoading: boolean;
	inicialMessage?: string;
}

export const OracleChat = ({
	commonQuestions,
	messages,
	userMessage,
	isMessageLoading,
	inicialMessage
}: OracleChatType) => {
	const lastMessageRef = useRef<HTMLDivElement>(null);
	const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);
	const sendUserMessage = async (content: string) => {
		await userMessage(content);
		if (lastMessageRef.current) {
			lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}

	return (
		<Flex
			flexDir="column"
			justifyContent="flex-end"
			paddingX={isDesktop ? "24px" : "16px"}
			paddingBottom={isDesktop ? "20px" : "16px"}
			width={isDesktop ? "700px" : "100%"}
			overflowX="auto"
			overflowY="auto"
			height={isDesktop ? "90%" : "95%"}
			maxHeight="880px"
			background="rgba(240, 240, 240, 0.95)"
			borderRadius="8px"
			boxShadow="0 4px 4px rgba(0, 0, 0, 0.25)"
		>
			<Box
				display="flex"
				flexDir="column-reverse"
				width="100%"
				height='90%'
				maxHeight="783px"
				background="transparent"
				paddingBottom="40px"
				paddingTop="10px"
				rowGap="32px"
				overflowY="auto"
				transition="height 1s ease"
				sx={{
					"&::-webkit-scrollbar": {
						width:"4px",
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
						width:"4px",
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
				{isMessageLoading && <OracleMessage isLoading={isMessageLoading} message="Salve" role="assistant" />}
				{
					messages.map((item, index) => (
						<OracleMessage
							ref={index === 0 ? lastMessageRef : null}
							key={index}
							message={item.content}
							role={item.role}
							isLastMessage={index === 0}
							isNew={item.isNew}
						/>
					))
				}
			</Box>
			<OracleInput
				commonQuestions={commonQuestions}
				userMessage={sendUserMessage}
				isMessageLoading={isMessageLoading}
				inicialMessage={inicialMessage}
			/>
		</Flex>
	);
};
