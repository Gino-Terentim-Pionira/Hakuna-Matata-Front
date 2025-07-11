import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Box, Button, Image, useMediaQuery } from '@chakra-ui/react';
import LoadingOverlay from '../components/LoadingOverlay';
import AlertModal from '../components/modals/AlertModal';
import colorPalette from '../styles/colorPalette';
import { BiArrowBack } from 'react-icons/bi';
import PioniraLogo from '../assets/PioniraLogo.webp';
import { useHistory } from 'react-router-dom';
import MediaQueriesEnum from '../utils/enums/mediaQueries';

interface EduzzCheckout {
  Checkout: {
    init: (options: {
      contentId: string;
      target: string;
      errorCover: boolean;
      email?: string;
    }) => void;
  };
}
declare global {
  interface Window {
    Eduzz: EduzzCheckout;
  }
}

const EduzzCheckoutPage = () => {
  const { checkoutId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const history = useHistory();
  const [isDesktop] = useMediaQuery(MediaQueriesEnum.DESKTOP);

  useEffect(() => {
    const scriptId = "eduzz-bridge-js";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://cdn.eduzzcdn.com/sun/bridge/bridge.js";
      script.async = true;
      script.type = "module";
      script.id = scriptId;

      script.onload = () => {
        if (window.Eduzz && window.Eduzz.Checkout) {
          window.Eduzz.Checkout.init({
            contentId: checkoutId,
            target: "elements",
            errorCover: false
          });
          setLoading(false);
        } else {
          setError(true);
        }
      };

      script.onerror = () => {
        setError(true);
      };

      document.body.appendChild(script);
    } else {
      if (window.Eduzz && window.Eduzz.Checkout) {
        window.Eduzz.Checkout.init({
          contentId: checkoutId,
          target: "elements",
          errorCover: false
        });
        setLoading(false);
      } else {
        setError(true);
      }
    }

    return () => {
      const el = document.getElementById("elements");
      if (el) el.innerHTML = "";
    };

  }, []);

  return (
    <>
      {
        loading && <LoadingOverlay />
      }
      <Flex
        bg={colorPalette.beige}
        align="center"
        flexDirection='column'
        minH='100dvh'
      >
        <Flex
          backgroundColor={colorPalette.primaryColor}
          width='100%'
          justifyContent='flex-start'
          alignItems='center'
          px={isDesktop ? "32px" : "8px"}
          py={isDesktop ? "16px" : "8px"}
          marginBottom='32px'
        >
          <Box
            marginRight='auto'
            _hover={{ transform: 'scale(1.1)', cursor: 'pointer' }}
            transition="all 0.2s ease"
            onClick={() => history.goBack()}
          >
            <BiArrowBack
              size={isDesktop ? 54 : 32}
              color='white'
            />
          </Box>
          <Image
            filter="drop-shadow(0px 10px 1px rgba(0, 0, 0, 0.14))"
            width={{ base: '100px', md: '250px' }}
            maxW={{ base: '600px', md: 'none' }}
            src={PioniraLogo}
            alt="Logo pionira"
            marginRight='auto'
          />
        </Flex>
        <Box
          w={isDesktop ? "50%" : "80%"}
          minH={{ base: "60vh", md: "70vh" }}
          maxW={isDesktop ? '560px' : 'none'}
          boxShadow="md"
          borderRadius="lg"
          overflow="hidden"
          bg="white"
          p={6}
          marginBottom="32px"
        >
          <div id="elements" />
        </Box>
      </Flex>
      <AlertModal
        isOpen={error}
        onClose={() => window.location.reload()}
        alertTitle='Erro ao carregar o checkout'
        alertBody="Não foi possível carregar o checkout da Eduzz. Tente recarregar a página."
        buttonBody={
          <Button
            color='white'
            _hover={{ bg: colorPalette.primaryColor }}
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

export default EduzzCheckoutPage;
