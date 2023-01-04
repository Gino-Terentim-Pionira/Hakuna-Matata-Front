import { Flex } from "@chakra-ui/react";
import React from "react";
import IgnoranceProgress from "./IgnoranceProgress";
import RandomRewardModal from "./modals/RandomRewardModal";

interface IgnoracenPremiumIconsInterface {
  ignorance: number;
  dontShowIgnorance?: boolean;
}

const IgnorancePremiumIcons = ({ dontShowIgnorance, ignorance }: IgnoracenPremiumIconsInterface) => (
  <Flex
    flexDirection='column'
    justifyContent='flex-end'
    h='87.5vh'
    marginTop='1.5rem'
  >
    <Flex
      flexDirection='row'
      marginTop='65vh'
      justifyContent='flex-end'
      alignItems='center'
    >
      <RandomRewardModal />
      {
        !dontShowIgnorance && <IgnoranceProgress
          fontSize='1.7rem'
          marginTop='0'
          size='6rem'
          ignorance={ignorance}
          position='absolute'
        />
      }
    </Flex>
  </Flex>
);

export default IgnorancePremiumIcons;
