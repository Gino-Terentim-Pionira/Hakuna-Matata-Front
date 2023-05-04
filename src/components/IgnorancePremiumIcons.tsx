import { Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import IgnoranceProgress from "./IgnoranceProgress";
import RandomRewardModal from "./modals/RandomRewardModal";
import Coin from '../assets/icons/coinicon.svg'
import { useUser } from "../hooks";
import fontTheme from "../styles/base";

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
        >
          {
            !dontShowIgnorance && <IgnoranceProgress
              ignorance={ignorance}
            />
          }
          <Flex mt="8px" alignItems="center" justifyContent="flex-end">
            <Text fontFamily={fontTheme.fonts} fontSize="28px" fontWeight="500" color="#000">{userData.coins}</Text>
            <Image ml="4px" w="50px" src={Coin} alt="icone de moeda" />
          </Flex>
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
