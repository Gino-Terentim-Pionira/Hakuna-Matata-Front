import { Box, Center, Image, Progress, Text } from '@chakra-ui/react';
import React from 'react';
import colorPalette from '../styles/colorPalette';
import CheetahBlink from '../assets/sprites/cheetah/cheetahBlink.png';
import fontTheme from '../styles/base';
import { motion } from 'framer-motion';

const LoadingOverlay = () => {
    return (
        <Center
            position='fixed'
            zIndex='10'
            w="100%"
            h="100vh"
            backgroundColor="#EBAF59"
            flexDir="column"
        >
            <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 720 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
                style={{
                    display:'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: "#fff",
                    borderRadius: "1000px",
                    width: "200px",
                    height: "195px",
                    border: '2px solid #9d9d9d'
                }}
            >
                <Image
                    src={CheetahBlink}
                    w="130px"
                    h="120px"
                    mt="9px"
                    ml="8px"
                />
            </motion.div>
            <Box border="1px solid #9d9d9d" borderRadius="8px" p="8px 16px" ml="8px" mt="32px" width="50%" maxW="500px" bg="#fff">
                <Progress size="sm" isIndeterminate colorScheme='blue' />
            </Box>
            <Box width="50%" maxW="500px" >
                <Text color={colorPalette.blackBorder} fontFamily={fontTheme.fonts} fontWeight="semibold" fontSize="22px" ml="16px" alignSelf="self-start" mt="8px">Viajando...</Text>
            </Box>
        </Center>
    )
}

export default LoadingOverlay;