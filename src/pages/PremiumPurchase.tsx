import React, { useEffect, useState } from 'react';
import { Flex, Box, Button } from '@chakra-ui/react';
import LoadingOverlay from '../components/LoadingOverlay';
import AlertModal from '../components/modals/AlertModal';
import colorPalette from '../styles/colorPalette';

const CHECKOUT_CONTENT_ID = "E9OOB5VV9B"; // Substitua pelo seu ID se necessário

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Cria o script dinamicamente
    const scriptId = "eduzz-bridge-js";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://cdn.eduzzcdn.com/sun/bridge/bridge.js";
      script.async = true;
      script.type = "module";
      script.id = scriptId;

      script.onload = () => {
        // Espera o objeto window.Eduzz ficar disponível
        if (window.Eduzz && window.Eduzz.Checkout) {
          window.Eduzz.Checkout.init({
            contentId: CHECKOUT_CONTENT_ID,
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
      // Script já estava carregado (SPA navigation)
      if (window.Eduzz && window.Eduzz.Checkout) {
        window.Eduzz.Checkout.init({
          contentId: CHECKOUT_CONTENT_ID,
          target: "elements",
          errorCover: false
        });
        setLoading(false);
      } else {
        setError(true);
      }
    }

    // Quando desmontar, pode remover o elemento, se quiser (opcional)
    // return () => {
    //   const el = document.getElementById("elements");
    //   if (el) el.innerHTML = "";
    // };

  }, []);

  if (loading) return <LoadingOverlay />;

  return (
    <>
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
          {/* Aqui será renderizado o checkout da Eduzz */}
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
