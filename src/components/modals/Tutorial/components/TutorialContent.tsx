import React, { useState } from "react";
import { Flex, Image, ModalBody, ModalFooter, ModalHeader, Text, Box } from "@chakra-ui/react";
import { ITutorialContent } from "../../../../services/TutorialServices";
import colorPalette from "../../../../styles/colorPalette";
import { imageIconsEnum } from "../../../../utils/enums/imageIconsEnum";
import Markdown from 'react-markdown';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'
import './styles/TutorialContentStyle.css';
import UserAvatar from "../../../UserAvatar";
import { IUser } from "../../../../recoil/useRecoilState";
import { motion } from 'framer-motion';



type TutorialContentType = {
    tutorialContent: ITutorialContent[];
    goBack: VoidFunction;
    userData: IUser;
    tutorialIcon?: string;
}
export const TutorialContent = ({ tutorialContent, goBack, userData, tutorialIcon }: TutorialContentType) => {
    const IS_ONLY_ONE_CONTENT = tutorialContent.length === 1;
    const [tutorialContentIndex, setTutorialContentIndex] = useState(0);
    const { tutorial_topic_name, image, content, name } = tutorialContent[tutorialContentIndex]
    const defaultVariant = {
        hidden: { opacity: 0, x: '100%' },
        visible: { opacity: 1, x: 0 },
    };
    const invertedVariant = {
        hidden: { opacity: 0, x: '-100%' },
        visible: { opacity: 1, x: 0 },
    }
    const [motionVariants, setMotionVariants] = useState(defaultVariant)

    const handlePassingContentWith = (arrow: "left" | "right") => {
        if (arrow === "left" && tutorialContentIndex > 0) {
            setTutorialContentIndex(tutorialContentIndex - 1)
            setMotionVariants(invertedVariant)
        } else if (arrow === "right" && tutorialContentIndex < tutorialContent.length - 1) {
            setTutorialContentIndex(tutorialContentIndex + 1)
            setMotionVariants(defaultVariant)
        }
    }


    return (
		<>
			<FaArrowLeft
				onClick={goBack}
				className='arrow'
				style={{ marginLeft: '18px', marginTop: '14px' }}
				color={colorPalette.textColor}
				size='36px'
			/>
			<ModalHeader
				display='flex'
				fontSize='24px'
				fontWeight='bold'
				paddingTop='16px'
				paddingX='30px'
				color={colorPalette.textColor}
				justifyContent='left'
			>
				<motion.div
					style={{
						display: 'flex',
						alignItems: 'center',
						columnGap: '8px',
					}}
					initial='hidden'
					animate='visible'
					variants={defaultVariant}
					transition={{ duration: 0.5 }}
				>
					{tutorial_topic_name === 'Perfil de usuário' ? (
						<UserAvatar
							customAvatar={userData.custom_avatar}
							avatarStyle='Transparent'
							width='32px'
							height='32px'
							marginBottom='4px'
						/>
					) : (
						<Image
							src={
								tutorialIcon ||
								imageIconsEnum[tutorial_topic_name]
							}
							width='32px'
							alt='Tutorial Icon'
						/>
					)}
					{tutorial_topic_name}
				</motion.div>
			</ModalHeader>
			<ModalBody
				paddingTop='-14px'
				paddingBottom='52px'
				paddingX='30px'
				overflowX='hidden'
				sx={{
					'&::-webkit-scrollbar': {
						width: '4px',
						height: '4px',
						borderRadius: '8px',
					},
					'&::-webkit-scrollbar-thumb': {
						background: '#9D9D9D',
						borderRadius: '10px',
					},
					'&::-webkit-scrollbar-thumb:hover': {
						background: '#555',
					},
					'&::-moz-scrollbar': {
						width: '4px',
						height: '4px',
						borderRadius: '8px',
					},
					'&::-moz-scrollbar-thumb': {
						background: '#9D9D9D',
						borderRadius: '10px',
					},
					'&::-moz-scrollbar-thumb:hover': {
						background: '#555',
					},
				}}
			>
				<motion.div
					key={tutorialContentIndex}
					initial='hidden'
					animate='visible'
					variants={motionVariants}
					transition={{ duration: 0.5 }}
				>
					<Image
						borderRadius='8px'
						w='100%'
						h='195px'
						src={image}
						alt='Imagem do tutorial'
					/>
					<Text
						marginTop='16px'
						fontSize='20px'
						fontWeight='600'
						color={colorPalette.textColor}
					>
						{name}
					</Text>
					<Box
						fontSize='18px'
						color={colorPalette.textColor}
						marginTop='8px'
						sx={{
							ul: {
								marginTop: '8px',
								paddingLeft: '18px',
								paddingRight: '18px',
							},
							ol: {
								marginTop: '8px',
								paddingLeft: '18px',
								paddingRight: '18px',
								marginBottom: '4px',
							},
							code: {
								whiteSpace: 'pre-wrap',
								wordWrap: 'break-word',
								maxWidth: '100%',
							},
						}}
					>
						<Markdown>{content}</Markdown>
					</Box>
				</motion.div>
			</ModalBody>
			{!IS_ONLY_ONE_CONTENT && (
				<Flex
					margin='auto'
					width='95%'
					opacity='0.5'
					height='1px'
					background={colorPalette.textColor}
				/>
			)}
			<ModalFooter
				paddingBottom='18px'
				columnGap={{ base: 0, md: '48px' }}
				paddingX={{ base: '16px', md: '0px' }}
				display='flex'
				justifyContent={{ base: "space-between", md: 'center' }}
				alignItems='center'
			>
				{!IS_ONLY_ONE_CONTENT && (
					<>
						{tutorialContentIndex !== 0 ? (
							<FaArrowLeft
								className='arrow'
								color={colorPalette.textColor}
								size='32'
								onClick={() => handlePassingContentWith('left')}
							/>
						) : (
							<Flex width='32px' />
						)}
						<Flex
							justify='center'
							columnGap='8px'
							width='100%'
							maxWidth='220px'
						>
							{tutorialContent.map(({ index }) => (
								<Flex
									key={index}
									flex='1'
									width='100%'
									maxWidth='38px'
									h='8px'
									bg={
										tutorialContentIndex === index
											? colorPalette.primaryColor
											: colorPalette.grayBackground
									}
									borderRadius='1000px'
									border={`1px solid ${
										tutorialContentIndex === index
											? colorPalette.primaryColor
											: '#9D9D9D'
									}`}
									_hover={{
										cursor: 'pointer',
									}}
									onClick={() =>
										setTutorialContentIndex(index)
									}
								/>
							))}
						</Flex>
						{tutorialContentIndex !== tutorialContent.length - 1 ? (
							<FaArrowRight
								className='arrow'
								color={colorPalette.textColor}
								onClick={() =>
									handlePassingContentWith('right')
								}
								size='32'
							/>
						) : (
							<Flex width='32px' />
						)}
					</>
				)}
			</ModalFooter>
		</>
	);
}
