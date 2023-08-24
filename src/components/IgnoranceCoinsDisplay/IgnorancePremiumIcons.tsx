import { Flex, Image, Text, Center } from "@chakra-ui/react";
import React from "react";
import IgnoranceProgress from "./IgnoranceProgress";
import RandomRewardModal from "./modals/RandomRewardModal";
import Coin from '../assets/icons/coinicon.svg'
import Glasses from '../assets/icons/double-glasses.png';
import GlassesOn from '../assets/icons/double-glasses-on.png';
import { useUser } from "../hooks/";
import useIgnoranceFilter from '../hooks/useIgnoranceFilter';
import fontTheme from "../styles/base";
import CoinsDisplay from "./CoinsDisplay";

interface IgnoracenPremiumIconsInterface {
  ignorance: number;
  dontShowIgnorance?: boolean;
}

const IgnorancePremiumIcons = ({ dontShowIgnorance, ignorance }: IgnoracenPremiumIconsInterface) => {
  // const {
  // 	isOpen: premiumIsOpen,
  // 	onClose: premiumOnClose,
  // 	onOpen: premiumOnOpen,
  // 	onToggle: premiumOnToggle,
  // } = useDisclosure();
  const { userData } = useUser();
  const { isIgnoranceFilterOn, handleIgnoranceFilter } = useIgnoranceFilter();

  return (
    <>
      <Flex
        flexDirection='column'
        alignItems='flex-end'
        justifyContent='space-between'
        h='85.5vh'
        marginTop='1.5rem'
      >
        {/* <Image
          src={icon_membership}
          width='5rem'
          _hover={{
            cursor: 'pointer',
            transform: 'scale(1.1)',
          }}
          transition='all 0.2s ease'
          onClick={premiumOnOpen}
        /> */}
        <Flex
          flexDirection='column'
          mt='10px'
          alignItems='flex-end'
        >
          {
            !dontShowIgnorance && <IgnoranceProgress
              position='bottom'
              ignorance={ignorance}
            />
          }
          <Flex mt="8px" alignItems="center" justifyContent="flex-end">
            <Text fontFamily={fontTheme.fonts} fontSize="28px" fontWeight="500" color="#000">{userData.coins}</Text>
            <Image ml="4px" w="50px" src={Coin} alt="icone de moeda" />
          </Flex>
          <Center
            _hover={{
              cursor: 'pointer',
              transform: 'scale(1.1)',
            }}
            mt="16px"
            alignSelf="flex-end"
            transition='all 0.2s ease'
            border='2px solid #4a4a4a'
            borderRadius='4.5rem'
            width='4.5rem'
            height='4.5rem'
            bg='white'
            onClick={handleIgnoranceFilter}
          >
            <Image
              src={isIgnoranceFilterOn ? GlassesOn : Glasses}
              width="54px"
              height="54px"
            />
          </Center>
          <CoinsDisplay
            value={userData.coins}
            position='bottom'
          />
        </Flex>
        <RandomRewardModal />
      </Flex>
      {/* <PremiumPassport
        isOpen={premiumIsOpen}
        onClose={premiumOnClose}
        onToggle={premiumOnToggle}
      /> */}

    </>
  )
};

export default IgnorancePremiumIcons;
