import {Box, Flex, useDisclosure} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import DefaultNarrativeModal from '../modals/Narrative/DefaultNarrativeModal';
import { useUser } from '../../hooks';
import TutorialServices from "../../services/TutorialServices";

import icon_tutorial from '../../assets/icons/icon_tutorial.svg';
import icon_shop from '../../assets/icons/icon_shop.svg';
import icon_map from '../../assets/icons/icon_map.svg';
import icon_logout from '../../assets/icons/icon_logout.svg';
import inventory_icon from '../../assets/icons/inventory.png';
import chat from '../../assets/icons/chat.png'
import ProfileModal from "../modals/ProfileModal/ProfileModal";
import NavIcon from "./NavIcon";
import { useHistory } from "react-router-dom";
import {
  USER_PROFILE,
  STORE,
  INVENTORY,
  TUTORIAL,
  LOG_OUT,
  MAP,
  CHAT,
} from "../../utils/constants/mouseOverConstants";
import usePath from "../../hooks/usePath";
import useIgnoranceFilter from "../../hooks/useIgnoranceFilter";
import chatScript from '../../utils/scripts/Baboon/chatScript';
import {TutorialModal} from "../modals/Tutorial/TutorialModal";
import { NavSoundtrackIcon } from "./NavSoundtrackIcon";
import useShopItems from "../../hooks/useShopItems";
import { ShopModal } from "../modals/ShopModal/ShopModal";

interface NavActionsInterface {
  logout: VoidFunction;
  dontShowMap?: boolean;
}

const NavActions = ({ logout, dontShowMap }: NavActionsInterface) => {
  const { userData } = useUser();
  const { handlePath } = usePath();
  const tutorialServices = new TutorialServices();
  const { isIgnoranceFilterOn } = useIgnoranceFilter();
  const scriptChat = () => chatScript(userData.ignorance);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
  const [onCloseTutorial, setOnCloseTutorial] = useState<VoidFunction>();
  const {
    getNewOraclePackagesItem,
    getNewCertificateItems,
    getNewShopItems,
    shopItemsData,
    certificatesItemData,
    oraclePackagesItemData
  } = useShopItems();

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
    isOpen: shopIsOpen,
    onClose: shopOnClose,
    onOpen: shopOnOpen
  } = useDisclosure();

  const history = useHistory();

  const handleShop = () => {
    shopOnOpen()
  }

  const handleInventory = () => {
    handleFirstView('Inventário', () => handlePath('/inventory'));
  }

  const handleChat = () => {
    narrativeOnOpen();
  }

  const handleFirstView = (topic_name: string, action: VoidFunction) => {
    if (tutorialServices.checkFirstVisualization(topic_name)) {
      setOnCloseTutorial(() => action);
      setSelectedTopic(topic_name);
      tutorialTopicOnOpen();
    } else {
      action();
    }
  }

  const handleProfileOpen = () => {
    handleFirstView('Perfil de usuário', profileOnOpen);
  }

  const handleTutorialClose = () => {
    tutorialTopicOnClose();
    if (onCloseTutorial) onCloseTutorial();
    setOnCloseTutorial(undefined);
  }

  const handleMapNavigation = () => {
    const path = '/mainPage';
    history.push(path)
  }

  useEffect(() => {
    !certificatesItemData.length && getNewCertificateItems().then();
    !shopItemsData.length && getNewShopItems().then();
    !oraclePackagesItemData.length && getNewOraclePackagesItem().then();
  }, []);

  return (
    <>
      <Flex
        maxWidth='fit-content'
        marginTop='1.5rem'
        flexDirection='column'
        justify='space-between'
        h='85.5vh'
      >
        <Flex flexDirection='column' align='flex-start'>
          <Flex columnGap='8px' align='center'>
            <NavIcon
              image="profile"
              onClick={handleProfileOpen}
              size='normal'
              isMap={false}
              mouseOver={USER_PROFILE}
            />

            <NavSoundtrackIcon />
          </Flex>

          {!isIgnoranceFilterOn && <NavIcon
            image={icon_shop}
            onClick={handleShop}
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

          <Box marginLeft="7px">
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
          </Box>
        </Flex>

        {
          !dontShowMap &&
          <NavIcon
            image={icon_map}
            onClick={handleMapNavigation}
            size='big'
            isMap={true}
            mouseOver={MAP}
          />
        }
      </Flex>

      <ProfileModal isOpen={profileIsOpen} onClose={profileOnClose} />

      <TutorialModal isOpen={tutorialTopicIsOpen} onClose={handleTutorialClose} selectedTopic={selectedTopic} />

      <DefaultNarrativeModal
        isOpen={narrativeIsOpen}
        onToggle={narrativeOnToggle}
        script={scriptChat()}
      />

      { shopItemsData.length &&
          <ShopModal
              isOpen={shopIsOpen}
              onClose={shopOnClose}
              oraclePackages={oraclePackagesItemData}
              shopItems={shopItemsData}
              certificates={certificatesItemData}
              showQuickFilters
          />
      }
    </>
  )
}

export default NavActions;
