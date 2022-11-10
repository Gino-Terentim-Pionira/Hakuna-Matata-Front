import React, { FC, useState, useEffect } from 'react';
import { Flex, Box, Image, Text, Slide, useDisclosure } from '@chakra-ui/react';

// Images
import insigniaImg from '../assets/icons/insignia/insignia.png';
import cheetaTrailInsignia from '../assets/icons/insignia/cheetaTrailInsignia.png';
import mambaTrailInsignia from '../assets/icons/insignia/mambaTrailInsignia.png';
import lionTrailInsignia from '../assets/icons/insignia/lionTrailInsignia.png';
import colorPalette from '../styles/colorPalette';

type InsigniaProps = {
    _id: string;
    trail: string;
    name: string;
    description: string;
}

const Insignia: FC<InsigniaProps> = ({ _id, trail, name, description }) => {
    const { isOpen, onToggle } = useDisclosure();
    const [show, setShow] = useState(false);
    const [trailImage, setTrailImage] = useState('');

    const changeImage = () => {
        switch (trail) {
            case 'Trilha 1':
                setTrailImage(cheetaTrailInsignia);
                break;
            case 'Trilha 2':
                setTrailImage(lionTrailInsignia);
                break;
            case 'Trilha 3':
                setTrailImage(mambaTrailInsignia);
                break;
            default:
                setTrailImage(insigniaImg);
        }
    }

    const changeShow = () => {
        setShow(!show);
    }

    const showDescription = () => {
        setTimeout(changeShow, 100);
        onToggle();
    }

    useEffect(() => {
        changeImage();
    }, [])

    return (
        <>
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
                    src={trailImage}
                />
                <Text
                    textDecoration='underline'
                    fontWeight='bold'
                    marginBottom='1rem'
                >{name}</Text>
            </ Box>
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
                ) : null
            }

        </>
    );
}

export default Insignia;
