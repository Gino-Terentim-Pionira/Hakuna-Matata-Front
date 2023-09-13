import { Flex } from "@chakra-ui/react";
import React from "react";
import IgnoranceProgress from "./IgnoranceProgress";
import RandomRewardModal from "../modals/RandomRewardModal";
import Glasses from '../../assets/icons/double-glasses.png';
import GlassesOn from '../../assets/icons/double-glasses-on.png';
import { useUser } from "../../hooks";
import useIgnoranceFilter from '../../hooks/useIgnoranceFilter';
import CoinsDisplay from "./CoinsDisplay";
import NavIcon from "../NavigationComponents/NavIcon";
import { IGNORANCE_GLASS } from "../../utils/constants/constants";
import StatusProgress from "./StatusProgress";

interface IgnoracenPremiumIconsInterface {
  ignorance: number;
  dontShowIgnorance?: boolean;
  showStatus?: boolean;
  statusText?: string;
  statusPoints?: number;
  statusColor?: string;
}

const IgnorancePremiumIcons = ({ dontShowIgnorance, ignorance, showStatus, statusText, statusPoints, statusColor }: IgnoracenPremiumIconsInterface) => {
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
            !dontShowIgnorance && <Flex
              flexDirection='column'
              alignItems='flex-end'
            >
              <IgnoranceProgress
                position='bottom'
                ignorance={ignorance}
                ignoranceFilter={isIgnoranceFilterOn}
              />
              {
                showStatus && <StatusProgress 
                  status={statusPoints || 0} 
                  position='bottom'
                  labelText={statusText || ""} 
                  color={statusColor || ""}
                  ignoranceFilter={isIgnoranceFilterOn}
                />
              }
            </Flex>
          }
          <CoinsDisplay
            value={userData.coins}
            position='bottom'
          />
          <NavIcon
            image={isIgnoranceFilterOn ? GlassesOn : Glasses}
            mouseOver={IGNORANCE_GLASS}
            onClick={handleIgnoranceFilter}
            size="normal"
            isMap={false}
            position="bottom"
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
