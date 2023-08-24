import React, { FC, useEffect, useState } from 'react';
import {
	Flex,
	Box,
	Image,
	Text,
	Slide,
	useDisclosure,
	Button,
	Link,
} from '@chakra-ui/react';

// Images
import certificateImg from '../../assets/icons/certificate/certificate.svg';
import colorPalette from '../../styles/colorPalette';

import api from '../../services/api';
import AlertModal from '../modals/AlertModal';

// Utils
import { useHistory } from 'react-router-dom';
import { errorCases } from '../../utils/errors/errorsCases';

type CertifiacteProps = {
	_id: string;
	name: string;
	description: string;
	trail: number;
};

type IUserCertificate = {
	certificate_id: string;
};

const Certificate: FC<CertifiacteProps> = ({
	_id,
	name,
	description,
	trail,
}) => {
	const { isOpen, onToggle } = useDisclosure();
	const [show, setShow] = useState(false);
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [onError, setOnError] = useState(false);
	const [link, setLink] = useState('');

	const history = useHistory();

	const goToPremium = () => {
		history.push('/premium');
	};

	const getUser = async () => {
		try {
			const userId = sessionStorage.getItem('@pionira/userId');
			const user = await api.get(`/user/${userId}`);
			const certificate = await api.get(`/certificate/`);
			const certificateUser = user.data.certificates;

			const aff = certificate.data[trail - 1]._id;

			const certificateLink = certificateUser.find(
				(attest: IUserCertificate) => attest.certificate_id === aff,
			);

			setLink(certificateLink.certificate_url);

			if (user.data.isSubscribed) setIsSubscribed(true);
			else setIsSubscribed(false);
		} catch (error) {
			setOnError(true);
		}
	};

	const changeShow = () => {
		setShow(!show);
	};

	const showDescription = () => {
		setTimeout(changeShow, 100);
		onToggle();
	};

	useEffect(() => {
		getUser();
	}, []);

	return (
		<>
			<Box
				marginTop='1rem'
				maxW='14rem'
				h='10.5rem'
				display='flex'
				flexDirection='column'
				justifyContent='space-between'
				alignItems='center'
				key={_id}
				_hover={{
					cursor: 'pointer',
				}}
				onClick={showDescription}
			>
				<Image boxSize='7.5rem' src={certificateImg} />
				<Text
					marginBottom='1rem'
					fontSize='1rem'
					fontWeight='extrabold'
				>
					{name}
				</Text>
			</Box>

			{show ? (
				<Slide direction='bottom' in={isOpen} style={{ zIndex: 10 }}>
					<Box onClick={showDescription} w='100%' h='100vh' />
					<Flex
						w='100%'
						h='16rem'
						bg={colorPalette.slideBackground}
						rounded='md'
						shadow='md'
						flexDirection='column'
						justifyContent='space-between'
						border='4px solid'
						borderColor={colorPalette.secondaryColor}
					>
						<Flex
							alignItems='flex-end'
							paddingRight='20px'
							paddingTop='9px'
							fontSize='2rem'
							fontWeight='bold'
							flexDirection='column'
						>
							<Text
								color='#E55454'
								mb='2rem'
								onClick={showDescription}
								transition='all 0.2s'
								_hover={{
									cursor: 'pointer',
									opacity: '80%',
								}}
								_active={{
									opacity: '50%',
								}}
								w='2.5rem'
							>
								X
							</Text>
							{isSubscribed ? (
								<>
									<Button background='#EDA641' width='8vw'>
										<Link href={link} isExternal>
											Download
										</Link>
									</Button>
								</>
							) : (
								<>
									<Button background='#EDA641' width='8vw' onClick={goToPremium}>
										Assinar
									</Button>
								</>
							)}
						</Flex>
						<Flex
							w='92%'
							marginTop='1rem'
							position='absolute'
							marginLeft='1.5rem'
							flexDirection='column'
						>
							<Text
								fontSize={['0.5rem', '1rem', '1.3rem']}
								fontWeight='bold'
								textAlign='left'
							>
								{name}
							</Text>

							<Text
								fontSize={['0.5rem', '1rem', '1.3rem']}
								fontWeight='regular'
								textAlign='left'
								marginTop='2rem'
							>
								{description}
							</Text>
						</Flex>
					</Flex>
				</Slide>
			) : null}

			<AlertModal
				isOpen={onError}
				onClose={() => window.location.reload()}
				alertTitle='Ops!'
				alertBody={errorCases.SERVER_ERROR}
				buttonBody={
					<Button
						color='white'
						bg={colorPalette.primaryColor}
						onClick={() => window.location.reload()}
					>
						Recarregar
					</Button>
				}
			/>
		</>
	);
};

export default Certificate;
