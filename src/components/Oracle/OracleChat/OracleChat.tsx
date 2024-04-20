import React from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { OracleInput, userMessageFunction } from './components/OracleInput';
import { ICommonQuestion, IMessages } from '../../../services/OracleServices';
import OracleMessage from './components/OracleMessage';



export const OracleChat = ({
	commonQuestions,
	messages,
	userMessage
}: {
	commonQuestions: ICommonQuestion[],
	messages: IMessages[],
	userMessage: userMessageFunction
}) => (
	<Flex
		flexDir="column"
		justifyContent="flex-end"
		paddingX="24px"
		paddingBottom="20px"
		width="700px"
		overflowX="auto"
		overflowY="auto"
		minHeight="450px"
		height="90%"
		maxHeight="880px"
		margin="auto"
		marginLeft="0"
		marginRight="8px"
		background="rgba(240, 240, 240, 0.95)"
		borderRadius="8px"
		boxShadow="0 4px 4px rgba(0, 0, 0, 0.25), inset 0 4px 4px rgba(0, 0, 0, 0.25)"
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
			{
				messages.map((item, index) => (
					<OracleMessage 
						key={index}
						message={item.content}
						role={item.role}
					/>
				))
			}

		</Box>
		<OracleInput 
			commonQuestions={commonQuestions}
			userMessage={userMessage}
		/>
	</Flex>
);