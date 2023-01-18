import { Flex } from "@chakra-ui/react";
import React from "react";
import IgnoranceProgress from "./IgnoranceProgress";
import RandomRewardModal from "./modals/RandomRewardModal";
// import icon_membership from '../assets/icons/icon_membership.svg';
// import PremiumPassport from "./modals/PremiumPassport";

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

  return (
    <>
      <Flex
        flexDirection='column'
        alignItems='center'
        justifyContent='flex-end'
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
          marginTop='65vh'
          alignItems='flex-end'
        >
          <RandomRewardModal />
          {
            !dontShowIgnorance && <IgnoranceProgress
              ignorance={100 - ignorance}
            />
          }
        </Flex>
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
