import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  ModalBody,
  Box,
  Flex,
  Button,
  Text,
  Image,
} from '@chakra-ui/react';
import colorPalette from "../../styles/colorPalette";
import fontTheme from '../../styles/base';
import membershipIcon from '../../assets/icons/icon_membership.svg';

const SubscribedModal = ({ isOpen, onFunction } :
  {
    isOpen: boolean,
    onFunction: VoidFunction
  }
  ) => {
  return (
    < Modal
      isOpen={isOpen}
      onClose={onFunction}
      size='4xl'
    >
      <ModalOverlay />
      <ModalContent
        height='40rem'
        fontFamily={fontTheme.fonts}
        mt='1rem'
        mb='0.6rem'
      >
        <Box
          w='25%'
          bg={colorPalette.primaryColor}
          h='25rem'
          position='absolute'
          zIndex='-1'
          left='0'
          top='0'
          borderTopStartRadius='5px'
          clipPath='polygon(0% 0%, 55% 0%, 0% 100%)'
        />

        <ModalHeader d='flex' justifyContent='center' mt='1.4rem'>
          <Text
            w='75%'
            fontSize='4.37rem'
            textAlign='center'
            fontWeight='600'
            fontStyle='normal'
            color={colorPalette.secondaryColor}
          >
            Passaport Premium
          </Text>
          <ModalCloseButton color={colorPalette.closeButton} size='lg' />
        </ModalHeader>

        <ModalBody
          display='flex'
          mt='-1rem'
          flexDirection='column'
          h='30rem'
          alignItems='center'
          justifyContent='space-between'
        >
          <Text
            color={colorPalette.greyText}
            fontWeight='600'
            fontSize='1.68rem'
            textAlign='center'
            width='80%'
          >
            Agora você pode ter acesso aos certificados do Pionira, na área de certificados do seu perfil, e a mentorias exclusivas com Gino Terentim!
          </Text>
          <Image src={membershipIcon} w='20%' />
          <Text
            color={colorPalette.secondaryColor}
            fontWeight='600'
            textDecoration='underline'
            fontSize='1.87rem'
          >
            Passaport Premium Anual
          </Text>
          <Flex
            w='65%'
            justifyContent='center'
            marginBottom='0.8rem'
          >
            <Button
              alignSelf='center'
              bgColor={colorPalette.confirmButton}
              width='45%'
              height='4rem'
              fontSize='1.5rem'
              _hover={{
                transform: 'scale(1.1)',
              }}
              onClick={onFunction}
            >
              Confirmar
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal >

  )
}

export default SubscribedModal;
