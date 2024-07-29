import React, { useEffect, useState } from 'react';
import { Flex, Button, useDisclosure } from '@chakra-ui/react';
import fontTheme from '../styles/base';
import { OracleHeader } from '../components/Oracle/OracleHeader';
import { OracleChat } from '../components/Oracle/OracleChat/OracleChat';
import { OracleServices, ICommonQuestion, IMessages } from '../services/OracleServices';
import trailEnum from '../utils/enums/trail';
import LoadingOverlay from '../components/LoadingOverlay';
import AlertModal from '../components/modals/AlertModal';
import colorPalette from '../styles/colorPalette';
import { useHistory, useLocation } from 'react-router-dom';
import { ShopItemInfoType, ShopModal } from '../components/modals/ShopModal/ShopModal';
import { useUser } from '../hooks';
import { IUser } from '../recoil/useRecoilState';
import OracleAnimation from '../components/Oracle/OracleChat/components/OracleAnimation';

export type PackagesDataType = ShopItemInfoType[];

const FinalQuizCompleteEnum: { [key: string]: keyof IUser['finalQuizComplete'] } = {
	'Cheetah': 'cheetahFinal',
	'Mamba Negra': 'blackMamba',
	'Leão e Leoa': 'lionFinal'
}


export const Oracle = () => {
	const { userData, getNewUserInfo } = useUser();
	const history = useHistory();
	const location = useLocation();
	const IS_FINAL_QUIZ_COMPLETE = userData.finalQuizComplete ? userData.finalQuizComplete[FinalQuizCompleteEnum[location?.state?.trail as trailEnum]] : false;
	const oracleService = new OracleServices();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [packages, setPackages] = useState<PackagesDataType>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isMessageLoading, setIsMessageLoading] = useState(false);
	const [isTalking, setIsTalking] = useState<boolean>(false);
	const [oracleObject, setOracleObject] = useState({
		oracle_name: "",
		background: "",
		sprite_idle: "",
		sprite_talking: "",
		thread_id: "",
		assistant_id: "",
		messages: [
			{
				role: 'assistant',
				content: 'Seja bem vindo(a) à caverna do Oráculo. Você ganhou 1 Token gratuito para sua primeira consulta! No que posso te ajudar?'
			}
		] as IMessages[],
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

	const addUserMessage = (content: string) => {
		setOracleObject((currentState) => (
			{
				...currentState,
				messages: [{
					role: 'user',
					content
				}, ...currentState.messages]
			}
		));
	}

	const sendOracleMessage = async (content: string) => {
		if(!content) return
		try {
			setIsMessageLoading(true);
			addUserMessage(content);
			setIsTalking(true);
			const response = await oracleService.sendMessage(
				userData._id,
				oracleObject.thread_id,
				oracleObject.assistant_id,
				content
			);

			const newMessages = response.map((message: IMessages) => ({
				...message,
				isNew: true
			}));

			setOracleObject((currentState) => (
				{
					...currentState,
					messages: [...newMessages, ...currentState.messages]
				}
			));
			setIsMessageLoading(false);
			await getNewUserInfo();
		} catch (error) {
			setAlert({
				...alert,
				onAlert: true
			});
			setIsMessageLoading(false);
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!userData._id) {
					await getNewUserInfo();
				}
				const packages = await oracleService.getAllPackages();
				setPackages(packages);
				await getHistoryAndQuestions();
			} catch (error) {
				setAlert({
					...alert,
					onAlert: true
				});
			}
		};

		const getHistoryAndQuestions = async () => {
			const trail: trailEnum = location.state.trail;
			const userId = sessionStorage.getItem('@pionira/userId');

			const messages = await oracleService.getOracleHistory(userId as string, trail);

			const commonQuestionsResponse = await oracleService.getCommonQuestions(userId as string, trail);

			setOracleObject((currentState) => (
				{
					oracle_name: messages.oracle.oracle_name,
					background: messages.oracle.background,
					sprite_idle: messages.oracle.sprite_idle,
					sprite_talking: messages.oracle.sprite_talking,
					thread_id: messages.thread_id,
					assistant_id: messages.oracle.assistant_id,
					messages: [...messages.messages, ...currentState.messages],
					commonQuestions: commonQuestionsResponse
				}
			));

			await getNewUserInfo();

			setTimeout(() => {
				setIsLoading(false);
			}, 1000);
		}

		fetchData().then();
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
							<ShopModal packages={packages} isOpen={isOpen} onClose={onClose} />
							<OracleHeader
								oracleName={oracleObject.oracle_name}
								onOpen={onOpen}
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
								paddingX="16px"
							>
								<OracleAnimation 
									oracleObject={oracleObject}
									isTalking={isTalking}
									onEnd={() => {setIsTalking(false)}}
								/>
								<OracleChat
									isInputReleased={IS_FINAL_QUIZ_COMPLETE}
									commonQuestions={oracleObject.commonQuestions}
									messages={oracleObject.messages}
									userMessage={sendOracleMessage}
									isMessageLoading={isMessageLoading}
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