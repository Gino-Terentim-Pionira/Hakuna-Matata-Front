import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Box, Button } from '@chakra-ui/react';
import LoadingOverlay from '../components/LoadingOverlay';
import AlertModal from '../components/modals/AlertModal';
import colorPalette from '../styles/colorPalette';

interface EduzzCheckout {
  Checkout: {
    init: (options: {
      contentId: string;
      target: string;
      errorCover: boolean;
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
        bg={colorPalette.oracleWhite}
        minH="100vh"
        p={{ base: 4, md: 8 }}
        justify="center"
        align="center"
        flexDirection='column'
      >
        <Box
          w="100%"
          maxW="600px"
          minH={{ base: "60vh", md: "70vh" }}
          boxShadow="md"
          borderRadius="lg"
          overflow="hidden"
          bg="white"
          p={6}
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
