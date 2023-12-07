import React, { FC, useState } from 'react';
import { Flex, Box, Image, Text, Slide, useDisclosure, Tooltip, Button } from '@chakra-ui/react';

// Images
import badgeShare from '../../assets/socialShare/badge.png';
import colorPalette from '../../styles/colorPalette';
import { BADGE_DESCRIPTION } from '../../utils/constants/mouseOverConstants';
import { getLogInUrl, setItems } from '../../services/linkedin';
import { convertImageToBase64 } from '../../utils/stringUtils';
import TypesEnum from '../../utils/enums/type';
import PlataformsEnum from '../../utils/enums/plataform';
import { SHARE } from '../../utils/constants/buttonConstants';
import linkedin from '../../assets/icons/social/linkedin.png';

type RelicProps = {
    _id: string;
    relic_name: string;
    description: string;
    image: string;
}

const Relic: FC<RelicProps> = ({ 
    _id, 
    relic_name, 
    description,
    image
}) => {
    const { isOpen, onToggle } = useDisclosure();
    const [show, setShow] = useState(false);

    const changeShow = () => {
        setShow(!show);
    }

    const showDescription = () => {
        setTimeout(changeShow, 100);
        onToggle();
    }

    const handleLinkedin = async () => {
        try {
            const response = await getLogInUrl();
            const imgbase64 = await convertImageToBase64(badgeShare);
            const text = `Ganhei a relíquia ${relic_name}`;
            const description = `Relíquia ${relic_name}`;
            setItems(
                text,
                description,
                imgbase64 as string,
                TypesEnum.relic,
                _id,
                PlataformsEnum.linkedin);
            window.location.replace(response.data.url);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Tooltip
                hasArrow
                placement='top'
                gutter={10}
                label={BADGE_DESCRIPTION}
            >
                <Box
                    marginTop='1rem'
                    maxW='14rem'
                    h='11rem'
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
                    <Image
                        boxSize='7.5rem'
                        src={image}
                    />
                    <Text
                        textDecoration='underline'
                        fontWeight='bold'
                        marginBottom='1rem'
                    >{relic_name}</Text>
                </ Box>
            </Tooltip>
            {
                show ? (
                    <Slide direction="bottom" in={isOpen} style={{ zIndex: 10 }}>
                        <Box onClick={showDescription} w='100%' h='100vh' />
                        <Flex
                            w='100%'
                            h='16rem'
                            bg={colorPalette.slideBackground}
                            rounded="md"
                            shadow="md"
                            flexDirection='column'
                            justifyContent='space-between'
                            border='4px solid'
                            borderColor={colorPalette.secondaryColor}
                        >
                            <Flex
                                justifyContent='flex-end'
                                paddingRight='20px'
                                paddingTop='9px'
                                fontSize='2rem'
                                fontWeight='bold'
                                color={colorPalette.closeButton}
                            >
                                <Text
                                    onClick={showDescription}
                                    transition='all 0.2s'
                                    _hover={{
                                        cursor: 'pointer',
                                        opacity: '80%'
                                    }}
                                    _active={{
                                        opacity: '50%'
                                    }}
                                    w='2.5rem'
                                >
                                    X
                                </Text>
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
                                    {relic_name}
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

                            <Flex
                                justifyContent='flex-end'
                                marginBottom='36px'
                                marginRight='20px'
                            >
                                <Button
                                    width='190px'
                                    height='45px'
                                    colorScheme='linkedin'
                                    fontSize='20px'
                                    leftIcon={
                                        <Image 
                                            width='24px'
                                            height='24px'
                                            src={linkedin} 
                                        />
                                    }
                                    onClick={handleLinkedin}
                                >
                                    {SHARE}
                                </Button>
                            </Flex>
                        </Flex>
                    </Slide>
                ) : null
            }

        </>
    );
}

export default Relic;
