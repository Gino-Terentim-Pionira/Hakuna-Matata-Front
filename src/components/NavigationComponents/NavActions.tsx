import { Flex, useDisclosure } from "@chakra-ui/react";
import React from "react";

import TutorialVideoModal from "../modals/TutorialModal";
import DefaultNarrativeModal from '../modals/Narrative/DefaultNarrativeModal';
import { useUser } from '../../hooks';

import icon_tutorial from '../../assets/icons/icon_tutorial.svg';
import icon_shop from '../../assets/icons/icon_shop.svg';
import icon_map from '../../assets/icons/icon_map.svg';
import icon_logout from '../../assets/icons/icon_logout.svg';
import inventory_icon from '../../assets/icons/inventory.png';
import chat from '../../assets/icons/chat.png'
import ProfileModal from "../modals/ProfileModal/ProfileModal";
import NavIcon from "./NavIcon";
import { useHistory } from "react-router-dom";
import { USER_PROFILE, STORE, INVENTORY, TUTORIAL, LOG_OUT, MAP, CHAT } from "../../utils/constants/mouseOverConstants";
import usePath from "../../hooks/usePath";
import useIgnoranceFilter from "../../hooks/useIgnoranceFilter";
import chatScript from '../../utils/scripts/Baboon/chatScript';
import {TutorialModal} from "../modals/Tutorial/TutorialModal";

interface NavActionsInterface {
  logout: VoidFunction;
  dontShowMap?: boolean;
}

const NavActions = ({ logout, dontShowMap }: NavActionsInterface) => {
  const { userData } = useUser();
  const { handlePath } = usePath();
  const { isIgnoranceFilterOn } = useIgnoranceFilter();
  const scriptChat = () => chatScript(userData.ignorance)

  const {
    isOpen: profileIsOpen,
    onClose: profileOnClose,
    onOpen: profileOnOpen
  } = useDisclosure();

  const {
    isOpen: narrativeIsOpen,
    onOpen: narrativeOnOpen,
    onToggle: narrativeOnToggle,
  } = useDisclosure();

  const {
    isOpen: tutorialTopicIsOpen,
    onClose: tutorialTopicOnClose,
    onOpen: tutorialTopicOnOpen,
  } = useDisclosure();

  const {
    isOpen: tutorialIsOpen,
    onClose: tutorialOnClose,
    onOpen: tutorialOnOpen,
  } = useDisclosure();

  const history = useHistory();

  const handleStore = () => {
    handlePath('/shop');
  }

  const handleInventory = () => {
    handlePath('/inventory');
  }

  const handleChat = () => {
    narrativeOnOpen();
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
            image="profile"
            onClick={profileOnOpen}
            size='normal'
            isMap={false}
            mouseOver={USER_PROFILE}
          />

          {!isIgnoranceFilterOn && <NavIcon
            image={icon_shop}
            onClick={handleStore}
            size='normal'
            isMap={false}
            mouseOver={STORE}
          />}

          {!isIgnoranceFilterOn && <NavIcon
            image={inventory_icon}
            onClick={handleInventory}
            size='normal'
            isMap={false}
            mouseOver={INVENTORY}
          />}

          {isIgnoranceFilterOn && <NavIcon
            image={chat}
            onClick={handleChat}
            size='normal'
            isMap={false}
            mouseOver={CHAT}
          />}

          <NavIcon
            image={icon_tutorial}
            onClick={tutorialTopicOnOpen}
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

      <TutorialVideoModal
        isOpen={tutorialIsOpen}
        onClose={tutorialOnClose}
      />
      <TutorialModal isOpen={tutorialTopicIsOpen} onClose={tutorialTopicOnClose} />

      <DefaultNarrativeModal
        isOpen={narrativeIsOpen}
        onToggle={narrativeOnToggle}
        script={scriptChat()}
      />
    </>
  )
}

export default NavActions;
