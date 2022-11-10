import React, { useState } from 'react';
import {
  Box,
  Flex,
  Image,
  Link,
  Input,
  Button,
  Text
} from '@chakra-ui/react';
import { useHistory } from 'react-router';
import InputMask from 'react-input-mask';
import api from '../services/api';

import AlertModal from '../components/modals/AlertModal';
import LoadingState from '../components/LoadingState';
import SubscribedModal from '../components/modals/SubscribedModal';
import filterStrings from '../utils/filterStrings';

import colorPalette from "../styles/colorPalette";
import fontTheme from '../styles/base';
import '../styles/inputmask.css'

import cheetahBlinkImage from "../assets/sprites/cheetah/cheetahBlink.png"
import locationIcon from "../assets/icons/locationIcon.png"
import cardIcon from "../assets/icons/cardIcon.png";
import monkey from "../assets/sprites/monkey/monkeyHappy.png"
import cheetah from "../assets/sprites/cheetah/cheetah_happy.png"

const PaymentPage = () => {
  const history = useHistory();
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [addressNumber, setAddresNumber] = useState("");
  const [street, setStreet] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [validDate, setValidDate] = useState("");
  const [ddd, setDdd] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cpf, setCpf] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribedModal, setIsSubscribedModal] = useState(false);

  const confirmPayment = async () => {
    setIsLoading(true);
    const userId = sessionStorage.getItem('@pionira/userId');
    try {
      const res = await api.get(`user/${userId}`);
      const email = res.data.email;
      const name = res.data.first_name + " " + res.data.last_name
      await api.patch(`user/subscription/${userId}`, {
        name: name,
        card_number: filterStrings(cardNumber),
        card_holder_name: cardName.trim(),
        card_expiration_date: filterStrings(validDate),
        card_cvv: cvv,
        email: email,
        document_number: filterStrings(cpf),
        zipcode: filterStrings(cep),
        neighborhood: address.trim(),
        street: street.trim(),
        street_number: addressNumber,
        number: phoneNumber,
        ddd: ddd
      });

      setIsLoading(false);
      setIsSubscribedModal(true);
    } catch (error) {
      console.log(error)
      setIsLoading(false);
      setIsOpenModal(false);
      setIsErrorModal(true);
    }
  }

  return (
    <Flex
      fontFamily={fontTheme.fonts}
      align="center"
      flexDir="column"
      backgroundColor={colorPalette.backgroundGrey}
      minHeight="100vh"
    >
      <Box w="60%" bg={colorPalette.primaryColor} h="100vh" position="absolute" zIndex='0' right="0" top="0" clipPath="polygon(70% 0, 100% 60%, 100% 0)"></Box>

      <Flex
        width="95%"
      >
        <Flex
          marginTop="3.5rem"
          width="65%"
          borderBottom={`3px solid ${colorPalette.primaryColor}`}
          paddingBottom="1.43rem"
        >
          <Text
            color={colorPalette.secondaryColor}
            fontWeight="bold"
            fontSize="50px"
          >
            Área de Pagamento
          </Text>
        </Flex>
      </Flex>

      <Flex
        w="95%"
        mt="5rem"
      >
        <Flex
          width="65%"
          align="center"
          border={`3px solid ${colorPalette.inactiveButton}`}
          borderRadius="10px"
          paddingY="2.3rem"
          paddingLeft="1.4rem"
          paddingRight="1rem"
        >
          <Image src={cheetahBlinkImage} w="7rem" />
          <Text
            ml="2.5rem"
            fontSize="1.5rem"
            color={colorPalette.greyText}
            fontWeight="semibold"
          >
            “Pode ficar tranquilo, filhote! Todas suas informações vão estar guardadas com a segurança de ponta do pagar.me, caso queira saber mais
            <Link
              isExternal
              color={colorPalette.inactiveButton}
              href="https://pagar.me/blog/pagarme-seguranca/"
              ml="0.4rem"
            >
              clique aqui!
            </Link>”
          </Text>
        </Flex>
      </Flex>

      <Flex
        width="95%"
        mt="3rem"
        flexDir="column"
      >
        <Flex
          align="center"
        >
          <Text
            fontWeight="semibold"
            fontSize="43px"
            color={colorPalette.inactiveButton}
          >
            Endereço
          </Text>
          <Image src={locationIcon} ml="1rem" w="4rem" />
        </Flex>

        <Flex
          mt="1rem"
          width="80%"
          border={`2px solid ${colorPalette.primaryColor}`}
          borderRadius="10px"
          justifyContent="space-between"
        >
          <Flex
            w="50%"
            mt="3.1rem"
            paddingLeft='2rem'
            flexDir="column"
            mb="3rem"
          >
            <Text
              color={colorPalette.greyText}
              fontSize="2.5rem"
              fontWeight="medium"
            >
              CEP
            </Text>
            <InputMask
              onChange={e => setCep(e.target.value)}
              mask="99999 999"
              placeholder="Digite aqui seu CEP"
              className="inputCard"
            />
            <Flex justifyContent="space-between" mt="2rem">
              <Flex flexDir="column" w="80%" >
                <Text
                  color={colorPalette.greyText}
                  fontSize="2.5rem"
                  fontWeight="medium"
                >
                  Endereço
                </Text>
                <Input
                  type="text"
                  border={`2px solid`}
                  focusBorderColor="none"
                  borderColor="#B2AEAF"
                  placeholder="Digite aqui seu endereço"
                  height="3.4rem"
                  onChange={e => setAddress(e.target.value)}
                />
              </Flex>

              <Flex flexDir="column" w="15%" >
                <Text
                  color={colorPalette.greyText}
                  fontSize="2.5rem"
                  fontWeight="medium">
                  Nº
                </Text>
                <Input
                  type="number"
                  border={`2px solid`}
                  focusBorderColor="none"
                  borderColor="#B2AEAF"
                  placeholder="Nº"
                  height="3.4rem"
                  onChange={e => setAddresNumber(e.target.value)}
                />
              </Flex>
            </Flex>

            <Text
              color={colorPalette.greyText}
              fontSize="2.5rem"
              fontWeight="medium"
              mt="2rem"
            >
              Rua/Quadra
            </Text>
            <Input
              type="text"
              border={`2px solid`}
              focusBorderColor="none"
              borderColor="#B2AEAF"
              placeholder="Digite sua rua ou quadra"
              height="3.4rem"
              onChange={e => setStreet(e.target.value)}
            />

            <Flex justifyContent="space-between" mt="2rem">
              <Flex flexDir="column" w="15%" >
                <Text
                  color={colorPalette.greyText}
                  fontSize="2.5rem"
                  fontWeight="medium">
                  DDD
                </Text>
                <InputMask
                  mask="99"
                  placeholder="DDD"
                  className="inputCard"
                  onChange={e => setDdd(e.target.value)}
                />
              </Flex>
              <Flex flexDir="column" w="80%" >
                <Text
                  color={colorPalette.greyText}
                  fontSize="2.5rem"
                  fontWeight="medium"
                >
                  Nº de Telefone
                </Text>
                <InputMask
                  mask="999999999"
                  placeholder="Digite aqui seu numero"
                  className="inputCard"
                  onChange={e => setPhoneNumber(e.target.value)}
                />
              </Flex>
            </Flex>

            <Text
              color={colorPalette.greyText}
              fontSize="2.5rem"
              fontWeight="medium"
              mt="1rem"
            >
              CPF
            </Text>
            <InputMask
              mask="999.999.999-99"
              placeholder="Digite aqui seu CEP"
              className="inputCard"
              onChange={e => setCpf(e.target.value)}
            />
          </Flex>
          <Flex
            w="50%"
            justifyContent="center"
            align="center"
          >
            <Image src={monkey} w="90%" />
          </Flex>
        </Flex>
      </Flex>

      <Flex
        width="95%"
        mt="3rem"
        flexDir="column"
      >
        <Flex
          align="center"
        >
          <Text
            fontWeight="semibold"
            fontSize="43px"
            color={colorPalette.inactiveButton}
          >
            Dados do Cartão
          </Text>
          <Image src={cardIcon} ml="1rem" w="4rem" />
        </Flex>

        <Flex
          mt="1rem"
          width="80%"
          border={`2px solid ${colorPalette.primaryColor}`}
          borderRadius="10px"
          justifyContent="space-between"
        >
          <Flex
            w="50%"
            mt="3.1rem"
            paddingLeft='2rem'
            flexDir="column"
            mb="3rem"
          >
            <Text
              color={colorPalette.greyText}
              fontSize="2.5rem"
              fontWeight="medium"
            >
              Nome do Proprietário
            </Text>
            <Input
              type="text"
              border={`2px solid`}
              focusBorderColor="none"
              borderColor="#B2AEAF"
              placeholder="Digite o nome como está no cartão"
              height="3.4rem"
              onChange={e => setCardName(e.target.value)}
            />

            <Flex justifyContent="space-between" mt="2rem">
              <Flex flexDir="column" w="80%" >
                <Text
                  color={colorPalette.greyText}
                  fontSize="2.5rem"
                  fontWeight="medium"
                >
                  Nº do Cartão
                </Text>
                <InputMask
                  mask="9999 9999 9999 9999"
                  placeholder="Digite o número do cartão"
                  className="inputCard"
                  onChange={e => setCardNumber(e.target.value)}
                />
              </Flex>

              <Flex flexDir="column" w="15%" >
                <Text
                  color={colorPalette.greyText}
                  fontSize="2.5rem"
                  fontWeight="medium">
                  CVV
                </Text>
                <InputMask
                  mask="999"
                  placeholder="Nº"
                  className="inputCard"
                  onChange={e => setCvv(e.target.value)}
                />
              </Flex>
            </Flex>

            <Text
              color={colorPalette.greyText}
              fontSize="2.5rem"
              fontWeight="medium"
              mt="2rem"
            >
              Data de Validade
            </Text>
            <InputMask
              mask="99/99"
              placeholder="Digite a validade do cartão"
              className="inputCard"
              style={{
                width: "40%"
              }}
              onChange={e => setValidDate(e.target.value)}
            />
          </Flex>
          <Flex
            w="50%"
            justifyContent="center"
            align="center"
          >
            <Image src={cheetah} w="90%" />
          </Flex>
        </Flex>
      </Flex>

      <Button
        w="40%"
        mt="2.2rem"
        height="4.5rem"
        fontSize="2.3rem"
        focusBorderColor="none"
        background={colorPalette.primaryColor}
        color={colorPalette.backgroundColor}
        transition="all 200ms ease"
        _hover={{
          transform: "scale(1.05)"
        }}
        onClick={() => setIsOpenModal(true)}
      >
        Confirmar
      </Button>

      <Text
        textDecoration="underline"
        fontSize="1.7rem"
        color={colorPalette.greyText}
        mt="1.5rem"
        mb="1.5rem"
        transition="all 200ms ease"
        _hover={{
          cursor: "pointer",
          transform: "scale(1.05)"
        }}
        onClick={() => history.push('/premium')}
      >
        Cancelar compra
      </Text>

      <AlertModal
        isOpen={isOpenModal}
        onClose={!isLoading ? () => setIsOpenModal(false) : () => null}
        alertTitle="Confirmação de pagamento"
        alertBody="Deseja confirmar seu pagamento?"
        buttonBody={
          !isLoading ?
            <Button
              background={colorPalette.primaryColor}
              color={colorPalette.backgroundColor}
              onClick={async () => {
                await confirmPayment()
              }}
            >
              Confirmar
            </Button>
            :
            <LoadingState />
        }
      />

      <AlertModal
        isOpen={isErrorModal}
        onClose={() => setIsErrorModal(false)}
        alertTitle="Ops ocorreu um erro!"
        alertBody="Cheque se todas as informações foram escritar corretamente ou tente novamente mais tarde"
        buttonBody={
          <Button
            background={colorPalette.primaryColor}
            color={colorPalette.backgroundColor}
            onClick={() => setIsErrorModal(false)}
          >
            Okay!
          </Button>
        }
      />

      <SubscribedModal
        isOpen={isSubscribedModal}
        onFunction={() => history.push("/")}
      />
    </Flex>
  )
}

export default PaymentPage;
