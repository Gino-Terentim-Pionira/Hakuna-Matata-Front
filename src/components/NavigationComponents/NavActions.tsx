import { Flex, useDisclosure } from "@chakra-ui/react";
import React from "react";
import TutorialModal from "../modals/TutorialModal";

import icon_profile from '../../assets/icons/icon_profile.svg';
import icon_tutorial from '../../assets/icons/icon_tutorial.svg';
import icon_shop from '../../assets/icons/icon_shop.svg';
import icon_map from '../../assets/icons/icon_map.svg';
import icon_logout from '../../assets/icons/icon_logout.svg';
import inventory_icon from '../../assets/icons/inventory.png';
import ProfileModal from "../modals/ProfileModal";
import NavIcon from "./NavIcon";
import { useHistory } from "react-router-dom";
import { USER_PROFILE, STORE, INVENTORY, TUTORIAL, LOG_OUT, MAP } from "../../utils/constants/constants";
import usePath from "../../hooks/usePath";

interface NavActionsInterface {
  logout: VoidFunction;
  dontShowMap?: boolean;
  prePath: string
}

const NavActions = ({ logout, dontShowMap, prePath }: NavActionsInterface) => {
  const { handlePath } = usePath();
  const {
    isOpen: profileIsOpen,
    onClose: profileOnClose,
    onOpen: profileOnOpen
  } = useDisclosure();

  const {
    isOpen: tutorialIsOpen,
    onClose: tutorialOnClose,
    onOpen: tutorialOnOpen,
    onToggle: tutorialOnToggle,
  } = useDisclosure();

  const history = useHistory();

  const handleStore = () => {
    handlePath(prePath);
    history.push({ pathname: '/shop' });
  }

  const handleInventory = () => {
    handlePath(prePath);
    history.push({ pathname: '/inventory' });
  }

  return (
    <>
      <Flex
        maxWidth='4.5rem'
        marginTop='1.5rem'
        flexDirection='column'
        justify='space-between'
        alignItems='center'
        h='85.5vh'
      >
        <Flex flexDirection='column' align='center'>
          <NavIcon 
            image={icon_profile} 
            onClick={profileOnOpen} 
            size='normal'
            isMap={false}
            mouseOver={USER_PROFILE}
          />

          <NavIcon 
            image={icon_shop} 
            onClick={handleStore} 
            size='normal'
            isMap={false}
            mouseOver={STORE}
          />

          <NavIcon 
            image={inventory_icon} 
            onClick={handleInventory} 
            size='normal'
            isMap={false}
            mouseOver={INVENTORY}
          />

          <NavIcon 
            image={icon_tutorial} 
            onClick={tutorialOnOpen} 
            size='small'
            isMap={false}
            mouseOver={TUTORIAL}
          />

          <NavIcon 
            image={icon_logout} 
            onClick={logout} 
            size='small'
            isMap={false}
            mouseOver={LOG_OUT}
          />
        </Flex>

        {
          !dontShowMap &&
          <NavIcon
            image={icon_map}
            onClick={() => history.push('/mainPage')}
            size='big'
            isMap={true}
            mouseOver={MAP}
           />
        }
      </Flex>

      <ProfileModal isOpen={profileIsOpen} onClose={profileOnClose} />

      <TutorialModal
        isOpen={tutorialIsOpen}
        onClose={tutorialOnClose}
        onToggle={tutorialOnToggle}
      />
    </>
  )
}

export default NavActions;
