import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { MdEmail } from 'react-icons/md';
import { FaCheckSquare } from 'react-icons/fa';
import colorPalette from '../styles/colorPalette';

const RenderConfirmationComponents = () => {
  return (
    <Box mt="28px" fontSize="18px">
      <Flex alignItems="center">
        <MdEmail color={colorPalette.alertText} size={80} />
        <Text ml="8px">Acesse seu email!</Text>
      </Flex>
      <Flex alignItems="center" mt="8px">
        <FaCheckSquare color={colorPalette.correctAnswer} size={80} />
        <Text ml="8px">e confirme sua conta!</Text>
      </Flex>
    </Box>
  );
};

export default RenderConfirmationComponents;
