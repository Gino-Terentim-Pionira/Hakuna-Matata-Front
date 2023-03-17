import { Flex, Center, Image, useDisclosure } from "@chakra-ui/react";
import React from "react";
import TutorialModal from "./modals/TutorialModal";

import icon_profile from '../assets/icons/icon_profile.svg';
import icon_tutorial from '../assets/icons/icon_tutorial.svg';
import icon_shop from '../assets/icons/icon_shop.svg';
import icon_map from '../assets/icons/icon_map.svg';
import icon_map_opened from '../assets/icons/icon_map_opened.svg';
import icon_logout from '../assets/icons/icon_logout.svg';
import ProfileModal from "./modals/ProfileModal";
import { useHistory } from "react-router-dom";

interface NavActionsInterface {
  logout: VoidFunction;
  dontShowMap?: boolean;
  prePath: string;
}

const NavActions = ({ logout, dontShowMap, prePath }: NavActionsInterface) => {
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
          <Center
            _hover={{
              cursor: 'pointer',
              transform: 'scale(1.1)',
            }}
            transition='all 0.2s ease'
            mb='.75rem'
            border='2px solid black'
            borderRadius='4.5rem'
            width='4.5rem'
            height='4.5rem'
            bg='white'
            onClick={profileOnOpen}
          >
            <Image
              src={icon_profile}
              marginBottom='.5rem'
            />
          </Center>

          <Center
            _hover={{
              cursor: 'pointer',
              transform: 'scale(1.1)',
            }}
            transition='all 0.2s ease'
            mb='.75rem'
            border='2px solid black'
            borderRadius='4.5rem'
            width='4.5rem'
            height='4.5rem'
            bg='white'
            onClick={() => history.push({ pathname: '/shop', state: { prePath } })}
          >
            <Image
              src={icon_shop}
              marginBottom='.1rem'
            />
          </Center>

          <Center
            _hover={{
              cursor: 'pointer',
              transform: 'scale(1.1)',
            }}
            transition='all 0.2s ease'
            mb='.75rem'
            border='2px solid black'
            borderRadius='4.5rem'
            width='3.75rem'
            height='3.75rem'
            bg='white'
            onClick={tutorialOnOpen}
          >
            <Image src={icon_tutorial} />
          </Center>

          <Center
            _hover={{
              cursor: 'pointer',
              transform: 'scale(1.1)',
            }}
            transition='all 0.2s ease'
            mb='.75rem'
            border='2px solid black'
            borderRadius='4.5rem'
            width='3.75rem'
            height='3.75rem'
            bg='white'
            onClick={logout}
          >
            <Image src={icon_logout} />
          </Center>
        </Flex>

        {
          !dontShowMap && <Center
            _hover={{
              cursor: 'pointer',
              transform: 'scale(1.1)',
            }}
            transition='all 0.2s ease'
            border='2px solid black'
            borderRadius='4.5rem'
            width='6.55rem'
            height='6.55rem'
            bg='white'
            onClick={() => history.push('/mainPage')}
          >
            <Image
              src={icon_map}
              onMouseOverCapture={(e) =>
                (e.currentTarget.src = icon_map_opened)
              }
              onMouseOut={(e) =>
                (e.currentTarget.src = icon_map)
              }
            />
          </Center>
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
