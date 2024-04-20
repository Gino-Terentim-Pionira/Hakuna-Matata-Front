import React, { useEffect, useState } from 'react';
import { Flex, Image, Button } from '@chakra-ui/react';
import fontTheme from '../styles/base';
import { OracleHeader } from '../components/Oracle/OracleHeader';
import { OracleChat } from '../components/Oracle/OracleChat/OracleChat';
import { OracleServices, ICommonQuestion, IMessages } from '../services/OracleServices';
import trailEnum from '../utils/enums/trail';
import LoadingOverlay from '../components/LoadingOverlay';
import AlertModal from '../components/modals/AlertModal';
import colorPalette from '../styles/colorPalette';
import { useHistory, useLocation } from 'react-router-dom';

export const Oracle = () => {
	const history = useHistory();
	const location = useLocation();
	const oracleService = new OracleServices();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [oracleObject, setOracleObject] = useState({
		oracle_name: "",
		background: "",
		image: "",
		messages: [] as IMessages[],
		commonQuestions: [] as ICommonQuestion[]
	});
	const [alert, setAlert] = useState<{
		onAlert: boolean,
		title: string,
		body: string,
		closeFunction: VoidFunction,
		buttonFunction: VoidFunction,
		buttonText: string
	}>({
		onAlert: false,
		title: 'Ops!',
		body: 'O Oráculo não está disponível no momento. Volte mais tarde!',
		closeFunction: () => history.goBack(),
		buttonFunction: () => history.goBack(),
		buttonText: 'Voltar'
	});

	const getHistoryAndQuestions = async () => {
		try {
			const trail: trailEnum = location.state.trail;
			const userId = sessionStorage.getItem('@pionira/userId');

			const messages = await oracleService.getOracleHistory(userId as string, trail);

			const commonQuestionsResponse = await oracleService.getCommonQuestions(userId as string, trail);

			setOracleObject({
				oracle_name: messages.oracle.oracle_name,
				background: messages.oracle.background,
				image: messages.oracle.image,
				messages: messages.messages,
				commonQuestions: commonQuestionsResponse
			});

			setTimeout(() => {
				setIsLoading(false);
			}, 1000);
		} catch (error) {
			setAlert({
				...alert,
				onAlert: true
			});
		}
	}

	useEffect(() => {
		getHistoryAndQuestions();
	}, []);

	return (
		<>
			{
				isLoading ? (
					<LoadingOverlay />
				) : (

						<Flex
							height="100vh"
							width="100%"
							flexDirection="column"
							alignItems="center"
							fontFamily={fontTheme.fonts}
						>
							<OracleHeader
								oracleName={oracleObject.oracle_name}
							/>

							<Flex
								backgroundImage={`url(${oracleObject.background})`}
								backgroundSize="cover"
								backgroundPosition="top"
								backgroundRepeat="no-repeat"
								height="calc(100vh - 95px)"
								width="100%"
								justifyContent="center"
								alignItems="flex-end"
								columnGap={{ sm: '24px', md: '34px', '2xl': '112px' }}
								paddingX="16px"
							>
								<Image width="30%" minW="320px" maxWidth="537px" height="70%" minHeight="485px" maxHeight="800px" src={oracleObject.image} />
								<OracleChat
									commonQuestions={oracleObject.commonQuestions}
									messages={oracleObject.messages}
								/>
							</Flex>
						</Flex>
					)
			}
			<AlertModal
				isOpen={alert.onAlert}
				onClose={alert.closeFunction}
				alertTitle={alert.title}
				alertBody={alert.body}
				buttonBody={
					<Button
						color='white'
						bg={colorPalette.primaryColor}
						onClick={alert.buttonFunction}
					>
						{alert.buttonText}
					</Button>
				}
			/>
		</>
	);
}